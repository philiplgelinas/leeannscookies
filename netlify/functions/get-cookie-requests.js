const { getSiteContentStore } = require("./_blob-store");

const {
  jsonResponse,
  verifySession
} = require("./_admin-auth");

function normalizeString(value) {
  return String(value || "").trim();
}

function normalizeQuantity(value) {
  const quantity = Number.parseInt(value, 10);

  return Number.isInteger(quantity) && quantity > 0 ? quantity : null;
}

function normalizeImages(images) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map(image => ({
      fileName: normalizeString(image.fileName),
      contentType: normalizeString(image.contentType),
      key: normalizeString(image.key),
      url: normalizeString(image.url)
    }))
    .filter(image => image.fileName && image.key && image.url)
    .slice(0, 3);
}

function normalizeCookieRequest(request) {
  const id = normalizeString(request?.id);
  const createdAt = normalizeString(request?.createdAt);
  const name = normalizeString(request?.name);
  const email = normalizeString(request?.email);
  const phone = normalizeString(request?.phone);
  const eventDate = normalizeString(request?.eventDate);
  const quantity = normalizeQuantity(request?.quantity);
  const estimatedPrice = normalizeString(request?.estimatedPrice);
  const theme = normalizeString(request?.theme);
  const inspo = normalizeString(request?.inspo);
  const details = normalizeString(request?.details);
  const images = normalizeImages(request?.images);

  if (!id || !createdAt || !name || !email || !eventDate || !quantity || !theme || !details) {
    return null;
  }

  return {
    id,
    createdAt,
    name,
    email,
    phone,
    eventDate,
    quantity,
    estimatedPrice,
    theme,
    inspo,
    details,
    images
  };
}

function normalizeCookieRequestsData(data) {
  const requests = Array.isArray(data?.requests) ? data.requests : [];

  return requests
    .map(normalizeCookieRequest)
    .filter(Boolean)
    .sort((a, b) => {
      const eventDateSort = a.eventDate.localeCompare(b.eventDate);

      if (eventDateSort !== 0) {
        return eventDateSort;
      }

      return b.createdAt.localeCompare(a.createdAt);
    });
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  const adminSessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminSessionSecret) {
    console.error("Missing required ADMIN_SESSION_SECRET environment variable.");

    return jsonResponse(500, {
      error: "Admin cookie requests are not configured."
    });
  }

  const session = verifySession(event, adminSessionSecret);

  if (!session) {
    return jsonResponse(401, {
      error: "Unauthorized."
    });
  }

  try {
    const store = getSiteContentStore();
    const savedData = await store.get("cookie-requests", { type: "json" });

    return jsonResponse(200, {
      requests: normalizeCookieRequestsData(savedData)
    });
  } catch (err) {
    console.error("Failed to load cookie requests.", err);

    return jsonResponse(500, {
      error: "Could not load cookie requests."
    });
  }
};
