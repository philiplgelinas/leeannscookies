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
    .slice(0, 5);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidEventDate(eventDate) {
  return /^\d{4}-\d{2}-\d{2}$/.test(eventDate);
}

function normalizeCookieRequest(data) {
  const name = normalizeString(data.name);
  const email = normalizeString(data.email).toLowerCase();
  const phone = normalizeString(data.phone);
  const eventDate = normalizeString(data.eventDate);
  const quantity = normalizeQuantity(data.quantity);
  const estimatedPrice = normalizeString(data.estimatedPrice);
  const theme = normalizeString(data.theme);
  const inspo = normalizeString(data.inspo);
  const details = normalizeString(data.details);
  const images = normalizeImages(data.images);

  if (!name) {
    return {
      valid: false,
      error: "Name is required."
    };
  }

  if (!email || !isValidEmail(email)) {
    return {
      valid: false,
      error: "A valid email is required."
    };
  }

  if (!eventDate || !isValidEventDate(eventDate)) {
    return {
      valid: false,
      error: "Event date is required."
    };
  }

  if (!quantity) {
    return {
      valid: false,
      error: "Estimated quantity is required."
    };
  }

  if (!theme) {
    return {
      valid: false,
      error: "Theme or occasion is required."
    };
  }

  if (!details) {
    return {
      valid: false,
      error: "Details are required."
    };
  }

  return {
    valid: true,
    request: {
      id: `request-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      status: "pending",
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
    }
  };
}

function normalizeStoredRequests(data) {
  if (!data || !Array.isArray(data.requests)) {
    return [];
  }

  return data.requests.filter(request => request && request.id);
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  const body = parseBody(event);
  const normalized = normalizeCookieRequest(body);

  if (!normalized.valid) {
    return jsonResponse(400, {
      error: normalized.error
    });
  }

  try {
    const store = getSiteContentStore();
    const savedData = await store.get("cookie-requests", { type: "json" });
    const existingRequests = normalizeStoredRequests(savedData);

    const requests = [
      normalized.request,
      ...existingRequests
    ];

    await store.setJSON("cookie-requests", {
      requests
    });

    return jsonResponse(200, {
      success: true,
      request: normalized.request
    });
  } catch (err) {
    console.error("Failed to save cookie request.", err);

    return jsonResponse(500, {
      error: "Could not save cookie request."
    });
  }
};
