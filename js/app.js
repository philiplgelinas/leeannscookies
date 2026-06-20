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

  // About the Baker
  const aboutBakerParagraphs = document.getElementById("aboutBakerParagraphs");

  const defaultAboutBakerParagraphs = [
    "I’m a full-time speech and language pathologist working in a private school with neurodivergent children. My love for baking was inspired by my aunt (our family’s favorite baker) who was known for making the most unforgettable cookies.",
    "Though she bravely lost her battle with breast cancer, she never lost her passion for baking or her joy in sharing it with others. Cookies were her way of celebrating every occasion and bringing people together.",
    "I had the honor of becoming her sous baker, spending countless hours by her side, learning, laughing, and creating sweet memories. Through those moments, her passion became mine and today, I continue baking in her spirit, sharing love one cookie at a time."
  ];

  function normalizeAboutBakerParagraphs(paragraphs) {
    if (!Array.isArray(paragraphs)) {
      return [];
    }

    return paragraphs
      .map(paragraph => normalizeString(paragraph))
      .filter(Boolean)
      .slice(0, 3);
  }

  function normalizeAboutBakerData(data) {
    const paragraphs = normalizeAboutBakerParagraphs(data?.paragraphs);

    return paragraphs.length === 3 ? paragraphs : defaultAboutBakerParagraphs;
  }

  async function fetchAboutBakerData() {
    try {
      const response = await fetch("/.netlify/functions/get-about-baker", {
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        const paragraphs = normalizeAboutBakerData(data);

        if (paragraphs.length) {
          return paragraphs;
        }
      }
    } catch (err) {
      console.warn("Could not load About the Baker from Netlify Function.", err);
    }

    try {
      const response = await fetch("data/default-about-baker.json", {
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        const paragraphs = normalizeAboutBakerData(data);

        if (paragraphs.length) {
          return paragraphs;
        }
      }
    } catch (err) {
      console.warn("Could not load default About the Baker data.", err);
    }

    return defaultAboutBakerParagraphs;
  }

  function renderAboutBakerParagraphs(paragraphs) {
    if (!aboutBakerParagraphs) return;

    aboutBakerParagraphs.innerHTML = "";

    paragraphs.forEach((paragraph, index) => {
      const p = document.createElement("p");
      p.className = index === paragraphs.length - 1 ? "mb-0" : "mb-3";
      p.textContent = paragraph;
      aboutBakerParagraphs.appendChild(p);
    });
  }

  async function initAboutBaker() {
    if (!aboutBakerParagraphs) return;

    const paragraphs = await fetchAboutBakerData();
    renderAboutBakerParagraphs(paragraphs);
  }

  // Showcase
  const showcaseGrid = document.getElementById("showcaseGrid");
  const featuredSetImage = document.getElementById("featuredSetImage");
  const featuredSetTitle = document.getElementById("featuredSetTitle");
  const featuredSetDescription = document.getElementById("featuredSetDescription");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const showcaseGalleryControls = document.getElementById("showcaseGalleryControls");
  const showcasePrevBtn = document.getElementById("showcasePrevBtn");
  const showcaseNextBtn = document.getElementById("showcaseNextBtn");
  const showcaseGalleryStatus = document.getElementById("showcaseGalleryStatus");
  const showcaseGalleryDots = document.getElementById("showcaseGalleryDots");

  const showcaseItemsPerPage = 9;
  let currentShowcaseFilter = "all";
  let showcaseCurrentPage = 1;

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

  const defaultFeaturedShowcaseId = "showcase-rehearsal-dinner";

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

  function normalizeFeaturedShowcaseId(featuredShowcaseId, showcase) {
    const selectedId = normalizeString(featuredShowcaseId);

    if (selectedId && showcase.some(item => item.id === selectedId)) {
      return selectedId;
    }

    if (showcase.some(item => item.id === defaultFeaturedShowcaseId)) {
      return defaultFeaturedShowcaseId;
    }

    return showcase[0]?.id || "";
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

    const normalizedShowcase = normalized.length ? normalized : defaultShowcase;

    return {
      featuredShowcaseId: normalizeFeaturedShowcaseId(data?.featuredShowcaseId, normalizedShowcase),
      showcase: normalizedShowcase
    };
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

  function renderFeaturedSet(showcase, featuredShowcaseId) {
    if (!featuredSetImage || !featuredSetTitle || !featuredSetDescription) {
      return;
    }

    const featuredItem =
      showcase.find(item => item.id === featuredShowcaseId) ||
      showcase.find(item => item.id === defaultFeaturedShowcaseId) ||
      showcase[0];

    if (!featuredItem) {
      return;
    }

    featuredSetImage.src = getShowcaseImageSrc(featuredItem.image);
    featuredSetImage.alt = featuredItem.image?.alt || `${featuredItem.title} cookie set`;
    featuredSetTitle.textContent = featuredItem.title;
    featuredSetDescription.textContent = featuredItem.descriptions.join(" • ");
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
        const showcaseData = normalizeShowcaseData(data);

        if (showcaseData.showcase.length) {
          return showcaseData;
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
        const showcaseData = normalizeShowcaseData(data);

        if (showcaseData.showcase.length) {
          return showcaseData;
        }
      }
    } catch (err) {
      console.warn("Could not load default showcase data.", err);
    }

    return {
      featuredShowcaseId: defaultFeaturedShowcaseId,
      showcase: defaultShowcase
    };
  }

  function setActiveButton(activeBtn) {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  }

  function getFilteredShowcaseItems() {
    const items = Array.from(document.querySelectorAll(".showcase-item"));

    return items.filter(item => {
      const tags = (item.getAttribute("data-tags") || "").split(" ").filter(Boolean);

      return currentShowcaseFilter === "all" ? true : tags.includes(currentShowcaseFilter);
    });
  }

  function renderShowcaseGalleryDots(totalPages) {
    if (!showcaseGalleryDots) return;

    showcaseGalleryDots.innerHTML = "";

    for (let page = 1; page <= totalPages; page++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "showcase-gallery-dot";
      dot.classList.toggle("active", page === showcaseCurrentPage);
      dot.setAttribute("aria-label", `Go to showcase page ${page}`);
      dot.addEventListener("click", () => {
        showcaseCurrentPage = page;
        updateShowcaseGallery();
      });

      showcaseGalleryDots.appendChild(dot);
    }
  }

  function updateShowcaseGallery() {
    const allItems = Array.from(document.querySelectorAll(".showcase-item"));
    const filteredItems = getFilteredShowcaseItems();
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / showcaseItemsPerPage));

    if (showcaseCurrentPage > totalPages) {
      showcaseCurrentPage = totalPages;
    }

    const startIndex = (showcaseCurrentPage - 1) * showcaseItemsPerPage;
    const endIndex = startIndex + showcaseItemsPerPage;

    allItems.forEach(item => {
      item.hidden = true;
    });

    filteredItems.forEach((item, index) => {
      item.hidden = index < startIndex || index >= endIndex;
    });

    if (showcaseGalleryControls) {
      showcaseGalleryControls.hidden = filteredItems.length <= showcaseItemsPerPage;
    }

    if (showcasePrevBtn) {
      showcasePrevBtn.disabled = showcaseCurrentPage <= 1;
    }

    if (showcaseNextBtn) {
      showcaseNextBtn.disabled = showcaseCurrentPage >= totalPages;
    }

    if (showcaseGalleryStatus) {
      showcaseGalleryStatus.textContent = `Page ${showcaseCurrentPage} of ${totalPages}`;
    }

    renderShowcaseGalleryDots(totalPages);
  }

  function filterShowcase(tag) {
    currentShowcaseFilter = tag;
    showcaseCurrentPage = 1;
    updateShowcaseGallery();
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
    const showcaseData = await fetchShowcaseData();

    renderFeaturedSet(showcaseData.showcase, showcaseData.featuredShowcaseId);

    if (showcaseGrid) {
      renderShowcaseCards(showcaseData.showcase);
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tag = btn.getAttribute("data-filter");
      setActiveButton(btn);
      filterShowcase(tag);
    });
  });

  showcasePrevBtn?.addEventListener("click", () => {
    if (showcaseCurrentPage <= 1) return;

    showcaseCurrentPage -= 1;
    updateShowcaseGallery();
  });

  showcaseNextBtn?.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(getFilteredShowcaseItems().length / showcaseItemsPerPage));

    if (showcaseCurrentPage >= totalPages) return;

    showcaseCurrentPage += 1;
    updateShowcaseGallery();
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

  let currentPricing = [];

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

  function getSortedPricing(pricing) {
    return [...pricing]
      .map(item => ({
        quantity: Number.parseInt(item.quantity, 10),
        price: Number.parseFloat(item.price)
      }))
      .filter(item =>
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        Number.isFinite(item.price) &&
        item.price > 0
      )
      .sort((a, b) => a.quantity - b.quantity);
  }

  function formatEstimatedPrice(price) {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
  }

  function calculateEstimatedPrice(quantity, pricing) {
    const sortedPricing = getSortedPricing(pricing);

    if (!Number.isInteger(quantity) || quantity <= 0 || !sortedPricing.length) {
      return null;
    }

    const exactMatch = sortedPricing.find(item => item.quantity === quantity);

    if (exactMatch) {
      return exactMatch.price;
    }

    const smallestSet = sortedPricing[0];
    const largestSet = sortedPricing[sortedPricing.length - 1];

    if (quantity < smallestSet.quantity) {
      return quantity * (smallestSet.price / smallestSet.quantity);
    }

    if (quantity > largestSet.quantity) {
      return quantity * (largestSet.price / largestSet.quantity);
    }

    for (let i = 0; i < sortedPricing.length - 1; i++) {
      const lowerSet = sortedPricing[i];
      const higherSet = sortedPricing[i + 1];

      if (quantity > lowerSet.quantity && quantity < higherSet.quantity) {
        const extraCookies = quantity - lowerSet.quantity;
        return lowerSet.price + extraCookies * (higherSet.price / higherSet.quantity);
      }
    }

    return null;
  }

  function updatePriceEstimate() {
    if (!quantityInput || !priceEstimate || !priceEstimateValue || !estimatedPriceInput) {
      return;
    }

    const quantity = Number.parseInt(quantityInput.value, 10);
    const estimatedPrice = calculateEstimatedPrice(quantity, currentPricing);

    if (!Number.isFinite(estimatedPrice)) {
      priceEstimate.hidden = true;
      priceEstimateValue.textContent = "$0.00";
      estimatedPriceInput.value = "";
      return;
    }

    const formattedPrice = formatEstimatedPrice(estimatedPrice);

    priceEstimate.hidden = false;
    priceEstimateValue.textContent = formattedPrice;
    estimatedPriceInput.value = formattedPrice;
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
    const pricing = await fetchPricingData();

    currentPricing = getSortedPricing(pricing);

    renderPricingCards(pricing);
    updatePriceEstimate();
  }

  // Showcase image lightbox
  const lightbox = document.getElementById("imageLightbox");
  const lightboxImg = document.getElementById("imageLightboxImg");
  const lightboxClose = document.getElementById("imageLightboxClose");

  function openLightboxFromImage(img, title = "Cookie image") {
    if (!lightbox || !lightboxImg || !img) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || title;

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightboxClose?.focus();
  }

  function openLightbox(card) {
    if (!card) return;

    const img = card.querySelector("img");
    const title = card.querySelector(".fw-semibold")?.textContent?.trim() || img?.alt || "Cookie image";

    openLightboxFromImage(img, title);
  }

  function bindFeaturedSetLightbox() {
    const featuredImageWrap = featuredSetImage?.closest(".hero-image-wrap");

    if (!featuredImageWrap || !featuredSetImage) return;

    featuredImageWrap.classList.add("is-lightbox-trigger");
    featuredImageWrap.setAttribute("tabindex", "0");
    featuredImageWrap.setAttribute("role", "button");
    featuredImageWrap.setAttribute("aria-label", "Open enlarged featured cookie image");

    featuredImageWrap.addEventListener("click", () => {
      openLightboxFromImage(featuredSetImage, featuredSetTitle?.textContent?.trim() || "Featured cookie set");
    });

    featuredImageWrap.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightboxFromImage(featuredSetImage, featuredSetTitle?.textContent?.trim() || "Featured cookie set");
      }
    });
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
  bindFeaturedSetLightbox();

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox?.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  // Request form
  const form = document.getElementById("cookieRequestForm");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const quantityInput = document.getElementById("quantity");
  const phoneInput = document.getElementById("phone");
  const priceEstimate = document.getElementById("priceEstimate");
  const priceEstimateValue = document.getElementById("priceEstimateValue");
  const estimatedPriceInput = document.getElementById("estimatedPrice");
  const orderImagesInput = document.getElementById("orderImages");
  const attachmentList = document.getElementById("attachmentList");
  const orderImagesFeedback = document.getElementById("orderImagesFeedback");

  const maxImageCount = 5;
  const maxImageSizeBytes = 5 * 1024 * 1024;
  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
  const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];
  let selectedImageFiles = [];

  function setStatus(msg, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.toggle("text-danger", isError);
    statusEl.classList.toggle("text-success", !isError);
  }

  function formatPhoneNumber(value) {
    const digits = String(value || "").replace(/\D/g, "").slice(0, 10);

    if (digits.length <= 3) {
      return digits;
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
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
    validateImageAttachments();
    renderAttachmentList();
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) return "";
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function getImageContentType(file) {
    if (allowedImageTypes.includes(file.type)) {
      return file.type;
    }

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return "image/jpeg";
    if (fileName.endsWith(".png")) return "image/png";
    if (fileName.endsWith(".webp")) return "image/webp";
    if (fileName.endsWith(".heic")) return "image/heic";
    if (fileName.endsWith(".heif")) return "image/heif";

    return "";
  }

  function isAllowedImageFile(file) {
    const fileName = file.name.toLowerCase();
    const hasAllowedType = Boolean(getImageContentType(file));
    const hasAllowedExtension = allowedImageExtensions.some(ext => fileName.endsWith(ext));

    return hasAllowedType || hasAllowedExtension;
  }

  function setImageAttachmentValidity(message = "") {
    if (!orderImagesInput) return;
    orderImagesInput.setCustomValidity(message);
    if (orderImagesFeedback && message) orderImagesFeedback.textContent = message;
  }

  function validateImageAttachments() {
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

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Could not read selected image."));

      reader.readAsDataURL(file);
    });
  }

  async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...(options.headers || {})
      },
      ...options
    });

    let data = {};

    try {
      data = await response.json();
    } catch (err) {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.error || "Request failed.");
    }

    return data;
  }

  async function uploadCookieRequestImage(file) {
    const dataBase64 = await readFileAsDataUrl(file);
    const contentType = getImageContentType(file);

    if (!contentType) {
      throw new Error(`Unsupported image type for ${file.name}.`);
    }

    const data = await fetchJson("/.netlify/functions/save-cookie-request-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType,
        dataBase64
      })
    });

    if (!data.image) {
      throw new Error("Image upload failed.");
    }

    return data.image;
  }

  async function uploadCookieRequestImages() {
    const uploadedImages = [];

    for (const file of getSelectedImageFiles()) {
      uploadedImages.push(await uploadCookieRequestImage(file));
    }

    return uploadedImages;
  }

  function buildCookieRequestPayload(images) {
    const values = Object.fromEntries(new FormData(form).entries());

    return {
      name: normalizeString(values.name),
      email: normalizeString(values.email),
      phone: normalizeString(values.phone),
      eventDate: normalizeString(values.eventDate),
      quantity: normalizeString(values.quantity),
      estimatedPrice: normalizeString(values.estimatedPrice),
      theme: normalizeString(values.theme),
      inspo: normalizeString(values.inspo),
      details: normalizeString(values.details),
      images
    };
  }

  quantityInput?.addEventListener("input", updatePriceEstimate);

  phoneInput?.addEventListener("input", () => {
    phoneInput.value = formatPhoneNumber(phoneInput.value);
  });

  orderImagesInput?.addEventListener("change", () => {
    selectedImageFiles = Array.from(orderImagesInput.files || []);
    syncImageInputFiles();
    validateImageAttachments();
    renderAttachmentList();
  });

  initShowcase();
  initPricing();
  initAboutBaker();

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (form.dataset.submitting === "true") {
      return;
    }

    form.dataset.submitting = "true";
    setStatus("");
    updatePriceEstimate();

    validateImageAttachments();
    renderAttachmentList();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      setStatus("Please fix the highlighted fields.", true);
      form.dataset.submitting = "false";
      return;
    }

    try {
      submitBtn && (submitBtn.disabled = true);
      setStatus("Submitting request...");

      const uploadedImages = await uploadCookieRequestImages();
      const requestPayload = buildCookieRequestPayload(uploadedImages);

      await fetchJson("/.netlify/functions/save-cookie-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestPayload)
      });

      setStatus("Request sent! We’ll reply soon.");
      form.reset();
      form.classList.remove("was-validated");
      selectedImageFiles = [];
      syncImageInputFiles();
      setImageAttachmentValidity("");
      renderAttachmentList();
      updatePriceEstimate();
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Couldn’t submit your request right now. Please try again.", true);
    } finally {
      form.dataset.submitting = "false";
      submitBtn && (submitBtn.disabled = false);
    }
  });
})();
