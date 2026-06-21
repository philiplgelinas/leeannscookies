const { getSiteContentStore } = require("./_blob-store");

const {
  jsonResponse,
  verifySession
} = require("./_admin-auth");

const defaultDays = 30;
const maxDays = 365;
const maxStoredEvents = 5000;
const maxRecentActivity = 100;

const eventLabels = {
  page_view: "Page View",
  showcase_filter: "Showcase Filter",
  showcase_lightbox: "Showcase Image Opened",
  featured_lightbox: "Featured Image Opened",
  gallery_page: "Gallery Page Changed",
  request_form_start: "Request Form Started",
  request_submit: "Request Submitted"
};

function normalizeString(value, maxLength = 200) {
  return String(value || "").trim().slice(0, maxLength);
}

function normalizeNumber(value, fallbackValue) {
  const parsedValue = Number.parseInt(value, 10);

  return Number.isInteger(parsedValue) ? parsedValue : fallbackValue;
}

function normalizeDays(value) {
  const days = normalizeNumber(value, defaultDays);

  if (days < 1) {
    return defaultDays;
  }

  return Math.min(days, maxDays);
}

function normalizeAnalyticsEvent(event) {
  if (!event || typeof event !== "object") {
    return null;
  }

  const id = normalizeString(event.id, 160);
  const createdAt = normalizeString(event.createdAt, 80);
  const type = normalizeString(event.type, 80);
  const path = normalizeString(event.path, 300) || "/";
  const visitorId = normalizeString(event.visitorId, 160);
  const sessionId = normalizeString(event.sessionId, 160);
  const metadata = event.metadata && typeof event.metadata === "object" && !Array.isArray(event.metadata)
    ? event.metadata
    : {};

  if (!id || !createdAt || !type) {
    return null;
  }

  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return null;
  }

  return {
    id,
    createdAt,
    type,
    label: eventLabels[type] || type,
    path,
    visitorId,
    sessionId,
    metadata
  };
}

function normalizeStoredEvents(data) {
  if (!data || !Array.isArray(data.events)) {
    return [];
  }

  return data.events
    .map(normalizeAnalyticsEvent)
    .filter(Boolean)
    .slice(0, maxStoredEvents);
}

function getCutoffDate(days) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  cutoffDate.setHours(0, 0, 0, 0);

  return cutoffDate;
}

function isEventWithinDays(event, days) {
  const createdDate = new Date(event.createdAt);
  const cutoffDate = getCutoffDate(days);

  return createdDate >= cutoffDate;
}

function getUniqueCount(events, fieldName) {
  return new Set(
    events
      .map(event => normalizeString(event[fieldName], 160))
      .filter(Boolean)
  ).size;
}

function formatRate(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round(value * 10) / 10;
}

function groupEventsByMetadata(events, metadataKey) {
  const grouped = events.reduce((items, event) => {
    const value = normalizeString(event.metadata?.[metadataKey], 160);

    if (!value) {
      return items;
    }

    items[value] = (items[value] || 0) + 1;

    return items;
  }, {});

  return Object.entries(grouped)
    .map(([label, count]) => ({
      label,
      count
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function getDayKey(date) {
  return date.toISOString().slice(0, 10);
}

function createDailySeries(events, days) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const series = [];

  for (let index = days - 1; index >= 0; index--) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);

    series.push({
      date: getDayKey(date),
      pageViews: 0,
      visitors: 0,
      requestSubmissions: 0,
      showcaseImageOpens: 0
    });
  }

  const seriesByDate = series.reduce((items, item) => {
    items[item.date] = {
      ...item,
      visitorIds: new Set()
    };

    return items;
  }, {});

  events.forEach(event => {
    const date = new Date(event.createdAt);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const dayKey = getDayKey(date);
    const item = seriesByDate[dayKey];

    if (!item) {
      return;
    }

    if (event.type === "page_view") {
      item.pageViews += 1;

      if (event.visitorId) {
        item.visitorIds.add(event.visitorId);
      }
    }

    if (event.type === "request_submit") {
      item.requestSubmissions += 1;
    }

    if (event.type === "showcase_lightbox" || event.type === "featured_lightbox") {
      item.showcaseImageOpens += 1;
    }
  });

  return series.map(item => {
    const itemWithVisitors = seriesByDate[item.date];

    return {
      date: itemWithVisitors.date,
      pageViews: itemWithVisitors.pageViews,
      visitors: itemWithVisitors.visitorIds.size,
      requestSubmissions: itemWithVisitors.requestSubmissions,
      showcaseImageOpens: itemWithVisitors.showcaseImageOpens
    };
  });
}

function createRecentActivity(events) {
  return events
    .slice(0, maxRecentActivity)
    .map(event => ({
      id: event.id,
      createdAt: event.createdAt,
      type: event.type,
      label: event.label,
      path: event.path,
      metadata: event.metadata
    }));
}

function summarizeAnalytics(events, days) {
  const periodEvents = events.filter(event => isEventWithinDays(event, days));
  const pageViewEvents = periodEvents.filter(event => event.type === "page_view");
  const requestSubmitEvents = periodEvents.filter(event => event.type === "request_submit");
  const formStartEvents = periodEvents.filter(event => event.type === "request_form_start");
  const showcaseImageOpenEvents = periodEvents.filter(event =>
    event.type === "showcase_lightbox" ||
    event.type === "featured_lightbox"
  );
  const categoryFilterEvents = periodEvents.filter(event => event.type === "showcase_filter");
  const galleryPageEvents = periodEvents.filter(event => event.type === "gallery_page");

  const visitors = getUniqueCount(pageViewEvents.length ? pageViewEvents : periodEvents, "visitorId");
  const pageViews = pageViewEvents.length;
  const requestSubmissions = requestSubmitEvents.length;
  const requestConversionRate = pageViews
    ? formatRate((requestSubmissions / pageViews) * 100)
    : 0;

  const popularCategories = groupEventsByMetadata(categoryFilterEvents, "filter");
  const popularShowcaseImages = groupEventsByMetadata(showcaseImageOpenEvents, "title");
  const mostPopularCategory = popularCategories[0]?.label || "";

  return {
    days,
    generatedAt: new Date().toISOString(),
    totals: {
      visitors,
      pageViews,
      requestSubmissions,
      requestConversionRate,
      formStarts: formStartEvents.length,
      showcaseImageOpens: showcaseImageOpenEvents.length,
      galleryPageChanges: galleryPageEvents.length,
      mostPopularCategory
    },
    funnel: {
      pageViews,
      formStarts: formStartEvents.length,
      requestSubmissions,
      requestConversionRate
    },
    popularCategories,
    popularShowcaseImages,
    dailySeries: createDailySeries(periodEvents, days),
    recentActivity: createRecentActivity(periodEvents),
    eventCount: periodEvents.length
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
      error: "Analytics are not configured."
    });
  }

  const session = verifySession(event, adminSessionSecret);

  if (!session) {
    return jsonResponse(401, {
      error: "Unauthorized."
    });
  }

  const days = normalizeDays(event.queryStringParameters?.days);

  try {
    const store = getSiteContentStore();
    const savedData = await store.get("analytics-events", { type: "json" });
    const events = normalizeStoredEvents(savedData);

    return jsonResponse(200, {
      success: true,
      analytics: summarizeAnalytics(events, days)
    });
  } catch (err) {
    console.error("Failed to load analytics.", err);

    return jsonResponse(500, {
      error: "Could not load analytics."
    });
  }
};
