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

const defaultPromoCodes = [
  {
    id: "promo-share15",
    code: "SHARE15",
    discountPercent: 15
  }
];

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

function normalizePromoCodesData(data) {
  const hasSavedPromoCodes = data && Array.isArray(data.promoCodes);
  const promoCodes = hasSavedPromoCodes ? data.promoCodes : defaultPromoCodes;

  return promoCodes
    .map(promoCode => {
      const code = normalizePromoCode(promoCode.code);
      const discountPercent = normalizeDiscountPercent(promoCode.discountPercent);

      return {
        id: normalizeString(promoCode.id) || `promo-${code.toLowerCase()}`,
        code,
        discountPercent
      };
    })
    .filter(promoCode =>
      promoCode.id &&
      promoCode.code &&
      Number.isInteger(promoCode.discountPercent)
    );
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  try {
    const store = getSiteContentStore();
    const savedData = await store.get("promo-codes", { type: "json" });

    return jsonResponse(200, {
      promoCodes: normalizePromoCodesData(savedData)
    });
  } catch (err) {
    console.error("Failed to load promo codes.", err);

    return jsonResponse(500, {
      error: "Could not load promo codes."
    });
  }
};
