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

function normalizeNonNegativeInteger(value) {
  const numberValue = Number.parseInt(value, 10);

  return Number.isInteger(numberValue) && numberValue >= 0 ? numberValue : null;
}

function isValidDateKey(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(normalizeString(value));
}

function normalizeVacationDays(vacationDays) {
  if (!Array.isArray(vacationDays)) {
    return [];
  }

  return [...new Set(
    vacationDays
      .map(day => normalizeString(day))
      .filter(isValidDateKey)
  )].sort();
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
      error: "Admin schedule is not configured."
    });
  }

  const session = verifySession(event, adminSessionSecret);

  if (!session) {
    return jsonResponse(401, {
      error: "Unauthorized."
    });
  }

  const body = parseBody(event);
  const noticePeriodDays = normalizeNonNegativeInteger(body.noticePeriodDays);
  const weeklyCapacityCookies = normalizeNonNegativeInteger(body.weeklyCapacityCookies);
  const vacationDays = normalizeVacationDays(body.vacationDays);

  if (noticePeriodDays === null) {
    return jsonResponse(400, {
      error: "Notice period must be a valid non-negative number of days."
    });
  }

  if (weeklyCapacityCookies === null) {
    return jsonResponse(400, {
      error: "Weekly capacity must be a valid non-negative number of cookies."
    });
  }

  const schedule = {
    noticePeriodDays,
    weeklyCapacityCookies,
    vacationDays,
    updatedAt: new Date().toISOString()
  };

  try {
    const store = getSiteContentStore();

    await store.setJSON("schedule-settings", schedule);

    return jsonResponse(200, {
      success: true,
      schedule
    });
  } catch (err) {
    console.error("Failed to save schedule settings.", err);

    return jsonResponse(500, {
      error: "Could not save schedule settings."
    });
  }
};
