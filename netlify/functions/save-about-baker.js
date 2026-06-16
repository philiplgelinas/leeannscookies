const { getSiteContentStore } = require("./_blob-store");

const {
  jsonResponse,
  verifySession
} = require("./_admin-auth");

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

function normalizeParagraphs(paragraphs) {
  if (!Array.isArray(paragraphs)) {
    return [];
  }

  return paragraphs
    .map(paragraph => normalizeString(paragraph))
    .filter(Boolean)
    .slice(0, 3);
}

function normalizeAboutBakerData(data) {
  const paragraphs = normalizeParagraphs(data?.paragraphs);

  if (paragraphs.length !== 3) {
    return {
      valid: false,
      error: "All three About the Baker paragraphs are required."
    };
  }

  return {
    valid: true,
    data: {
      paragraphs
    }
  };
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
      error: "Admin About the Baker save is not configured."
    });
  }

  const session = verifySession(event, adminSessionSecret);

  if (!session) {
    return jsonResponse(401, {
      error: "Unauthorized."
    });
  }

  const body = parseBody(event);
  const normalized = normalizeAboutBakerData(body);

  if (!normalized.valid) {
    return jsonResponse(400, {
      error: normalized.error
    });
  }

  try {
    const store = getSiteContentStore();
    await store.setJSON("about-baker", normalized.data);

    return jsonResponse(200, {
      success: true,
      paragraphs: normalized.data.paragraphs
    });
  } catch (err) {
    console.error("Failed to save About the Baker data.", err);

    return jsonResponse(500, {
      error: "Could not save About the Baker data."
    });
  }
};
