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
      error: "Admin cookie request delete is not configured."
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

  if (!id) {
    return jsonResponse(400, {
      error: "Request ID is required."
    });
  }

  try {
    const store = getSiteContentStore();
    const savedData = await store.get("cookie-requests", { type: "json" });
    const existingRequests = normalizeStoredRequests(savedData);
    const requests = existingRequests.filter(request => request.id !== id);

    if (requests.length === existingRequests.length) {
      return jsonResponse(404, {
        error: "Cookie request not found."
      });
    }

    await store.setJSON("cookie-requests", {
      requests
    });

    return jsonResponse(200, {
      success: true,
      deletedId: id
    });
  } catch (err) {
    console.error("Failed to delete cookie request.", err);

    return jsonResponse(500, {
      error: "Could not delete cookie request."
    });
  }
};
