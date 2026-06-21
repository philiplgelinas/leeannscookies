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

function normalizeQuantity(value) {
  const quantity = Number.parseInt(value, 10);
  return Number.isInteger(quantity) && quantity > 0 ? quantity : null;
}

function normalizePrice(value) {
  const rawValue = normalizeString(value);
  const numericValue = Number.parseFloat(rawValue.replace(/[^0-9.]/g, ""));

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return "";
  }

  return numericValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidEventDate(eventDate) {
  return /^\d{4}-\d{2}-\d{2}$/.test(eventDate);
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

  const adminSessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminSessionSecret) {
    console.error("Missing required ADMIN_SESSION_SECRET environment variable.");

    return jsonResponse(500, {
      error: "Admin cookie request updates are not configured."
    });
  }

  const session = verifySession(event, adminSessionSecret);

  if (!session) {
    return jsonResponse(401, {
      error: "Unauthorized."
    });
  }

  const body = parseBody(event);

  const id = normalizeString(body.id);
  const name = normalizeString(body.name);
  const email = normalizeString(body.email).toLowerCase();
  const phone = normalizeString(body.phone);
  const eventDate = normalizeString(body.eventDate);
  const quantity = normalizeQuantity(body.quantity);
  const estimatedPrice = normalizePrice(body.estimatedPrice);
  const finalPrice = normalizePrice(body.finalPrice);
  const theme = normalizeString(body.theme);
  const inspo = normalizeString(body.inspo);
  const details = normalizeString(body.details);

  if (!id) {
    return jsonResponse(400, {
      error: "Request ID is required."
    });
  }

  if (!name) {
    return jsonResponse(400, {
      error: "Name is required."
    });
  }

  if (!email || !isValidEmail(email)) {
    return jsonResponse(400, {
      error: "A valid email is required."
    });
  }

  if (!eventDate || !isValidEventDate(eventDate)) {
    return jsonResponse(400, {
      error: "Event date is required."
    });
  }

  if (!quantity) {
    return jsonResponse(400, {
      error: "Quantity is required."
    });
  }

  if (!theme) {
    return jsonResponse(400, {
      error: "Theme is required."
    });
  }

  if (!details) {
    return jsonResponse(400, {
      error: "Details are required."
    });
  }

  try {
    const store = getSiteContentStore();
    const savedData = await store.get("cookie-requests", { type: "json" });
    const requests = normalizeStoredRequests(savedData);
    const requestIndex = requests.findIndex(request => request.id === id);

    if (requestIndex < 0) {
      return jsonResponse(404, {
        error: "Cookie request not found."
      });
    }

    const existingRequest = requests[requestIndex];

    if (existingRequest.status === "completed" && !finalPrice) {
      return jsonResponse(400, {
        error: "Final price is required for completed requests."
      });
    }

    requests[requestIndex] = {
      ...existingRequest,
      name,
      email,
      phone,
      eventDate,
      quantity,
      estimatedPrice: existingRequest.status === "completed" ? existingRequest.estimatedPrice : estimatedPrice,
      finalPrice: existingRequest.status === "completed" ? finalPrice : existingRequest.finalPrice,
      theme,
      inspo,
      details,
      updatedAt: new Date().toISOString()
    };

    await store.setJSON("cookie-requests", {
      requests
    });

    return jsonResponse(200, {
      success: true,
      request: requests[requestIndex]
    });
  } catch (err) {
    console.error("Failed to update cookie request.", err);

    return jsonResponse(500, {
      error: "Could not update cookie request."
    });
  }
};
