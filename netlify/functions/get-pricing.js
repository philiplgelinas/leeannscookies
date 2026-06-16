const { getSiteContentStore } = require("./_blob-store");

const defaultPricing = {
  pricing: [
    { id: "set-6", quantity: 6, price: 18 },
    { id: "set-12", quantity: 12, price: 33 },
    { id: "set-24", quantity: 24, price: 60 },
    { id: "set-48", quantity: 48, price: 108 },
    { id: "set-96", quantity: 96, price: 192 }
  ]
};

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

function normalizePricingData(data) {
  const pricing = Array.isArray(data?.pricing) ? data.pricing : [];

  const normalizedPricing = pricing
    .map(item => ({
      id: String(item.id || ""),
      quantity: Number.parseInt(item.quantity, 10),
      price: Number.parseInt(item.price, 10)
    }))
    .filter(item =>
      item.id &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      Number.isInteger(item.price) &&
      item.price > 0
    );

  return normalizedPricing.length ? { pricing: normalizedPricing } : defaultPricing;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  try {
    const store = getSiteContentStore();
    const savedPricing = await store.get("pricing", { type: "json" });

    if (!savedPricing) {
      return jsonResponse(200, defaultPricing);
    }

    return jsonResponse(200, normalizePricingData(savedPricing));
  } catch (err) {
    console.error("Failed to load pricing data.", err);

    return jsonResponse(200, defaultPricing);
  }
};
