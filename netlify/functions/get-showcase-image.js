const { getSiteContentStore } = require("./_blob-store");

const allowedImageContentTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif"
};

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

function normalizeString(value) {
  return String(value || "").trim();
}

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch (err) {
    return value;
  }
}

function getContentTypeFromKey(key) {
  const lowerKey = key.toLowerCase();
  const extension = Object.keys(allowedImageContentTypes).find(ext => lowerKey.endsWith(ext));

  return extension ? allowedImageContentTypes[extension] : "application/octet-stream";
}

function isAllowedImageKey(key) {
  if (!key) {
    return false;
  }

  if (!key.startsWith("showcase-images/")) {
    return false;
  }

  if (key.includes("..") || key.startsWith("/") || key.includes("\\")) {
    return false;
  }

  return Object.keys(allowedImageContentTypes).some(ext => key.toLowerCase().endsWith(ext));
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  const rawKey = normalizeString(event.queryStringParameters?.key);
  const key = normalizeString(safeDecodeURIComponent(rawKey));

  if (!isAllowedImageKey(key)) {
    return jsonResponse(400, {
      error: "Invalid image key."
    });
  }

  try {
    const store = getSiteContentStore();
    const result = await store.getWithMetadata(key, {
      type: "arrayBuffer"
    });

    if (!result || !result.data) {
      return jsonResponse(404, {
        error: "Image not found."
      });
    }

    const contentType = normalizeString(result.metadata?.contentType) || getContentTypeFromKey(key);
    const imageBuffer = Buffer.from(result.data);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable"
      },
      body: imageBuffer.toString("base64"),
      isBase64Encoded: true
    };
  } catch (err) {
    console.error("Failed to load showcase image.", err);

    return jsonResponse(500, {
      error: "Could not load showcase image."
    });
  }
};
