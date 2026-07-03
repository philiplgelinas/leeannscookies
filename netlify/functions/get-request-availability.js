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
    noticePeriodDays: normalizeNonNegativeInteger(data?.noticePeriodDays, 0),
    weeklyCapacityCookies: normalizeNonNegativeInteger(data?.weeklyCapacityCookies, 0),
    vacationDays: normalizeVacationDays(data?.vacationDays)
  };
}

function getLocalDateFromDateKey(dateKey) {
  const parts = normalizeString(dateKey).split("-").map(Number);

  if (parts.length !== 3 || parts.some(part => !Number.isInteger(part))) {
    return null;
  }

  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function getDateKeyFromDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getWeekStartKey(dateKey) {
  const date = getLocalDateFromDateKey(dateKey);

  if (!date) {
    return "";
  }

  date.setDate(date.getDate() - date.getDay());

  return getDateKeyFromDate(date);
}

function normalizeStoredRequests(data) {
  if (!data || !Array.isArray(data.requests)) {
    return [];
  }

  return data.requests.filter(request => request && request.id);
}

function summarizeAcceptedCookiesByDate(requests) {
  return requests.reduce((dailyTotals, request) => {
    const status = normalizeString(request.status).toLowerCase();
    const eventDate = normalizeString(request.eventDate);
    const quantity = Number.parseInt(request.quantity, 10);

    if (status !== "accepted" || !isValidDateKey(eventDate) || !Number.isInteger(quantity) || quantity <= 0) {
      return dailyTotals;
    }

    dailyTotals[eventDate] = (dailyTotals[eventDate] || 0) + quantity;

    return dailyTotals;
  }, {});
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  try {
    const store = getSiteContentStore();
    const [scheduleData, cookieRequestsData] = await Promise.all([
      store.get("schedule-settings", { type: "json" }),
      store.get("cookie-requests", { type: "json" })
    ]);

    const schedule = normalizeScheduleData(scheduleData);
    const requests = normalizeStoredRequests(cookieRequestsData);

    return jsonResponse(200, {
      schedule,
      scheduledCookiesByDate: summarizeAcceptedCookiesByDate(requests)
    });
  } catch (err) {
    console.error("Failed to load request availability.", err);

    return jsonResponse(500, {
      error: "Could not load request availability."
    });
  }
};
