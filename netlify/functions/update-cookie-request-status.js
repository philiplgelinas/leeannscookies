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

function normalizeStatus(value) {
  const status = normalizeString(value).toLowerCase();
  const allowedStatuses = ["pending", "accepted", "completed"];

  return allowedStatuses.includes(status) ? status : "";
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
  const status = normalizeStatus(body.status);

  if (!id) {
    return jsonResponse(400, {
      error: "Request ID is required."
    });
  }

  if (!status) {
    return jsonResponse(400, {
      error: "Valid request status is required."
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

    requests[requestIndex] = {
      ...requests[requestIndex],
      status,
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
    console.error("Failed to update cookie request status.", err);

    return jsonResponse(500, {
      error: "Could not update cookie request."
    });
  }
};
