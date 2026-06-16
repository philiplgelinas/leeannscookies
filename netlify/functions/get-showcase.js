const { getSiteContentStore } = require("./_blob-store");
const defaultShowcase = require("../../data/default-showcase.json");

const allowedTags = ["minimal", "floral", "kids", "lux"];

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

function normalizeShowcaseItems(showcase) {
  if (!Array.isArray(showcase)) {
    return [];
  }

  return showcase
    .map(item => {
      const id = normalizeString(item.id);
      const title = normalizeString(item.title);
      const descriptions = normalizeDescriptions(item.descriptions);
      const tags = normalizeTags(item.tags);
      const image = normalizeImage(item.image);

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
    })
    .filter(item =>
      item.id &&
      item.title &&
      item.descriptions.length &&
      item.tags.length &&
      item.image
    );
}

function normalizeFeaturedShowcaseId(featuredShowcaseId, showcase) {
  const selectedId = normalizeString(featuredShowcaseId);
  const defaultFeaturedId = normalizeString(defaultShowcase.featuredShowcaseId) || "showcase-rehearsal-dinner";

  if (selectedId && showcase.some(item => item.id === selectedId)) {
    return selectedId;
  }

  if (defaultFeaturedId && showcase.some(item => item.id === defaultFeaturedId)) {
    return defaultFeaturedId;
  }

  return showcase[0]?.id || "";
}

function normalizeShowcaseData(data) {
  const normalizedShowcase = normalizeShowcaseItems(data?.showcase);
  const fallbackShowcase = normalizeShowcaseItems(defaultShowcase.showcase);
  const showcase = normalizedShowcase.length ? normalizedShowcase : fallbackShowcase;

  return {
    featuredShowcaseId: normalizeFeaturedShowcaseId(data?.featuredShowcaseId, showcase),
    showcase
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  try {
    const store = getSiteContentStore();
    const savedShowcase = await store.get("showcase", { type: "json" });

    if (!savedShowcase) {
      return jsonResponse(200, normalizeShowcaseData(defaultShowcase));
    }

    return jsonResponse(200, normalizeShowcaseData(savedShowcase));
  } catch (err) {
    console.error("Failed to load showcase data.", err);

    return jsonResponse(200, normalizeShowcaseData(defaultShowcase));
  }
};
