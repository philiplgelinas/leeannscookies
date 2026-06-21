const { getSiteContentStore } = require("./_blob-store");

const maxStoredEvents = 5000;

const allowedEventTypes = [
  "page_view",
  "showcase_filter",
  "showcase_lightbox",
  "featured_lightbox",
  "gallery_page",
  "request_form_start",
  "request_submit"
];

const allowedMetadataKeysByType = {
  page_view: ["title", "referrerHost"],
  showcase_filter: ["filter"],
  showcase_lightbox: ["title"],
  featured_lightbox: ["title"],
  gallery_page: ["page", "filter"],
  request_form_start: ["source"],
  request_submit: ["quantity", "estimatedPrice"]
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

function parseBody(event) {
  try {
    return JSON.parse(event.body || "{}");
  } catch (err) {
    return {};
  }
}

function normalizeString(value, maxLength = 200) {
  return String(value || "").trim().slice(0, maxLength);
}

function normalizeEventType(value) {
  const type = normalizeString(value, 60).toLowerCase();

  return allowedEventTypes.includes(type) ? type : "";
}

function normalizePath(value) {
  const path = normalizeString(value, 300);

  if (!path) {
    return "/";
  }

  try {
    const parsedUrl = new URL(path, "https://leeannscookiesnj.com");
    return parsedUrl.pathname || "/";
  } catch (err) {
    return path.startsWith("/") ? path.split("?")[0] : "/";
  }
}

function normalizeId(value, fallbackPrefix) {
  const id = normalizeString(value, 120);

  if (id) {
    return id;
  }

  return `${fallbackPrefix}-${crypto.randomUUID()}`;
}

function normalizeReferrerHost(value) {
  const referrer = normalizeString(value, 300);

  if (!referrer) {
    return "";
  }

  try {
    return new URL(referrer).hostname;
  } catch (err) {
    return "";
  }
}

function normalizeMetadata(type, metadata) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  const allowedKeys = allowedMetadataKeysByType[type] || [];

  return allowedKeys.reduce((normalizedMetadata, key) => {
    if (!Object.prototype.hasOwnProperty.call(metadata, key)) {
      return normalizedMetadata;
    }

    if (key === "page") {
      const page = Number.parseInt(metadata[key], 10);

      if (Number.isInteger(page) && page > 0) {
        normalizedMetadata[key] = page;
      }

      return normalizedMetadata;
    }

    if (key === "quantity") {
      const quantity = Number.parseInt(metadata[key], 10);

      if (Number.isInteger(quantity) && quantity > 0) {
        normalizedMetadata[key] = quantity;
      }

      return normalizedMetadata;
    }

    if (key === "referrerHost") {
      normalizedMetadata[key] = normalizeReferrerHost(metadata[key]);
      return normalizedMetadata;
    }

    normalizedMetadata[key] = normalizeString(metadata[key], 160);

    return normalizedMetadata;
  }, {});
}

function normalizeAnalyticsEvent(data) {
  const type = normalizeEventType(data.type);

  if (!type) {
    return {
      valid: false,
      error: "Valid analytics event type is required."
    };
  }

  const createdAt = new Date().toISOString();

  return {
    valid: true,
    event: {
      id: `analytics-${crypto.randomUUID()}`,
      createdAt,
      type,
      path: normalizePath(data.path),
      visitorId: normalizeId(data.visitorId, "visitor"),
      sessionId: normalizeId(data.sessionId, "session"),
      metadata: normalizeMetadata(type, data.metadata)
    }
  };
}

function getEventFingerprint(event) {
  return JSON.stringify({
    type: event.type,
    path: event.path,
    visitorId: event.visitorId,
    sessionId: event.sessionId,
    metadata: event.metadata || {}
  });
}

function isDuplicateRecentEvent(newEvent, existingEvents) {
  const duplicateWindowMs = 2500;
  const newEventTime = new Date(newEvent.createdAt).getTime();
  const newEventFingerprint = getEventFingerprint(newEvent);

  return existingEvents.some(existingEvent => {
    const existingEventTime = new Date(existingEvent.createdAt).getTime();

    if (!Number.isFinite(existingEventTime)) {
      return false;
    }

    const isRecent = Math.abs(newEventTime - existingEventTime) <= duplicateWindowMs;

    return isRecent && getEventFingerprint(existingEvent) === newEventFingerprint;
  });
}

function normalizeStoredEvents(data) {
  if (!data || !Array.isArray(data.events)) {
    return [];
  }

  return data.events
    .filter(event => event && event.id && event.createdAt && event.type)
    .slice(0, maxStoredEvents);
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  const body = parseBody(event);
  const normalized = normalizeAnalyticsEvent(body);

  if (!normalized.valid) {
    return jsonResponse(400, {
      error: normalized.error
    });
  }

  try {
    const store = getSiteContentStore();
    const savedData = await store.get("analytics-events", { type: "json" });
    const existingEvents = normalizeStoredEvents(savedData);

    if (isDuplicateRecentEvent(normalized.event, existingEvents)) {
      return jsonResponse(200, {
        success: true,
        duplicate: true
      });
    }

    const events = [
      normalized.event,
      ...existingEvents
    ].slice(0, maxStoredEvents);

    await store.setJSON("analytics-events", {
      events
    });

    return jsonResponse(200, {
      success: true
    });
  } catch (err) {
    console.error("Failed to track analytics event.", err);

    return jsonResponse(500, {
      error: "Could not track analytics event."
    });
  }
};
