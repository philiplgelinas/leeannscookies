const crypto = require("crypto");
const { getStore } = require("@netlify/blobs");

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

function normalizePricingData(data) {
  const pricing = Array.isArray(data?.pricing) ? data.pricing : [];

  const normalizedPricing = pricing.map(item => ({
    id: String(item.id || crypto.randomUUID()),
    quantity: Number.parseInt(item.quantity, 10),
    price: Number.parseInt(item.price, 10)
  }));

  const hasInvalidItem = normalizedPricing.some(item =>
    !item.id ||
    !Number.isInteger(item.quantity) ||
    item.quantity <= 0 ||
    !Number.isInteger(item.price) ||
    item.price <= 0
  );

  if (!normalizedPricing.length) {
    return {
      valid: false,
      error: "At least one pricing card is required."
    };
  }

  if (hasInvalidItem) {
    return {
      valid: false,
      error: "Each pricing card must have a positive quantity and positive price."
    };
  }

  return {
    valid: true,
    data: {
      pricing: normalizedPricing
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
      error: "Admin save is not configured."
    });
  }

  const session = verifySession(event, adminSessionSecret);

  if (!session) {
    return jsonResponse(401, {
      error: "Unauthorized."
    });
  }

  const body = parseBody(event);
  const normalized = normalizePricingData(body);

  if (!normalized.valid) {
    return jsonResponse(400, {
      error: normalized.error
    });
  }

  try {
    const store = getStore("site-content");
    await store.setJSON("pricing", normalized.data);

    return jsonResponse(200, {
      success: true,
      pricing: normalized.data.pricing
    });
  } catch (err) {
    console.error("Failed to save pricing data.", err);

    return jsonResponse(500, {
      error: "Could not save pricing data."
    });
  }
};
