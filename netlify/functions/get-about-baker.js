const { getSiteContentStore } = require("./_blob-store");
const defaultAboutBaker = require("../../data/default-about-baker.json");

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
  const fallbackParagraphs = normalizeParagraphs(defaultAboutBaker.paragraphs);

  return {
    paragraphs: paragraphs.length === 3 ? paragraphs : fallbackParagraphs
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
    const savedAboutBaker = await store.get("about-baker", { type: "json" });

    if (!savedAboutBaker) {
      return jsonResponse(200, normalizeAboutBakerData(defaultAboutBaker));
    }

    return jsonResponse(200, normalizeAboutBakerData(savedAboutBaker));
  } catch (err) {
    console.error("Failed to load About the Baker data.", err);

    return jsonResponse(200, normalizeAboutBakerData(defaultAboutBaker));
  }
};
