const crypto = require("crypto");

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

function normalizeQuantity(value) {
  const quantity = Number.parseInt(value, 10);

  return Number.isInteger(quantity) && quantity > 0 ? quantity : null;
}

function normalizeImages(images) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map(image => ({
      fileName: normalizeString(image.fileName),
      contentType: normalizeString(image.contentType),
      key: normalizeString(image.key),
      url: normalizeString(image.url)
    }))
    .filter(image => image.fileName && image.key && image.url)
    .slice(0, 5);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidEventDate(eventDate) {
  return /^\d{4}-\d{2}-\d{2}$/.test(eventDate);
}

function escapeHtml(value) {
  return normalizeString(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getAbsoluteUrl(value) {
  const url = normalizeString(value);
  const siteUrl = normalizeString(process.env.SITE_URL || "https://leeannscookiesnj.com").replace(/\/$/, "");

  if (!url) {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${siteUrl}${url.startsWith("/") ? url : `/${url}`}`;
}

function formatEmailValue(value) {
  const normalizedValue = normalizeString(value);

  return normalizedValue || "(not provided)";
}

function buildImageLinksText(images) {
  if (!Array.isArray(images) || !images.length) {
    return "(none)";
  }

  return images
    .map((image, index) => {
      const fileName = formatEmailValue(image.fileName || `Image ${index + 1}`);
      const url = getAbsoluteUrl(image.url);

      return `${index + 1}. ${fileName}: ${url}`;
    })
    .join("\n");
}

function buildImageLinksHtml(images) {
  if (!Array.isArray(images) || !images.length) {
    return "<p>(none)</p>";
  }

  const links = images
    .map((image, index) => {
      const fileName = escapeHtml(image.fileName || `Image ${index + 1}`);
      const url = getAbsoluteUrl(image.url);

      return `<li><a href="${escapeHtml(url)}">${fileName}</a></li>`;
    })
    .join("");

  return `<ul>${links}</ul>`;
}

function buildCookieRequestEmailText(request) {
  return [
    "You have a new cookie request!",
    "",
    `Name: ${formatEmailValue(request.name)}`,
    `Email: ${formatEmailValue(request.email)}`,
    `Phone: ${formatEmailValue(request.phone)}`,
    `Event Date: ${formatEmailValue(request.eventDate)}`,
    `Quantity: ${formatEmailValue(request.quantity)}`,
    `Estimated Price: ${formatEmailValue(request.estimatedPrice)}`,
    `Theme: ${formatEmailValue(request.theme)}`,
    `Inspiration Link: ${formatEmailValue(request.inspo)}`,
    "",
    "Details:",
    formatEmailValue(request.details),
    "",
    "Inspiration Images:",
    buildImageLinksText(request.images),
    "",
    "View in Dashboard:",
    "https://leeannscookiesnj.com/admin/"
  ].join("\n");
}

function buildCookieRequestEmailHtml(request) {
  return `
    <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.5;">
      <h2>You have a new cookie request!</h2>

      <table style="border-collapse: collapse; width: 100%; max-width: 680px;">
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: bold; vertical-align: top;">Name:</td>
          <td style="padding: 6px 0;">${escapeHtml(formatEmailValue(request.name))}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: bold; vertical-align: top;">Email:</td>
          <td style="padding: 6px 0;">${escapeHtml(formatEmailValue(request.email))}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: bold; vertical-align: top;">Phone:</td>
          <td style="padding: 6px 0;">${escapeHtml(formatEmailValue(request.phone))}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: bold; vertical-align: top;">Event Date:</td>
          <td style="padding: 6px 0;">${escapeHtml(formatEmailValue(request.eventDate))}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: bold; vertical-align: top;">Quantity:</td>
          <td style="padding: 6px 0;">${escapeHtml(formatEmailValue(request.quantity))}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: bold; vertical-align: top;">Estimated Price:</td>
          <td style="padding: 6px 0;">${escapeHtml(formatEmailValue(request.estimatedPrice))}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: bold; vertical-align: top;">Theme:</td>
          <td style="padding: 6px 0;">${escapeHtml(formatEmailValue(request.theme))}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: bold; vertical-align: top;">Inspiration Link:</td>
          <td style="padding: 6px 0;">${escapeHtml(formatEmailValue(request.inspo))}</td>
        </tr>
      </table>

      <h3>Details</h3>
      <p style="white-space: pre-wrap;">${escapeHtml(formatEmailValue(request.details))}</p>

      <h3>Inspiration Images</h3>
      ${buildImageLinksHtml(request.images)}

        <div style="margin-top: 28px;">
          <a
            href="https://leeannscookiesnj.com/admin/"
            style="display: inline-block; padding: 12px 20px; background: #111111; color: #ffffff; text-decoration: none; border-radius: 999px; font-weight: bold;"
          >
          View in Dashboard
        </a>
      </div>
    </div>
  `;
}

async function sendNewCookieRequestNotification(request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.COOKIE_REQUEST_NOTIFICATION_EMAIL || "leeannscookiesnj@gmail.com";
  const from = process.env.COOKIE_REQUEST_NOTIFICATION_FROM;

  if (!apiKey || !from || !to) {
    console.warn("Cookie request email notification is not fully configured.");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: request.email,
      subject: "New Cookie Request",
      text: buildCookieRequestEmailText(request),
      html: buildCookieRequestEmailHtml(request)
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Notification email failed: ${errorText}`);
  }
}

function normalizeCookieRequest(data) {
  const name = normalizeString(data.name);
  const email = normalizeString(data.email).toLowerCase();
  const phone = normalizeString(data.phone);
  const eventDate = normalizeString(data.eventDate);
  const quantity = normalizeQuantity(data.quantity);
  const estimatedPrice = normalizeString(data.estimatedPrice);
  const theme = normalizeString(data.theme);
  const inspo = normalizeString(data.inspo);
  const details = normalizeString(data.details);
  const images = normalizeImages(data.images);

  if (!name) {
    return {
      valid: false,
      error: "Name is required."
    };
  }

  if (!email || !isValidEmail(email)) {
    return {
      valid: false,
      error: "A valid email is required."
    };
  }

  if (!eventDate || !isValidEventDate(eventDate)) {
    return {
      valid: false,
      error: "Event date is required."
    };
  }

  if (!quantity) {
    return {
      valid: false,
      error: "Estimated quantity is required."
    };
  }

  if (!theme) {
    return {
      valid: false,
      error: "Theme or occasion is required."
    };
  }

  if (!details) {
    return {
      valid: false,
      error: "Details are required."
    };
  }

  return {
    valid: true,
    request: {
      id: `request-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      status: "pending",
      name,
      email,
      phone,
      eventDate,
      quantity,
      estimatedPrice,
      theme,
      inspo,
      details,
      images
    }
  };
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

  const body = parseBody(event);
  const normalized = normalizeCookieRequest(body);

  if (!normalized.valid) {
    return jsonResponse(400, {
      error: normalized.error
    });
  }

  try {
    const store = getSiteContentStore();
    const savedData = await store.get("cookie-requests", { type: "json" });
    const existingRequests = normalizeStoredRequests(savedData);

    const requests = [
      normalized.request,
      ...existingRequests
    ];

    await store.setJSON("cookie-requests", {
      requests
    });

    try {
      await sendNewCookieRequestNotification(normalized.request);
    } catch (err) {
      console.error("Cookie request was saved, but notification email failed.", err);
    }

    return jsonResponse(200, {
      success: true,
      request: normalized.request
    });
  } catch (err) {
    console.error("Failed to save cookie request.", err);

    return jsonResponse(500, {
      error: "Could not save cookie request."
    });
  }
};
