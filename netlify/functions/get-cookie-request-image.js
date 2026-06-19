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

function normalizeString(value) {
  return String(value || "").trim();
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  const key = normalizeString(event.queryStringParameters?.key);

  if (!key || !key.startsWith("cookie-request-images/")) {
    return jsonResponse(400, {
      error: "Valid image key is required."
    });
  }

  try {
    const store = getSiteContentStore();
    const image = await store.get(key, { type: "arrayBuffer" });

    if (!image) {
      return jsonResponse(404, {
        error: "Image not found."
      });
    }

    const metadata = await store.getMetadata(key);
    const contentType = metadata?.metadata?.contentType || "application/octet-stream";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable"
      },
      body: Buffer.from(image).toString("base64"),
      isBase64Encoded: true
    };
  } catch (err) {
    console.error("Failed to load cookie request image.", err);

    return jsonResponse(500, {
      error: "Could not load cookie request image."
    });
  }
};
