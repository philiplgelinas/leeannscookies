(() => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function createClientId(prefix = "item") {
    if (window.crypto?.randomUUID) {
      return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function normalizeString(value) {
    return String(value || "").trim();
  }

  // Showcase
  const showcaseGrid = document.getElementById("showcaseGrid");
  const filterButtons = document.querySelectorAll("[data-filter]");
  let currentShowcaseFilter = "all";

  const defaultShowcase = [
    {
      id: "showcase-baby-shower",
      title: "Baby Shower",
      descriptions: ["Clean design", "Soft palette"],
      tags: ["kids", "lux"],
      image: {
        type: "static",
        src: "img/babyshower.png",
        alt: "Playful cookie set"
      }
    },
    {
      id: "showcase-bridal-shower",
      title: "Bridal Shower",
      descriptions: ["Delicate detail", "Pastel tones"],
      tags: ["floral", "lux"],
      image: {
        type: "static",
        src: "img/bridalshower.png",
        alt: "Floral cookie set"
      }
    },
    {
      id: "showcase-christening",
      title: "Christening",
      descriptions: ["Clean lines", "Simple design"],
      tags: ["kids", "minimal"],
      image: {
        type: "static",
        src: "img/christening.png",
        alt: "Minimal cookie set"
      }
    },
    {
      id: "showcase-christmas",
      title: "Christmas",
      descriptions: ["Festive design", "Vibrant colors"],
      tags: ["kids", "lux"],
      image: {
        type: "static",
        src: "img/christmas.png",
        alt: "Christmas cookie set"
      }
    },
    {
      id: "showcase-galentines-day",
      title: "Galentine’s Day",
      descriptions: ["Romantic design", "Soft blush & red tones"],
      tags: ["lux", "minimal", "floral"],
      image: {
        type: "static",
        src: "img/galentines.png",
        alt: "Galentine's Day cookie set"
      }
    },
    {
      id: "showcase-disney-baby",
      title: "Disney Baby",
      descriptions: ["Character themed", "Bright & playful"],
      tags: ["kids"],
      image: {
        type: "static",
        src: "img/disney.png",
        alt: "Disney themed cookie set"
      }
    },
    {
      id: "showcase-30th-birthday",
      title: "30th Birthday",
      descriptions: ["Modern design", "Chic & celebratory"],
      tags: ["lux", "minimal"],
      image: {
        type: "static",
        src: "img/30thbirthday.png",
        alt: "30th birthday cookie set"
      }
    },
    {
      id: "showcase-easter",
      title: "Easter",
      descriptions: ["Spring colors", "Playful & pastel design"],
      tags: ["kids", "floral", "lux"],
      image: {
        type: "static",
        src: "img/easter.png",
        alt: "Easter cookie set"
      }
    },
    {
      id: "showcase-mothers-day",
      title: "Mother’s Day",
      descriptions: ["Elegant florals", "Soft spring colors"],
      tags: ["floral", "lux"],
      image: {
        type: "static",
        src: "img/mothersday.png",
        alt: "Mother's Day cookie set"
      }
    },
    {
      id: "showcase-first-birthday",
      title: "First Birthday",
      descriptions: ["Playful theme", "Sweet celebratory details"],
      tags: ["kids", "lux"],
      image: {
        type: "static",
        src: "img/firstbirthday.png",
        alt: "First birthday cookie set"
      }
    },
    {
      id: "showcase-rehearsal-dinner",
      title: "Rehearsal Dinner",
      descriptions: ["Elegant design", "Soft romantic palette"],
      tags: ["minimal", "lux"],
      image: {
        type: "static",
        src: "img/wedding.png",
        alt: "Rehearsal dinner cookie set"
      }
    }
  ];

  function normalizeDescriptions(descriptions) {
    if (!Array.isArray(descriptions)) {
      return [];
    }

    return descriptions
      .map(description => normalizeString(description))
      .filter(Boolean)
      .slice(0, 4);
  }

  function normalizeTags(tags) {
    const allowedTags = ["minimal", "floral", "kids", "lux"];

    if (!Array.isArray(tags)) {
      return [];
    }

    return tags
      .map(tag => normalizeString(tag).toLowerCase())
      .filter(tag => allowedTags.includes(tag));
  }

  function normalizeImage(image) {
    if (!image || typeof image !== "object") {
      return null;
    }

    const type = normalizeString(image.type);
    const alt = normalizeString(image.alt);

    if (type === "static") {
      const src = normalizeString(image.src);

      if (!src) {
        return null;
      }

      return {
        type: "static",
        src,
        alt
      };
    }

    if (type === "blob") {
      const key = normalizeString(image.key);
      const url = normalizeString(image.url);
      const contentType = normalizeString(image.contentType);

      if (!key || !url) {
        return null;
      }

      return {
        type: "blob",
        key,
        url,
        contentType,
        alt
      };
    }

    return null;
  }

  function normalizeShowcaseData(data) {
    const showcase = Array.isArray(data?.showcase) ? data.showcase : [];

    const normalized = showcase
      .map(item => {
        const id = normalizeString(item.id) || createClientId("showcase");
        const title = normalizeString(item.title);
        const descriptions = normalizeDescriptions(item.descriptions);
        const tags = normalizeTags(item.tags);
        const image = normalizeImage(item.image);

        return {
          id,
          title,
          descriptions,
          tags,
          image
        };
      })
      .filter(item =>
        item.id &&
        item.title &&
        item.descriptions.length &&
        item.tags.length &&
        item.image
      );

    return normalized.length ? normalized : defaultShowcase;
  }

  function getShowcaseImageSrc(image) {
    if (!image) {
      return "";
    }

    if (image.type === "blob") {
      return image.url;
    }

    return image.src;
  }

  async function fetchShowcaseData() {
    try {
      const response = await fetch("/.netlify/functions/get-showcase", {
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        const showcase = normalizeShowcaseData(data);

        if (showcase.length) {
          return showcase;
        }
      }
    } catch (err) {
      console.warn("Could not load showcase from Netlify Function.", err);
    }

    try {
      const response = await fetch("data/default-showcase.json", {
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        const showcase = normalizeShowcaseData(data);

        if (showcase.length) {
          return showcase;
        }
      }
    } catch (err) {
      console.warn("Could not load default showcase data.", err);
    }

    return defaultShowcase;
  }

  function setActiveButton(activeBtn) {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  }

  function filterShowcase(tag) {
    currentShowcaseFilter = tag;

    const items = document.querySelectorAll(".showcase-item");

    items.forEach(item => {
      const tags = (item.getAttribute("data-tags") || "").split(" ").filter(Boolean);
      const show = tag === "all" ? true : tags.includes(tag);
      item.hidden = !show;
    });
  }

  function renderShowcaseCards(showcase) {
    if (!showcaseGrid) return;

    showcaseGrid.innerHTML = "";

    showcase.forEach(item => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-4 showcase-item";
      col.setAttribute("data-tags", item.tags.join(" "));

      const card = document.createElement("div");
      card.className = "showcase-card";

      const img = document.createElement("img");
      img.src = getShowcaseImageSrc(item.image);
      img.alt = item.image.alt || `${item.title} cookie set`;
      img.loading = "lazy";

      const meta = document.createElement("div");
      meta.className = "showcase-meta";

      const title = document.createElement("div");
      title.className = "fw-semibold";
      title.textContent = item.title;

      const description = document.createElement("div");
      description.className = "text-secondary small";
      description.textContent = item.descriptions.join(" • ");

      meta.append(title, description);
      card.append(img, meta);
      col.appendChild(card);
      showcaseGrid.appendChild(col);
    });

    bindShowcaseLightbox();
    filterShowcase(currentShowcaseFilter);
  }

  async function initShowcase() {
    if (!showcaseGrid) return;

    const showcase = await fetchShowcaseData();
    renderShowcaseCards(showcase);
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tag = btn.getAttribute("data-filter");
      setActiveButton(btn);
      filterShowcase(tag);
    });
  });

  const defaultBtn = document.querySelector('[data-filter="all"]');
  if (defaultBtn) defaultBtn.classList.add("active");

  // Pricing
  const pricingGrid = document.getElementById("pricingGrid");
  const defaultPricing = [
    { id: "set-6", quantity: 6, price: 18 },
    { id: "set-12", quantity: 12, price: 33 },
    { id: "set-24", quantity: 24, price: 60 },
    { id: "set-48", quantity: 48, price: 108 },
    { id: "set-96", quantity: 96, price: 192 }
  ];

  function normalizePricingData(data) {
    const pricing = Array.isArray(data?.pricing) ? data.pricing : [];

    return pricing
      .map(item => ({
        id: String(item.id || createClientId("pricing")),
        quantity: Number.parseInt(item.quantity, 10),
        price: Number.parseInt(item.price, 10)
      }))
      .filter(item => Number.isInteger(item.quantity) && item.quantity > 0 && Number.isInteger(item.price) && item.price > 0);
  }

  async function fetchPricingData() {
    try {
      const response = await fetch("/.netlify/functions/get-pricing", {
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        const pricing = normalizePricingData(data);

        if (pricing.length) {
          return pricing;
        }
      }
    } catch (err) {
      console.warn("Could not load pricing from Netlify Function.", err);
    }

    try {
      const response = await fetch("data/default-pricing.json", {
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        const pricing = normalizePricingData(data);

        if (pricing.length) {
          return pricing;
        }
      }
    } catch (err) {
      console.warn("Could not load default pricing data.", err);
    }

    return defaultPricing;
  }

  function renderPricingCards(pricing) {
    if (!pricingGrid) return;

    pricingGrid.innerHTML = "";

    pricing.forEach(item => {
      const col = document.createElement("div");
      col.className = "col-6 col-md-4 col-lg";

      const card = document.createElement("div");
      card.className = "card clean-card h-100 text-center";

      const body = document.createElement("div");
      body.className = "card-body p-4";

      const label = document.createElement("div");
      label.className = "text-secondary small mb-1";
      label.textContent = "Set of";

      const quantity = document.createElement("div");
      quantity.className = "display-6 fw-semibold";
      quantity.textContent = item.quantity;

      const price = document.createElement("div");
      price.className = "h4 fw-semibold mt-3 mb-0";
      price.textContent = `$${item.price}`;

      body.append(label, quantity, price);
      card.appendChild(body);
      col.appendChild(card);
      pricingGrid.appendChild(col);
    });
  }

  async function initPricing() {
    if (!pricingGrid) return;

    const pricing = await fetchPricingData();
    renderPricingCards(pricing);
  }

  // Showcase image lightbox
  const lightbox = document.getElementById("imageLightbox");
  const lightboxImg = document.getElementById("imageLightboxImg");
  const lightboxClose = document.getElementById("imageLightboxClose");

  function openLightbox(card) {
    if (!lightbox || !lightboxImg) return;

    const img = card.querySelector("img");
    const title = card.querySelector(".fw-semibold")?.textContent?.trim() || img?.alt || "Cookie image";

    if (!img) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || title;

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightboxClose?.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    lightboxImg.src = "";
    lightboxImg.alt = "";
  }

  function bindShowcaseLightbox() {
    const showcaseCards = document.querySelectorAll(".showcase-card");

    showcaseCards.forEach(card => {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Open enlarged cookie image");

      card.addEventListener("click", () => openLightbox(card));

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(card);
        }
      });
    });
  }

  lightboxClose?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox?.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  initShowcase();
  initPricing();

  // Request form
  const form = document.getElementById("cookieRequestForm");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const mailtoBtn = document.getElementById("mailtoBtn");
  const orderImagesInput = document.getElementById("orderImages");
  const attachmentList = document.getElementById("attachmentList");
  const orderImagesFeedback = document.getElementById("orderImagesFeedback");

  const destinationEmail = "leeannscookiesnj@gmail.com";
  const maxImageCount = 3;
  const maxImageSizeBytes = 5 * 1024 * 1024;
  // EmailJS Free allows requests up to 50 KB total. Keep this lower to leave room for form text/overhead.
  // If the EmailJS account is upgraded, raise this value to match the paid plan attachment limit.
  const maxEmailJSTotalAttachmentBytes = 45 * 1024;
  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
  const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];
  let selectedImageFiles = [];

  // ===== EmailJS CONFIG =====
  // 1) EmailJS dashboard -> Email Services -> copy your Service ID
  // 2) EmailJS dashboard -> Email Templates -> create/copy Template ID
  // 3) EmailJS dashboard -> Account -> copy Public Key
  const EMAILJS_PUBLIC_KEY = "1CIxr9NPrrsN0AYgO";
  const EMAILJS_SERVICE_ID = "service_x6u1c8k";
  const EMAILJS_TEMPLATE_ID = "template_en8radw";

  function setStatus(msg, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.toggle("text-danger", isError);
    statusEl.classList.toggle("text-success", !isError);
  }

  function getSelectedImageFiles() {
    return selectedImageFiles;
  }

  function syncImageInputFiles() {
    if (!orderImagesInput) return;

    const dataTransfer = new DataTransfer();
    selectedImageFiles.forEach(file => dataTransfer.items.add(file));
    orderImagesInput.files = dataTransfer.files;
  }

  function removeImageAttachment(indexToRemove) {
    selectedImageFiles = selectedImageFiles.filter((_, index) => index !== indexToRemove);
    syncImageInputFiles();
    validateImageAttachments({ enforceEmailJSLimit: false });
    renderAttachmentList();
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) return "";
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function isAllowedImageFile(file) {
    const fileName = file.name.toLowerCase();
    const hasAllowedType = allowedImageTypes.includes(file.type);
    const hasAllowedExtension = allowedImageExtensions.some(ext => fileName.endsWith(ext));
    return hasAllowedType || hasAllowedExtension;
  }

  function setImageAttachmentValidity(message = "") {
    if (!orderImagesInput) return;
    orderImagesInput.setCustomValidity(message);
    if (orderImagesFeedback && message) orderImagesFeedback.textContent = message;
  }

  function validateImageAttachments({ enforceEmailJSLimit = false } = {}) {
    const files = getSelectedImageFiles();
    setImageAttachmentValidity("");

    if (files.length > maxImageCount) {
      setImageAttachmentValidity(`Please upload no more than ${maxImageCount} images.`);
      return false;
    }

    const invalidType = files.find(file => !isAllowedImageFile(file));
    if (invalidType) {
      setImageAttachmentValidity("Please upload images only: JPG, PNG, WEBP, HEIC, or HEIF.");
      return false;
    }

    const oversized = files.find(file => file.size > maxImageSizeBytes);
    if (oversized) {
      setImageAttachmentValidity(`${oversized.name} is too large. Each image must be 5 MB or smaller.`);
      return false;
    }

    if (enforceEmailJSLimit) {
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      if (totalSize > maxEmailJSTotalAttachmentBytes) {
        setImageAttachmentValidity(
          `Selected images total ${formatBytes(totalSize)}, which is above the website upload limit of ${formatBytes(maxEmailJSTotalAttachmentBytes)}. Please remove/compress images, or use the mail app button and attach them manually.`
        );
        return false;
      }
    }

    return true;
  }

  function renderAttachmentList() {
    if (!attachmentList) return;

    attachmentList.innerHTML = "";
    const files = getSelectedImageFiles();
    if (!files.length) return;

    files.forEach((file, index) => {
      const pill = document.createElement("div");
      pill.className = "attachment-pill";

      const icon = document.createElement("i");
      icon.className = "bi bi-image";
      icon.setAttribute("aria-hidden", "true");

      const name = document.createElement("span");
      name.className = "attachment-name";
      name.textContent = file.name;
      name.title = file.name;

      const size = document.createElement("span");
      size.className = "attachment-size";
      size.textContent = formatBytes(file.size);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "attachment-remove";
      removeBtn.setAttribute("aria-label", `Remove ${file.name}`);
      removeBtn.innerHTML = "&times;";
      removeBtn.addEventListener("click", () => removeImageAttachment(index));

      pill.append(icon, name, size, removeBtn);
      attachmentList.appendChild(pill);
    });
  }

  function buildMailto(formData, fileNames = []) {
    const subject = `Cookie Request - ${formData.name} (${formData.eventDate})`;
    const bodyLines = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Event Date: ${formData.eventDate}`,
      `Quantity: ${formData.quantity}`,
      `Theme/Occasion: ${formData.theme}`,
      `Inspiration Link: ${formData.inspo || "(none)"}`,
      `Inspiration Images: ${fileNames.length ? `${fileNames.join(", ")} (please attach manually if using the mail app)` : "(none)"}`,
      ``,
      `Details:`,
      `${formData.details}`,
      ``,
      `Sent from LeeAnn’s Cookies website`
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));
    return `mailto:${destinationEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;
  }

  function canSendViaEmailJS() {
    return (
      window.emailjs &&
      EMAILJS_PUBLIC_KEY &&
      EMAILJS_SERVICE_ID &&
      EMAILJS_TEMPLATE_ID &&
      !EMAILJS_PUBLIC_KEY.includes("PASTE_") &&
      !EMAILJS_SERVICE_ID.includes("PASTE_") &&
      !EMAILJS_TEMPLATE_ID.includes("PASTE_")
    );
  }

  function initEmailJSOnce() {
    // EmailJS init (v4 style)
    if (!window.__emailjs_inited) {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      window.__emailjs_inited = true;
    }
  }

  orderImagesInput?.addEventListener("change", () => {
    selectedImageFiles = Array.from(orderImagesInput.files || []);
    syncImageInputFiles();
    validateImageAttachments();
    renderAttachmentList();
  });

  // Mailto button always available, but browsers cannot attach local files to mailto links.
  if (mailtoBtn) {
    mailtoBtn.addEventListener("click", () => {
      if (!form) return;

      validateImageAttachments({ enforceEmailJSLimit: false });
      renderAttachmentList();
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        setStatus("Please fix the highlighted fields before opening your email app.", true);
        return;
      }

      const values = Object.fromEntries(new FormData(form).entries());
      const fileNames = getSelectedImageFiles().map(file => file.name);
      window.location.href = buildMailto(values, fileNames);
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");

    const sendViaEmailJS = canSendViaEmailJS();
    validateImageAttachments({ enforceEmailJSLimit: sendViaEmailJS });
    renderAttachmentList();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      setStatus("Please fix the highlighted fields.", true);
      return;
    }

    try {
      submitBtn && (submitBtn.disabled = true);
      setStatus("Sending...");

      if (sendViaEmailJS) {
        initEmailJSOnce();

        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);

        setStatus("Request sent! We’ll reply soon.");
        form.reset();
        form.classList.remove("was-validated");
        selectedImageFiles = [];
        syncImageInputFiles();
        setImageAttachmentValidity("");
        renderAttachmentList();
        return;
      }

      setStatus("Email sending isn’t configured yet—opening your email app...");
      const values = Object.fromEntries(new FormData(form).entries());
      const fileNames = getSelectedImageFiles().map(file => file.name);
      window.location.href = buildMailto(values, fileNames);

    } catch (err) {
      console.error(err);
      const errorText = `${err?.status || ""} ${err?.text || err?.message || ""}`;
      if (errorText.includes("413") || errorText.toLowerCase().includes("content too large")) {
        setStatus("The selected images are too large for website sending. Please remove/compress them, or use the email button and attach them manually.", true);
      } else {
        setStatus("Couldn’t send right now. Please use the email button instead.", true);
      }
    } finally {
      submitBtn && (submitBtn.disabled = false);
    }
  });
})();
