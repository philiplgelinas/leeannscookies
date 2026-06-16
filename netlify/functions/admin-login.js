const {
  createSessionCookie,
  jsonResponse,
  safeCompare,
  verifyPassword
} = require("./_admin-auth");

function parseBody(event) {
  try {
    return JSON.parse(event.body || "{}");
  } catch (err) {
    return {};
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminSessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminUsername || !adminPasswordHash || !adminSessionSecret) {
    console.error("Missing required admin environment variables.");

    return jsonResponse(500, {
      error: "Admin login is not configured."
    });
  }

  const body = parseBody(event);
  const username = String(body.username || "").trim();
  const password = String(body.password || "");

  const usernameMatches = safeCompare(username, adminUsername);
  const passwordMatches = verifyPassword(password, adminPasswordHash);

  if (!usernameMatches || !passwordMatches) {
    return jsonResponse(401, {
      error: "Invalid username or password."
    });
  }

  const sessionCookie = createSessionCookie(event, adminUsername, adminSessionSecret);

  return jsonResponse(200, {
    success: true
  }, {
    "Set-Cookie": sessionCookie
  });
};
