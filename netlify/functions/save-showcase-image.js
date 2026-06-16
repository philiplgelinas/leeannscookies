const crypto = require("crypto");

const { getSiteContentStore } = require("./_blob-store");

const {
  jsonResponse,
  verifySession
} = require("./_admin-auth");

const maxImageSizeBytes = 4 * 1024 * 1024;

const allowedImageTypes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif"
};

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

function sanitizeFileName(fileName) {
  return normalizeString(fileName)
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getExtensionFromFileName(fileName) {
  const sanitized = sanitizeFileName(fileName);
  const match = sanitized.match(/\.[a-z0-9]+$/);
  return match ? match[0] : "";
}

function getAllowedExtension(contentType, fileName) {
  const normalizedContentType = normalizeString(contentType).toLowerCase();
  const extensionFromType = allowedImageTypes[normalizedContentType];

  if (!extensionFromType) {
    return "";
  }

  const extensionFromName = getExtensionFromFileName(fileName);

  if (extensionFromName && Object.values(allowedImageTypes).includes(extensionFromName)) {
    return extensionFromName === ".jpeg" ? ".jpg" : extensionFromName;
  }

  return extensionFromType;
}

function normalizeBase64Data(dataBase64) {
  const value = normalizeString(dataBase64);

  if (value.includes(",")) {
    return value.split(",").pop();
  }

  return value;
}

function buildImageUrl(key) {
  return `/.netlify/functions/get-showcase-image?key=${encodeURIComponent(key)}`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  const adminSessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminSessionSecret) {
    console.error("Missing required ADMIN_SESSION_SECRET environment variable.");

    return jsonResponse(500, {
      error: "Admin image upload is not configured."
    });
  }

  const session = verifySession(event, adminSessionSecret);

  if (!session) {
    return jsonResponse(401, {
      error: "Unauthorized."
    });
  }

  const body = parseBody(event);
  const fileName = normalizeString(body.fileName);
  const contentType = normalizeString(body.contentType).toLowerCase();
  const dataBase64 = normalizeBase64Data(body.dataBase64);
  const extension = getAllowedExtension(contentType, fileName);

  if (!fileName || !contentType || !dataBase64) {
    return jsonResponse(400, {
      error: "Missing image upload data."
    });
  }

  if (!extension) {
    return jsonResponse(400, {
      error: "Please upload a JPG, PNG, WEBP, or GIF image."
    });
  }

  let imageBuffer;

  try {
    imageBuffer = Buffer.from(dataBase64, "base64");
  } catch (err) {
    return jsonResponse(400, {
      error: "Invalid image data."
    });
  }

  if (!imageBuffer.length) {
    return jsonResponse(400, {
      error: "Invalid image data."
    });
  }

  if (imageBuffer.length > maxImageSizeBytes) {
    return jsonResponse(400, {
      error: "Image is too large. Please upload an image that is 4 MB or smaller."
    });
  }

  try {
    const store = getSiteContentStore();
    const imageId = crypto.randomUUID();
    const key = `showcase-images/${imageId}${extension}`;

    await store.set(key, imageBuffer, {
      metadata: {
        contentType,
        originalFileName: sanitizeFileName(fileName),
        uploadedBy: session.username || "admin",
        uploadedAt: new Date().toISOString()
      }
    });

    return jsonResponse(200, {
      success: true,
      image: {
        type: "blob",
        key,
        url: buildImageUrl(key),
        contentType,
        alt: ""
      }
    });
  } catch (err) {
    console.error("Failed to save showcase image.", err);

    return jsonResponse(500, {
      error: "Could not save showcase image."
    });
  }
};
