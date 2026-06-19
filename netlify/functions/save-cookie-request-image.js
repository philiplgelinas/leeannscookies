const crypto = require("crypto");

const { getSiteContentStore } = require("./_blob-store");

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(body)
  };
}

function parseBody(event) {
  try {
    return JSON.parse(event.body || "{}");
  } catch (err) {
    return {};
  }
}

function normalizeString(value) {
  return String(value || "").trim();
}

function getExtension(fileName, contentType) {
  const cleanFileName = normalizeString(fileName).toLowerCase();
  const extensionMatch = cleanFileName.match(/\.(jpg|jpeg|png|webp|gif|heic|heif)$/);

  if (extensionMatch) {
    return extensionMatch[0];
  }

  if (contentType === "image/jpeg") return ".jpg";
  if (contentType === "image/png") return ".png";
  if (contentType === "image/webp") return ".webp";
  if (contentType === "image/gif") return ".gif";
  if (contentType === "image/heic") return ".heic";
  if (contentType === "image/heif") return ".heif";

  return "";
}

function getBase64Payload(dataBase64) {
  const cleanData = normalizeString(dataBase64);
  const commaIndex = cleanData.indexOf(",");

  return commaIndex >= 0 ? cleanData.slice(commaIndex + 1) : cleanData;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  const body = parseBody(event);
  const fileName = normalizeString(body.fileName);
  const contentType = normalizeString(body.contentType);
  const dataBase64 = normalizeString(body.dataBase64);

  const allowedContentTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/heic",
    "image/heif"
  ];

  if (!fileName || !contentType || !dataBase64) {
    return jsonResponse(400, {
      error: "Image file name, content type, and data are required."
    });
  }

  if (!allowedContentTypes.includes(contentType)) {
    return jsonResponse(400, {
      error: "Please upload a JPG, PNG, WEBP, GIF, HEIC, or HEIF image."
    });
  }

  try {
    const extension = getExtension(fileName, contentType);

    if (!extension) {
      return jsonResponse(400, {
        error: "Image file type is not supported."
      });
    }

    const imageBuffer = Buffer.from(getBase64Payload(dataBase64), "base64");
    const key = `cookie-request-images/${crypto.randomUUID()}${extension}`;

    const store = getSiteContentStore();

    await store.set(key, imageBuffer, {
      metadata: {
        contentType,
        fileName
      }
    });

    return jsonResponse(200, {
      success: true,
      image: {
        fileName,
        contentType,
        key,
        url: `/.netlify/functions/get-cookie-request-image?key=${encodeURIComponent(key)}`
      }
    });
  } catch (err) {
    console.error("Failed to save cookie request image.", err);

    return jsonResponse(500, {
      error: "Could not save cookie request image."
    });
  }
};
