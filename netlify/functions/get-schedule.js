const { getSiteContentStore } = require("./_blob-store");

const {
  jsonResponse,
  verifySession
} = require("./_admin-auth");

const defaultSchedule = {
  noticePeriodDays: 0,
  weeklyCapacityCookies: 0,
  vacationDays: []
};

function normalizeString(value) {
  return String(value || "").trim();
}

function normalizeNonNegativeInteger(value, fallbackValue = 0) {
  const numberValue = Number.parseInt(value, 10);

  return Number.isInteger(numberValue) && numberValue >= 0 ? numberValue : fallbackValue;
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

function normalizeScheduleData(data) {
  return {
    noticePeriodDays: normalizeNonNegativeInteger(data?.noticePeriodDays, defaultSchedule.noticePeriodDays),
    weeklyCapacityCookies: normalizeNonNegativeInteger(data?.weeklyCapacityCookies, defaultSchedule.weeklyCapacityCookies),
    vacationDays: normalizeVacationDays(data?.vacationDays)
  };
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
      error: "Admin schedule is not configured."
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
    const savedData = await store.get("schedule-settings", { type: "json" });

    return jsonResponse(200, {
      schedule: normalizeScheduleData(savedData)
    });
  } catch (err) {
    console.error("Failed to load schedule settings.", err);

    return jsonResponse(500, {
      error: "Could not load schedule settings."
    });
  }
};
