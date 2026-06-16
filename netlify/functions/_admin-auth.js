const crypto = require("crypto");

const SESSION_COOKIE_NAME = "lc_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function jsonResponse(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...extraHeaders
    },
    body: JSON.stringify(body)
  };
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value) {
  const padded = value + "=".repeat((4 - value.length % 4) % 4);
  const base64 = padded.replaceAll("-", "+").replaceAll("_", "/");
  return Buffer.from(base64, "base64").toString("utf8");
}

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function parsePasswordHash(passwordHash) {
  const parts = String(passwordHash || "").split("$");

  if (parts.length !== 4 || parts[0] !== "pbkdf2_sha256") {
    return null;
  }

  return {
    algorithm: parts[0],
    iterations: Number.parseInt(parts[1], 10),
    salt: parts[2],
    hash: parts[3]
  };
}

function verifyPassword(password, storedPasswordHash) {
  const parsed = parsePasswordHash(storedPasswordHash);

  if (!parsed || !Number.isInteger(parsed.iterations) || parsed.iterations <= 0 || !parsed.salt || !parsed.hash) {
    return false;
  }

  const generatedHash = crypto
    .pbkdf2Sync(String(password), parsed.salt, parsed.iterations, 64, "sha256")
    .toString("hex");

  return safeCompare(generatedHash, parsed.hash);
}

function signPayload(encodedPayload, sessionSecret) {
  return crypto
    .createHmac("sha256", sessionSecret)
    .update(encodedPayload)
    .digest("hex");
}

function isLocalRequest(event) {
  const host = event.headers.host || event.headers.Host || "";
  return host.includes("localhost") || host.includes("127.0.0.1");
}

function getCookieOptions(event) {
  const secure = !isLocalRequest(event);

  return [
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    secure ? "Secure" : ""
  ].filter(Boolean).join("; ");
}

function createSessionCookie(event, username, sessionSecret) {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const payload = {
    username,
    iat: nowSeconds,
    exp: nowSeconds + SESSION_MAX_AGE_SECONDS
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, sessionSecret);
  const sessionValue = `${encodedPayload}.${signature}`;

  return `${SESSION_COOKIE_NAME}=${sessionValue}; ${getCookieOptions(event)}`;
}

function createExpiredSessionCookie(event) {
  const secure = !isLocalRequest(event);

  return [
    `${SESSION_COOKIE_NAME}=`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    "Max-Age=0",
    secure ? "Secure" : ""
  ].filter(Boolean).join("; ");
}

function getCookies(event) {
  const cookieHeader = event.headers.cookie || event.headers.Cookie || "";

  return cookieHeader.split(";").reduce((cookies, cookie) => {
    const [name, ...valueParts] = cookie.trim().split("=");

    if (!name) {
      return cookies;
    }

    cookies[name] = valueParts.join("=");
    return cookies;
  }, {});
}

function verifySession(event, sessionSecret) {
  const cookies = getCookies(event);
  const sessionCookie = cookies[SESSION_COOKIE_NAME];

  if (!sessionCookie || !sessionCookie.includes(".")) {
    return null;
  }

  const [encodedPayload, signature] = sessionCookie.split(".");
  const expectedSignature = signPayload(encodedPayload, sessionSecret);

  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const nowSeconds = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp < nowSeconds) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

module.exports = {
  createExpiredSessionCookie,
  createSessionCookie,
  jsonResponse,
  safeCompare,
  verifyPassword,
  verifySession
};
