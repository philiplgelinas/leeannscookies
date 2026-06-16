const crypto = require("crypto");

const { getSiteContentStore } = require("./_blob-store");
const defaultShowcase = require("../../data/default-showcase.json");

const {
  jsonResponse,
  verifySession
} = require("./_admin-auth");

const allowedTags = ["minimal", "floral", "kids", "lux"];

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

function normalizeDescriptions(descriptions) {
  if (!Array.isArray(descriptions)) {
    return [];
  }

  return descriptions
    .map(description => normalizeString(description))
    .filter(Boolean)
    .slice(0, 4);
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return [...new Set(
    tags
      .map(tag => normalizeString(tag).toLowerCase())
      .filter(tag => allowedTags.includes(tag))
  )];
}

function normalizeImage(image) {
  if (!image || typeof image !== "object") {
    return null;
  }

  const type = normalizeString(image.type);
  const alt = normalizeString(image.alt);

  if (type === "static") {
    const src = normalizeString(image.src);

    if (!src) {
      return null;
    }

    return {
      type: "static",
      src,
      alt
    };
  }

  if (type === "blob") {
    const key = normalizeString(image.key);
    const url = normalizeString(image.url);
    const contentType = normalizeString(image.contentType);

    if (!key || !url) {
      return null;
    }

    return {
      type: "blob",
      key,
      url,
      contentType,
      alt
    };
  }

  return null;
}

function normalizeFeaturedShowcaseId(featuredShowcaseId, showcase) {
  const selectedId = normalizeString(featuredShowcaseId);
  const defaultFeaturedId = normalizeString(defaultShowcase.featuredShowcaseId) || "showcase-rehearsal-dinner";

  if (selectedId && showcase.some(item => item.id === selectedId)) {
    return selectedId;
  }

  if (selectedId) {
    throw new Error("Featured Showcase card must exist in the Showcase list.");
  }

  if (defaultFeaturedId && showcase.some(item => item.id === defaultFeaturedId)) {
    return defaultFeaturedId;
  }

  return showcase[0]?.id || "";
}

function normalizeShowcaseData(data) {
  const showcase = Array.isArray(data?.showcase) ? data.showcase : [];

  const normalizedShowcase = showcase.map(item => {
    const title = normalizeString(item.title);
    const descriptions = normalizeDescriptions(item.descriptions);
    const tags = normalizeTags(item.tags);
    const image = normalizeImage(item.image);
    const id = normalizeString(item.id) || `showcase-${crypto.randomUUID()}`;

    return {
      id,
      title,
      descriptions,
      tags,
      image: image
        ? {
          ...image,
          alt: image.alt || `${title} cookie set`
        }
        : null
    };
  });

  if (!normalizedShowcase.length) {
    return {
      valid: false,
      error: "At least one showcase card is required."
    };
  }

  const invalidItem = normalizedShowcase.find(item =>
    !item.id ||
    !item.title ||
    !item.descriptions.length ||
    !item.tags.length ||
    !item.image
  );

  if (invalidItem) {
    return {
      valid: false,
      error: "Each showcase card must have a title, at least one description, at least one tag, and an image."
    };
  }

  const featuredShowcaseId = normalizeFeaturedShowcaseId(data?.featuredShowcaseId, normalizedShowcase);

  return {
    valid: true,
    data: {
      featuredShowcaseId,
      showcase: normalizedShowcase
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
      error: "Admin showcase save is not configured."
    });
  }

  const session = verifySession(event, adminSessionSecret);

  if (!session) {
    return jsonResponse(401, {
      error: "Unauthorized."
    });
  }

  const body = parseBody(event);

  let normalized;

  try {
    normalized = normalizeShowcaseData(body);
  } catch (err) {
    return jsonResponse(400, {
      error: err.message || "Invalid featured showcase card."
    });
  }

  if (!normalized.valid) {
    return jsonResponse(400, {
      error: normalized.error
    });
  }

  try {
    const store = getSiteContentStore();
    await store.setJSON("showcase", normalized.data);

    return jsonResponse(200, {
      success: true,
      featuredShowcaseId: normalized.data.featuredShowcaseId,
      showcase: normalized.data.showcase
    });
  } catch (err) {
    console.error("Failed to save showcase data.", err);

    return jsonResponse(500, {
      error: "Could not save showcase data."
    });
  }
};
