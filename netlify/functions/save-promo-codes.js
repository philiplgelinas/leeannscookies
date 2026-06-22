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

function normalizePromoCode(value) {
  return normalizeString(value).replace(/\s+/g, "").toUpperCase();
}

function normalizeDiscountPercent(value) {
  const discountPercent = Number.parseInt(value, 10);

  return Number.isInteger(discountPercent) && discountPercent > 0 && discountPercent <= 100
    ? discountPercent
    : null;
}

function normalizePromoCodes(promoCodes) {
  if (!Array.isArray(promoCodes)) {
    return [];
  }

  const promoCodeMap = new Map();

  promoCodes.forEach(promoCode => {
    const code = normalizePromoCode(promoCode.code);
    const discountPercent = normalizeDiscountPercent(promoCode.discountPercent);

    if (!code || !Number.isInteger(discountPercent)) {
      return;
    }

    promoCodeMap.set(code, {
      id: normalizeString(promoCode.id) || `promo-${code.toLowerCase()}`,
      code,
      discountPercent
    });
  });

  return Array.from(promoCodeMap.values());
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
      error: "Admin promo codes are not configured."
    });
  }

  const session = verifySession(event, adminSessionSecret);

  if (!session) {
    return jsonResponse(401, {
      error: "Unauthorized."
    });
  }

  const body = parseBody(event);
  const promoCodes = normalizePromoCodes(body.promoCodes);

  try {
    const store = getSiteContentStore();

    await store.setJSON("promo-codes", {
      promoCodes
    });

    return jsonResponse(200, {
      success: true,
      promoCodes
    });
  } catch (err) {
    console.error("Failed to save promo codes.", err);

    return jsonResponse(500, {
      error: "Could not save promo codes."
    });
  }
};
