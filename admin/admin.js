(() => {
  const loginView = document.getElementById("loginView");
  const editorView = document.getElementById("editorView");
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const loginStatus = document.getElementById("loginStatus");
  const adminUser = document.getElementById("adminUser");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminPricingGrid = document.getElementById("adminPricingGrid");
  const adminShowcaseGrid = document.getElementById("adminShowcaseGrid");
  const adminAboutBakerFields = document.getElementById("adminAboutBakerFields");
  const editorStatus = document.getElementById("editorStatus");
  const showcaseStatus = document.getElementById("showcaseStatus");
  const aboutBakerStatus = document.getElementById("aboutBakerStatus");
  const adminActions = document.getElementById("adminActions");
  const revertChangesBtn = document.getElementById("revertChangesBtn");
  const saveChangesBtn = document.getElementById("saveChangesBtn");
  const adminTabButtons = document.querySelectorAll("[data-admin-tab]");
  const dashboardPanel = document.getElementById("dashboardPanel");
  const siteBuilderPanel = document.getElementById("siteBuilderPanel");
  const cookieRequestsStatus = document.getElementById("cookieRequestsStatus");
  const upcomingRequestsGrid = document.getElementById("upcomingRequestsGrid");
  const pastRequestsGrid = document.getElementById("pastRequestsGrid");

  const defaultPricing = [
    { id: "set-6", quantity: 6, price: 18 },
    { id: "set-12", quantity: 12, price: 33 },
    { id: "set-24", quantity: 24, price: 60 },
    { id: "set-48", quantity: 48, price: 108 },
    { id: "set-96", quantity: 96, price: 192 }
  ];

  const defaultAboutBakerParagraphs = [
    "I’m a full-time speech and language pathologist working in a private school with neurodivergent children. My love for baking was inspired by my aunt (our family’s favorite baker) who was known for making the most unforgettable cookies.",
    "Though she bravely lost her battle with breast cancer, she never lost her passion for baking or her joy in sharing it with others. Cookies were her way of celebrating every occasion and bringing people together.",
    "I had the honor of becoming her sous baker, spending countless hours by her side, learning, laughing, and creating sweet memories. Through those moments, her passion became mine and today, I continue baking in her spirit, sharing love one cookie at a time."
  ];

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

  const showcaseTagOptions = [
    { value: "minimal", label: "Minimal" },
    { value: "floral", label: "Floral" },
    { value: "kids", label: "Kids" },
    { value: "lux", label: "Luxe" }
  ];

  const maxShowcaseImageSizeBytes = 4 * 1024 * 1024;
  const allowedShowcaseImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  let originalPricing = [];
  let draftPricing = [];

  let originalShowcase = [];
  let draftShowcase = [];
  let originalFeaturedShowcaseId = "";
  let draftFeaturedShowcaseId = "";
  let pendingShowcaseImages = {};

  let originalAboutBakerParagraphs = [];
  let draftAboutBakerParagraphs = [];
  let cookieRequests = [];

  function clonePricing(pricing) {
    return pricing.map(item => ({ ...item }));
  }

  function cloneAboutBakerParagraphs(paragraphs) {
    return [...paragraphs];
  }

  function setStatus(el, message, type = "") {
    if (!el) return;

    el.textContent = message;
    el.classList.toggle("is-error", type === "error");
    el.classList.toggle("is-success", type === "success");
  }

  function setActiveAdminTab(tabName) {
    adminTabButtons.forEach(button => {
      const isActive = button.getAttribute("data-admin-tab") === tabName;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    if (dashboardPanel) {
      dashboardPanel.hidden = tabName !== "dashboard";
    }

    if (siteBuilderPanel) {
      siteBuilderPanel.hidden = tabName !== "site-builder";
    }
  }

  function showLoginView() {
    if (loginView) loginView.hidden = false;
    if (editorView) editorView.hidden = true;
    setStatus(loginStatus, "");
    setStatus(editorStatus, "");
    setStatus(showcaseStatus, "");
    setStatus(aboutBakerStatus, "");
  }

  function showEditorView(username = "") {
    if (loginView) loginView.hidden = true;
    if (editorView) editorView.hidden = false;
    if (adminUser) adminUser.textContent = username ? `Signed in as ${username}` : "";
    setStatus(loginStatus, "");
    setActiveAdminTab("dashboard");
  }

  function normalizeString(value) {
    return String(value || "").trim();
  }

  function normalizePricingData(data) {
    const pricing = Array.isArray(data?.pricing) ? data.pricing : [];

    const normalized = pricing
      .map(item => ({
        id: String(item.id || crypto.randomUUID()),
        quantity: Number.parseInt(item.quantity, 10),
        price: Number.parseInt(item.price, 10)
      }))
      .filter(item =>
        item.id &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        Number.isInteger(item.price) &&
        item.price > 0
      );

    return normalized.length ? normalized : clonePricing(defaultPricing);
  }

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

    return paragraphs.length === 3
      ? paragraphs
      : cloneAboutBakerParagraphs(defaultAboutBakerParagraphs);
  }

  function aboutBakerToComparableString(paragraphs) {
    return JSON.stringify(
      paragraphs.map(paragraph => normalizeString(paragraph))
    );
  }

  function cloneShowcase(showcase) {
    return showcase.map(item => ({
      ...item,
      descriptions: [...(item.descriptions || [])],
      tags: [...(item.tags || [])],
      image: item.image ? { ...item.image } : null
    }));
  }

  function normalizeShowcaseDescriptions(descriptions) {
    if (!Array.isArray(descriptions)) {
      return [];
    }

    return descriptions
      .map(description => normalizeString(description))
      .filter(Boolean)
      .slice(0, 4);
  }

  function normalizeShowcaseTags(tags) {
    const allowedTags = ["minimal", "floral", "kids", "lux"];

    if (!Array.isArray(tags)) {
      return [];
    }

    return [...new Set(
      tags
        .map(tag => normalizeString(tag).toLowerCase())
        .filter(tag => allowedTags.includes(tag))
    )];
  }

  function normalizeShowcaseImage(image) {
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
        const title = normalizeString(item.title);
        const image = normalizeShowcaseImage(item.image);

        return {
          id: normalizeString(item.id) || crypto.randomUUID(),
          title,
          descriptions: normalizeShowcaseDescriptions(item.descriptions),
          tags: normalizeShowcaseTags(item.tags),
          image: image
            ? {
              ...image,
              alt: image.alt || `${title} cookie set`
            }
            : null
        };
      })
      .filter(item =>
        item.id &&
        item.title &&
        item.descriptions.length &&
        item.tags.length &&
        item.image
      );

    const normalizedShowcase = normalized.length ? normalized : cloneShowcase(defaultShowcase);

    return {
      featuredShowcaseId: normalizeFeaturedShowcaseId(data?.featuredShowcaseId, normalizedShowcase),
      showcase: normalizedShowcase
    };
  }

  function pricingToComparableString(pricing) {
    return JSON.stringify(
      pricing.map(item => ({
        id: item.id,
        quantity: Number.parseInt(item.quantity, 10),
        price: Number.parseInt(item.price, 10)
      }))
    );
  }

  function showcaseToComparableString(showcase) {
    return JSON.stringify(
      showcase.map(item => ({
        id: item.id,
        title: normalizeString(item.title),
        descriptions: (item.descriptions || [])
          .map(description => normalizeString(description))
          .filter(Boolean),
        tags: [...(item.tags || [])].sort(),
        image: item.image
          ? {
            type: item.image.type,
            src: item.image.src || "",
            key: item.image.key || "",
            url: item.image.url || "",
            contentType: item.image.contentType || "",
            alt: item.image.alt || ""
          }
          : null
      }))
    );
  }

  function hasPendingShowcaseImages() {
    return Object.keys(pendingShowcaseImages).length > 0;
  }

  function hasUnsavedChanges() {
    const pricingChanged = pricingToComparableString(originalPricing) !== pricingToComparableString(draftPricing);
    const showcaseChanged = showcaseToComparableString(originalShowcase) !== showcaseToComparableString(draftShowcase);
    const featuredShowcaseChanged = originalFeaturedShowcaseId !== draftFeaturedShowcaseId;
    const aboutBakerChanged = aboutBakerToComparableString(originalAboutBakerParagraphs) !== aboutBakerToComparableString(draftAboutBakerParagraphs);

    return pricingChanged || showcaseChanged || featuredShowcaseChanged || aboutBakerChanged || hasPendingShowcaseImages();
  }

  function updateActionBar() {
    if (!adminActions) return;
    adminActions.hidden = !hasUnsavedChanges();
  }

  function validateDraftPricing() {
    if (!draftPricing.length) {
      return "At least one pricing card is required.";
    }

    const invalidItem = draftPricing.find(item =>
      !Number.isInteger(Number.parseInt(item.quantity, 10)) ||
      Number.parseInt(item.quantity, 10) <= 0 ||
      !Number.isInteger(Number.parseInt(item.price, 10)) ||
      Number.parseInt(item.price, 10) <= 0
    );

    if (invalidItem) {
      return "Each pricing card must have a positive quantity and positive price.";
    }

    return "";
  }

  function markInvalidInputs() {
    const quantityInputs = adminPricingGrid?.querySelectorAll("[data-pricing-field='quantity']") || [];
    const priceInputs = adminPricingGrid?.querySelectorAll("[data-pricing-field='price']") || [];

    quantityInputs.forEach(input => {
      const value = Number.parseInt(input.value, 10);
      input.classList.toggle("is-invalid", !Number.isInteger(value) || value <= 0);
    });

    priceInputs.forEach(input => {
      const value = Number.parseInt(input.value, 10);
      input.classList.toggle("is-invalid", !Number.isInteger(value) || value <= 0);
    });
  }

  function updatePricingValue(id, field, value) {
    draftPricing = draftPricing.map(item => {
      if (item.id !== id) {
        return item;
      }

      return {
        ...item,
        [field]: Number.parseInt(value, 10)
      };
    });

    markInvalidInputs();
    updateActionBar();
    setStatus(editorStatus, "");
  }

  function deletePricingCard(id) {
    draftPricing = draftPricing.filter(item => item.id !== id);
    renderPricingEditor();
    updateActionBar();
    setStatus(editorStatus, "");
  }

  function getNextPricingDefaults() {
    const quantities = draftPricing
      .map(item => Number.parseInt(item.quantity, 10))
      .filter(value => Number.isInteger(value) && value > 0);

    const prices = draftPricing
      .map(item => Number.parseInt(item.price, 10))
      .filter(value => Number.isInteger(value) && value > 0);

    const highestQuantity = quantities.length ? Math.max(...quantities) : 0;
    const highestPrice = prices.length ? Math.max(...prices) : 0;

    return {
      quantity: highestQuantity ? highestQuantity + 12 : 12,
      price: highestPrice ? highestPrice + 12 : 12
    };
  }

  function addPricingCard() {
    const defaults = getNextPricingDefaults();

    draftPricing.push({
      id: crypto.randomUUID(),
      quantity: defaults.quantity,
      price: defaults.price
    });

    renderPricingEditor();
    updateActionBar();
    setStatus(editorStatus, "");
  }

  function createPricingCard(item) {
    const itemWrap = document.createElement("div");
    itemWrap.className = "admin-pricing-item";

    const card = document.createElement("div");
    card.className = "admin-pricing-card";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "admin-delete-pricing-btn";
    deleteBtn.setAttribute("aria-label", `Delete set of ${item.quantity}`);
    deleteBtn.addEventListener("click", () => deletePricingCard(item.id));

    const quantityField = document.createElement("div");
    quantityField.className = "admin-pricing-field";

    const quantityLabel = document.createElement("label");
    quantityLabel.className = "admin-pricing-label";
    quantityLabel.setAttribute("for", `quantity-${item.id}`);
    quantityLabel.textContent = "Set of";

    const quantityInput = document.createElement("input");
    quantityInput.className = "admin-pricing-input quantity-input";
    quantityInput.id = `quantity-${item.id}`;
    quantityInput.type = "number";
    quantityInput.min = "1";
    quantityInput.step = "1";
    quantityInput.value = item.quantity;
    quantityInput.setAttribute("data-pricing-field", "quantity");
    quantityInput.addEventListener("input", () => updatePricingValue(item.id, "quantity", quantityInput.value));

    quantityField.append(quantityLabel, quantityInput);

    const priceField = document.createElement("div");
    priceField.className = "admin-pricing-field";

    const priceLabel = document.createElement("label");
    priceLabel.className = "admin-pricing-label";
    priceLabel.setAttribute("for", `price-${item.id}`);
    priceLabel.textContent = "Price";

    const priceInputWrap = document.createElement("div");
    priceInputWrap.className = "admin-price-input-wrap";

    const priceInput = document.createElement("input");
    priceInput.className = "admin-pricing-input price-input";
    priceInput.id = `price-${item.id}`;
    priceInput.type = "number";
    priceInput.min = "1";
    priceInput.step = "1";
    priceInput.value = item.price;
    priceInput.setAttribute("data-pricing-field", "price");
    priceInput.addEventListener("input", () => updatePricingValue(item.id, "price", priceInput.value));

    priceInputWrap.appendChild(priceInput);
    priceField.append(priceLabel, priceInputWrap);

    card.append(deleteBtn, quantityField, priceField);
    itemWrap.appendChild(card);

    return itemWrap;
  }

  function createAddButton() {
    const wrap = document.createElement("div");
    wrap.className = "admin-add-pricing-wrap";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "admin-add-pricing-btn";
    button.setAttribute("aria-label", "Add pricing card");
    button.addEventListener("click", addPricingCard);

    wrap.appendChild(button);
    return wrap;
  }

  function renderPricingEditor() {
    if (!adminPricingGrid) return;

    adminPricingGrid.innerHTML = "";

    draftPricing.forEach(item => {
      adminPricingGrid.appendChild(createPricingCard(item));
    });

    adminPricingGrid.appendChild(createAddButton());
    markInvalidInputs();
  }

  function getAdminShowcaseImageSrc(item) {
    const pendingImage = pendingShowcaseImages[item.id];

    if (pendingImage?.previewUrl) {
      return pendingImage.previewUrl;
    }

    if (item.image?.type === "blob") {
      return item.image.url;
    }

    if (item.image?.type === "static") {
      return item.image.src.startsWith("/")
        ? item.image.src
        : `/${item.image.src}`;
    }

    return "";
  }

  function getDescriptionValue(item, index) {
    return item.descriptions?.[index] || "";
  }

  function revokePendingShowcaseImageUrl(id) {
    const pendingImage = pendingShowcaseImages[id];

    if (pendingImage?.previewUrl) {
      URL.revokeObjectURL(pendingImage.previewUrl);
    }
  }

  function markInvalidShowcaseInputs() {
    const showcaseCards = adminShowcaseGrid?.querySelectorAll(".admin-showcase-card") || [];

    showcaseCards.forEach(card => {
      const titleInput = card.querySelector("[data-showcase-field='title']");
      const descriptionInputs = card.querySelectorAll("[data-showcase-field='description']");
      const tagsWrap = card.querySelector("[data-showcase-field='tags']");
      const imageWrap = card.querySelector("[data-showcase-field='image']");

      const hasTitle = Boolean(normalizeString(titleInput?.value));
      const hasDescription = Array.from(descriptionInputs).some(input => Boolean(normalizeString(input.value)));
      const hasTag = Boolean(tagsWrap?.querySelector("input:checked"));
      const hasImage = imageWrap?.getAttribute("data-has-image") === "true";

      titleInput?.classList.toggle("is-invalid", !hasTitle);
      descriptionInputs.forEach(input => {
        input.classList.toggle("is-invalid", !hasDescription);
      });
      tagsWrap?.classList.toggle("is-invalid", !hasTag);
      imageWrap?.classList.toggle("is-invalid", !hasImage);
    });
  }

  function updateShowcaseItem(id, updater) {
    draftShowcase = draftShowcase.map(item => {
      if (item.id !== id) {
        return item;
      }

      return updater(item);
    });

    markInvalidShowcaseInputs();
    updateActionBar();
    setStatus(showcaseStatus, "");
  }

  function updateShowcaseTitle(id, value) {
    updateShowcaseItem(id, item => ({
      ...item,
      title: value
    }));
  }

  function updateShowcaseDescription(id, index, value) {
    updateShowcaseItem(id, item => {
      const descriptions = [...(item.descriptions || [])];

      descriptions[index] = value;

      return {
        ...item,
        descriptions
      };
    });
  }

  function updateShowcaseTags(id, tagsWrap) {
    const selectedTags = Array.from(tagsWrap.querySelectorAll("input:checked"))
      .map(input => input.value);

    updateShowcaseItem(id, item => ({
      ...item,
      tags: selectedTags
    }));
  }

  function updateFeaturedShowcase(id) {
    if (!draftShowcase.some(item => item.id === id)) {
      return;
    }

    draftFeaturedShowcaseId = id;

    renderShowcaseEditor();
    updateActionBar();
    setStatus(showcaseStatus, "");
  }

  function isValidShowcaseImageFile(file) {
    return file && allowedShowcaseImageTypes.includes(file.type);
  }

  function addShowcaseCard() {
    const id = crypto.randomUUID();

    draftShowcase.push({
      id,
      title: "",
      descriptions: ["", ""],
      tags: [],
      image: null
    });

    if (!draftFeaturedShowcaseId) {
      draftFeaturedShowcaseId = id;
    }

    renderShowcaseEditor();
    updateActionBar();
    setStatus(showcaseStatus, "");
  }

  function deleteShowcaseCard(id) {
    revokePendingShowcaseImageUrl(id);
    delete pendingShowcaseImages[id];

    draftShowcase = draftShowcase.filter(item => item.id !== id);

    if (draftFeaturedShowcaseId === id) {
      draftFeaturedShowcaseId = normalizeFeaturedShowcaseId("", draftShowcase);
    }

    renderShowcaseEditor();
    updateActionBar();
    setStatus(showcaseStatus, "");
  }

  function updateShowcaseImage(id, file) {
    if (!file) {
      return;
    }

    if (!isValidShowcaseImageFile(file)) {
      setStatus(showcaseStatus, "Please upload a JPG, PNG, WEBP, or GIF image.", "error");
      return;
    }

    if (file.size > maxShowcaseImageSizeBytes) {
      setStatus(showcaseStatus, "Image is too large. Please upload an image that is 4 MB or smaller.", "error");
      return;
    }

    revokePendingShowcaseImageUrl(id);

    pendingShowcaseImages[id] = {
      file,
      previewUrl: URL.createObjectURL(file)
    };

    updateShowcaseItem(id, item => ({
      ...item,
      image: {
        type: "pending",
        alt: item.title ? `${item.title} cookie set` : "Cookie set"
      }
    }));

    renderShowcaseEditor();
    updateActionBar();
  }

  function createShowcaseCard(item) {
    const itemWrap = document.createElement("div");
    itemWrap.className = "admin-showcase-item";

    const card = document.createElement("div");
    card.className = "admin-showcase-card";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "admin-delete-showcase-btn";
    deleteBtn.setAttribute("aria-label", `Delete ${item.title || "showcase card"}`);
    deleteBtn.addEventListener("click", () => deleteShowcaseCard(item.id));

    const imageWrap = document.createElement("div");
    imageWrap.className = "admin-showcase-image-wrap";
    imageWrap.setAttribute("data-showcase-field", "image");
    imageWrap.setAttribute("data-has-image", getAdminShowcaseImageSrc(item) ? "true" : "false");

    const imageSrc = getAdminShowcaseImageSrc(item);

    if (imageSrc) {
      const image = document.createElement("img");
      image.className = "admin-showcase-image";
      image.src = imageSrc;
      image.alt = item.image?.alt || `${item.title} cookie set`;
      imageWrap.appendChild(image);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "admin-showcase-image-placeholder";
      placeholder.innerHTML = `
      <i class="bi bi-image"></i>
      <span>No image selected</span>
    `;
      imageWrap.appendChild(placeholder);
    }

    const featuredControl = document.createElement("div");
    featuredControl.className = "admin-showcase-featured-control";

    const featuredLabel = document.createElement("label");
    featuredLabel.className = "admin-showcase-featured-label";

    const featuredInput = document.createElement("input");
    featuredInput.type = "radio";
    featuredInput.name = "featuredShowcaseId";
    featuredInput.value = item.id;
    featuredInput.checked = draftFeaturedShowcaseId === item.id;
    featuredInput.addEventListener("change", () => updateFeaturedShowcase(item.id));

    const featuredPill = document.createElement("span");
    featuredPill.className = "admin-showcase-featured-pill";
    featuredPill.innerHTML = featuredInput.checked
      ? `<i class="bi bi-star-fill"></i> Featured Set`
      : `<i class="bi bi-star"></i> Set as Featured`;

    featuredLabel.append(featuredInput, featuredPill);
    featuredControl.appendChild(featuredLabel);

    const uploadRow = document.createElement("div");
    uploadRow.className = "admin-showcase-upload-row";

    const fileInput = document.createElement("input");
    fileInput.className = "admin-showcase-file-input";
    fileInput.id = `showcase-image-${item.id}`;
    fileInput.type = "file";
    fileInput.accept = "image/jpeg,image/png,image/webp,image/gif";
    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];

      if (file) {
        updateShowcaseImage(item.id, file);
      }
    });

    const uploadLabel = document.createElement("label");
    uploadLabel.className = "btn btn-outline-dark btn-sm admin-showcase-upload-btn";
    uploadLabel.setAttribute("for", fileInput.id);
    uploadLabel.textContent = imageSrc ? "Change Image" : "Upload Image";

    const fileName = document.createElement("span");
    fileName.className = "admin-showcase-file-name";
    fileName.textContent = pendingShowcaseImages[item.id]?.file?.name || "";

    uploadRow.append(fileInput, uploadLabel, fileName);

    const titleField = document.createElement("div");
    titleField.className = "admin-showcase-field";

    const titleLabel = document.createElement("label");
    titleLabel.className = "admin-showcase-label";
    titleLabel.setAttribute("for", `showcase-title-${item.id}`);
    titleLabel.textContent = "Title";

    const titleInput = document.createElement("input");
    titleInput.className = "admin-showcase-input";
    titleInput.id = `showcase-title-${item.id}`;
    titleInput.type = "text";
    titleInput.value = item.title || "";
    titleInput.placeholder = "e.g., Easter";
    titleInput.setAttribute("data-showcase-field", "title");
    titleInput.addEventListener("input", () => updateShowcaseTitle(item.id, titleInput.value));

    titleField.append(titleLabel, titleInput);

    const descriptionsField = document.createElement("div");
    descriptionsField.className = "admin-showcase-field";

    const descriptionsLabel = document.createElement("label");
    descriptionsLabel.className = "admin-showcase-label";
    descriptionsLabel.textContent = "Descriptions";

    const descriptionsGrid = document.createElement("div");
    descriptionsGrid.className = "admin-showcase-description-grid";

    const descriptionInput1 = document.createElement("input");
    descriptionInput1.className = "admin-showcase-input";
    descriptionInput1.type = "text";
    descriptionInput1.value = getDescriptionValue(item, 0);
    descriptionInput1.placeholder = "e.g., Spring colors";
    descriptionInput1.setAttribute("data-showcase-field", "description");
    descriptionInput1.addEventListener("input", () => updateShowcaseDescription(item.id, 0, descriptionInput1.value));

    const descriptionInput2 = document.createElement("input");
    descriptionInput2.className = "admin-showcase-input";
    descriptionInput2.type = "text";
    descriptionInput2.value = getDescriptionValue(item, 1);
    descriptionInput2.placeholder = "e.g., Playful & pastel design";
    descriptionInput2.setAttribute("data-showcase-field", "description");
    descriptionInput2.addEventListener("input", () => updateShowcaseDescription(item.id, 1, descriptionInput2.value));

    const descriptionsHelp = document.createElement("div");
    descriptionsHelp.className = "admin-showcase-help-text";
    descriptionsHelp.textContent = "Descriptions will appear separated by • on the public site.";

    descriptionsGrid.append(descriptionInput1, descriptionInput2);
    descriptionsField.append(descriptionsLabel, descriptionsGrid, descriptionsHelp);

    const tagsField = document.createElement("div");
    tagsField.className = "admin-showcase-field";

    const tagsLabel = document.createElement("div");
    tagsLabel.className = "admin-showcase-label";
    tagsLabel.textContent = "Tags";

    const tagsWrap = document.createElement("div");
    tagsWrap.className = "admin-showcase-tags";
    tagsWrap.setAttribute("data-showcase-field", "tags");

    showcaseTagOptions.forEach(tagOption => {
      const label = document.createElement("label");
      label.className = "admin-showcase-tag";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = tagOption.value;
      checkbox.checked = item.tags?.includes(tagOption.value) || false;
      checkbox.addEventListener("change", () => updateShowcaseTags(item.id, tagsWrap));

      const text = document.createElement("span");
      text.className = "admin-showcase-tag-text";
      text.textContent = tagOption.label;

      label.append(checkbox, text);
      tagsWrap.appendChild(label);
    });

    tagsField.append(tagsLabel, tagsWrap);

    card.append(
      deleteBtn,
      imageWrap,
      featuredControl,
      uploadRow,
      titleField,
      descriptionsField,
      tagsField
    );

    itemWrap.appendChild(card);

    return itemWrap;
  }

  function createShowcaseAddButton() {
    const wrap = document.createElement("div");
    wrap.className = "admin-add-showcase-wrap";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "admin-add-showcase-btn";
    button.setAttribute("aria-label", "Add showcase card");
    button.addEventListener("click", addShowcaseCard);

    wrap.appendChild(button);
    return wrap;
  }

  function renderShowcaseEditor() {
    if (!adminShowcaseGrid) return;

    adminShowcaseGrid.innerHTML = "";

    draftShowcase.forEach(item => {
      adminShowcaseGrid.appendChild(createShowcaseCard(item));
    });

    adminShowcaseGrid.appendChild(createShowcaseAddButton());
    markInvalidShowcaseInputs();
  }

  function validateDraftAboutBaker() {
    if (draftAboutBakerParagraphs.length !== 3) {
      return "All three About the Baker paragraphs are required.";
    }

    const hasInvalidParagraph = draftAboutBakerParagraphs.some(paragraph => !normalizeString(paragraph));

    if (hasInvalidParagraph) {
      return "All three About the Baker paragraphs are required.";
    }

    return "";
  }

  function markInvalidAboutBakerInputs() {
    const textareas = adminAboutBakerFields?.querySelectorAll("[data-about-baker-field='paragraph']") || [];

    textareas.forEach(textarea => {
      textarea.classList.toggle("is-invalid", !normalizeString(textarea.value));
    });
  }

  function updateAboutBakerParagraph(index, value) {
    draftAboutBakerParagraphs = draftAboutBakerParagraphs.map((paragraph, paragraphIndex) =>
      paragraphIndex === index ? value : paragraph
    );

    markInvalidAboutBakerInputs();
    updateActionBar();
    setStatus(aboutBakerStatus, "");
  }

  function createAboutBakerField(paragraph, index) {
    const field = document.createElement("div");
    field.className = "admin-about-baker-field";

    const label = document.createElement("label");
    label.className = "admin-about-baker-label";
    label.setAttribute("for", `about-baker-paragraph-${index}`);
    label.textContent = `Paragraph ${index + 1}`;

    const textarea = document.createElement("textarea");
    textarea.className = "admin-about-baker-textarea";
    textarea.id = `about-baker-paragraph-${index}`;
    textarea.value = paragraph;
    textarea.rows = 5;
    textarea.setAttribute("data-about-baker-field", "paragraph");
    textarea.addEventListener("input", () => updateAboutBakerParagraph(index, textarea.value));

    const helpText = document.createElement("div");
    helpText.className = "admin-about-baker-help-text";
    helpText.textContent = "Plain text only. This paragraph will appear exactly as entered on the public website.";

    field.append(label, textarea, helpText);

    return field;
  }

  function renderAboutBakerEditor() {
    if (!adminAboutBakerFields) return;

    adminAboutBakerFields.innerHTML = "";

    draftAboutBakerParagraphs.forEach((paragraph, index) => {
      adminAboutBakerFields.appendChild(createAboutBakerField(paragraph, index));
    });

    markInvalidAboutBakerInputs();
  }

  function normalizeCookieRequest(request) {
    const images = Array.isArray(request?.images) ? request.images : [];

    return {
      id: normalizeString(request?.id),
      createdAt: normalizeString(request?.createdAt),
      name: normalizeString(request?.name),
      email: normalizeString(request?.email),
      phone: normalizeString(request?.phone),
      eventDate: normalizeString(request?.eventDate),
      quantity: Number.parseInt(request?.quantity, 10),
      estimatedPrice: normalizeString(request?.estimatedPrice),
      theme: normalizeString(request?.theme),
      inspo: normalizeString(request?.inspo),
      details: normalizeString(request?.details),
      images: images
        .map(image => ({
          fileName: normalizeString(image.fileName),
          url: normalizeString(image.url),
          contentType: normalizeString(image.contentType)
        }))
        .filter(image => image.fileName && image.url)
    };
  }

  function getTodayDateValue() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function formatDateValue(dateValue) {
    const parts = normalizeString(dateValue).split("-").map(Number);

    if (parts.length !== 3 || parts.some(part => !Number.isInteger(part))) {
      return dateValue || "(not provided)";
    }

    const date = new Date(parts[0], parts[1] - 1, parts[2]);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  function formatSubmittedDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value || "(not provided)";
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function createRequestDetail(label, value) {
    const detail = document.createElement("div");
    detail.className = "admin-request-detail";

    const labelEl = document.createElement("div");
    labelEl.className = "admin-request-label";
    labelEl.textContent = label;

    const valueEl = document.createElement("div");
    valueEl.className = "admin-request-value";
    valueEl.textContent = value || "(not provided)";

    detail.append(labelEl, valueEl);

    return detail;
  }

  function createRequestLinkDetail(label, value) {
    const detail = document.createElement("div");
    detail.className = "admin-request-detail";

    const labelEl = document.createElement("div");
    labelEl.className = "admin-request-label";
    labelEl.textContent = label;

    const valueEl = document.createElement("div");
    valueEl.className = "admin-request-value";

    if (value) {
      const link = document.createElement("a");
      link.href = value;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = value;
      valueEl.appendChild(link);
    } else {
      valueEl.textContent = "(not provided)";
    }

    detail.append(labelEl, valueEl);

    return detail;
  }

  function createRequestImages(images) {
    const wrap = document.createElement("div");
    wrap.className = "admin-request-images";

    images.forEach(image => {
      const link = document.createElement("a");
      link.className = "admin-request-image-link";
      link.href = image.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.title = image.fileName;

      const img = document.createElement("img");
      img.src = image.url;
      img.alt = image.fileName;
      img.loading = "lazy";

      link.appendChild(img);
      wrap.appendChild(link);
    });

    return wrap;
  }

  function createRequestCard(request) {
    const card = document.createElement("article");
    card.className = "admin-request-card";

    const header = document.createElement("div");
    header.className = "admin-request-card-header";

    const titleWrap = document.createElement("div");

    const title = document.createElement("h4");
    title.className = "admin-request-card-title";
    title.textContent = request.name;

    const submitted = document.createElement("div");
    submitted.className = "text-secondary small";
    submitted.textContent = `Submitted ${formatSubmittedDate(request.createdAt)}`;

    titleWrap.append(title, submitted);

    const date = document.createElement("div");
    date.className = "admin-request-card-date";
    date.textContent = formatDateValue(request.eventDate);

    header.append(titleWrap, date);

    const details = document.createElement("div");
    details.className = "admin-request-details";

    details.append(
      createRequestDetail("Email", request.email),
      createRequestDetail("Phone", request.phone),
      createRequestDetail("Quantity", Number.isInteger(request.quantity) ? String(request.quantity) : ""),
      createRequestDetail("Estimated Price", request.estimatedPrice),
      createRequestDetail("Theme", request.theme),
      createRequestLinkDetail("Inspiration Link", request.inspo)
    );

    const message = document.createElement("div");
    message.className = "admin-request-message";

    const messageLabel = document.createElement("div");
    messageLabel.className = "admin-request-label";
    messageLabel.textContent = "Details";

    const messageValue = document.createElement("div");
    messageValue.className = "admin-request-value";
    messageValue.textContent = request.details || "(not provided)";

    message.append(messageLabel, messageValue);

    card.append(header, details, message);

    if (request.images.length) {
      const imagesSection = document.createElement("div");
      imagesSection.className = "admin-request-message";

      const imagesLabel = document.createElement("div");
      imagesLabel.className = "admin-request-label";
      imagesLabel.textContent = "Inspiration Images";

      imagesSection.append(imagesLabel, createRequestImages(request.images));
      card.appendChild(imagesSection);
    }

    return card;
  }

  function renderRequestGrid(grid, requests, emptyMessage) {
    if (!grid) return;

    grid.innerHTML = "";

    if (!requests.length) {
      const empty = document.createElement("div");
      empty.className = "admin-request-empty";
      empty.textContent = emptyMessage;
      grid.appendChild(empty);
      return;
    }

    requests.forEach(request => {
      grid.appendChild(createRequestCard(request));
    });
  }

  function renderCookieRequests() {
    const today = getTodayDateValue();

    const upcomingRequests = cookieRequests
      .filter(request => request.eventDate >= today)
      .sort((a, b) => {
        const dateSort = a.eventDate.localeCompare(b.eventDate);

        if (dateSort !== 0) {
          return dateSort;
        }

        return b.createdAt.localeCompare(a.createdAt);
      });

    const pastRequests = cookieRequests
      .filter(request => request.eventDate < today)
      .sort((a, b) => {
        const dateSort = b.eventDate.localeCompare(a.eventDate);

        if (dateSort !== 0) {
          return dateSort;
        }

        return b.createdAt.localeCompare(a.createdAt);
      });

    renderRequestGrid(upcomingRequestsGrid, upcomingRequests, "No upcoming cookie requests yet.");
    renderRequestGrid(pastRequestsGrid, pastRequests, "No past cookie requests yet.");
  }

  async function loadCookieRequests() {
    const data = await fetchJson("/.netlify/functions/get-cookie-requests");
    const requests = Array.isArray(data?.requests) ? data.requests : [];

    return requests
      .map(normalizeCookieRequest)
      .filter(request =>
        request.id &&
        request.createdAt &&
        request.name &&
        request.email &&
        request.eventDate &&
        Number.isInteger(request.quantity) &&
        request.theme &&
        request.details
      );
  }

  async function refreshCookieRequests() {
    setStatus(cookieRequestsStatus, "Loading requests...");

    try {
      cookieRequests = await loadCookieRequests();
      renderCookieRequests();
      setStatus(cookieRequestsStatus, "");
    } catch (err) {
      console.warn("Could not load cookie requests.", err);
      cookieRequests = [];
      renderCookieRequests();
      setStatus(cookieRequestsStatus, err.message || "Could not load cookie requests.", "error");
    }
  }

  async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
      credentials: "same-origin",
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

  async function loadPricing() {
    try {
      const data = await fetchJson("/.netlify/functions/get-pricing");
      return normalizePricingData(data);
    } catch (err) {
      console.warn("Could not load pricing from function.", err);
    }

    try {
      const response = await fetch("/data/default-pricing.json", {
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        return normalizePricingData(data);
      }
    } catch (err) {
      console.warn("Could not load default pricing JSON.", err);
    }

    return clonePricing(defaultPricing);
  }

  async function loadShowcase() {
    try {
      const data = await fetchJson("/.netlify/functions/get-showcase");
      return normalizeShowcaseData(data);
    } catch (err) {
      console.warn("Could not load showcase from function.", err);
    }

    try {
      const response = await fetch("/data/default-showcase.json", {
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        return normalizeShowcaseData(data);
      }
    } catch (err) {
      console.warn("Could not load default showcase JSON.", err);
    }

    return {
      featuredShowcaseId: defaultFeaturedShowcaseId,
      showcase: cloneShowcase(defaultShowcase)
    };
  }

  async function loadAboutBaker() {
    try {
      const data = await fetchJson("/.netlify/functions/get-about-baker");
      return normalizeAboutBakerData(data);
    } catch (err) {
      console.warn("Could not load About the Baker from function.", err);
    }

    try {
      const response = await fetch("/data/default-about-baker.json", {
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        return normalizeAboutBakerData(data);
      }
    } catch (err) {
      console.warn("Could not load default About the Baker JSON.", err);
    }

    return cloneAboutBakerParagraphs(defaultAboutBakerParagraphs);
  }

  async function initializeEditor(username = "") {
    showEditorView(username);
    setStatus(editorStatus, "Loading pricing...");
    setStatus(showcaseStatus, "Loading showcase...");
    setStatus(aboutBakerStatus, "Loading About the Baker...");

    const [pricing, showcaseData, aboutBakerParagraphs] = await Promise.all([
      loadPricing(),
      loadShowcase(),
      loadAboutBaker()
    ]);

    originalPricing = clonePricing(pricing);
    draftPricing = clonePricing(pricing);

    originalShowcase = cloneShowcase(showcaseData.showcase);
    draftShowcase = cloneShowcase(showcaseData.showcase);
    originalFeaturedShowcaseId = showcaseData.featuredShowcaseId;
    draftFeaturedShowcaseId = showcaseData.featuredShowcaseId;
    pendingShowcaseImages = {};

    originalAboutBakerParagraphs = cloneAboutBakerParagraphs(aboutBakerParagraphs);
    draftAboutBakerParagraphs = cloneAboutBakerParagraphs(aboutBakerParagraphs);

    renderPricingEditor();
    renderShowcaseEditor();
    renderAboutBakerEditor();
    updateActionBar();

    setStatus(editorStatus, "");
    setStatus(showcaseStatus, "");
    setStatus(aboutBakerStatus, "");

    await refreshCookieRequests();
  }

  async function checkSession() {
    try {
      const data = await fetchJson("/.netlify/functions/admin-me");

      if (data.authenticated) {
        await initializeEditor(data.username || "");
        return;
      }
    } catch (err) {
      console.warn("Could not check admin session.", err);
    }

    showLoginView();
  }

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus(loginStatus, "");

    if (!loginForm.checkValidity()) {
      loginForm.classList.add("was-validated");
      setStatus(loginStatus, "Please enter your username and password.", "error");
      return;
    }

    const formData = new FormData(loginForm);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      if (loginBtn) loginBtn.disabled = true;
      setStatus(loginStatus, "Signing in...");

      await fetchJson("/.netlify/functions/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      loginForm.reset();
      loginForm.classList.remove("was-validated");

      await initializeEditor(username);
    } catch (err) {
      setStatus(loginStatus, err.message || "Invalid username or password.", "error");
    } finally {
      if (loginBtn) loginBtn.disabled = false;
    }
  });

  logoutBtn?.addEventListener("click", async () => {
    try {
      await fetchJson("/.netlify/functions/admin-logout", {
        method: "POST"
      });
    } catch (err) {
      console.warn("Logout request failed.", err);
    }

    originalPricing = [];
    draftPricing = [];
    originalShowcase = [];
    draftShowcase = [];
    originalFeaturedShowcaseId = "";
    draftFeaturedShowcaseId = "";
    pendingShowcaseImages = {};
    originalAboutBakerParagraphs = [];
    draftAboutBakerParagraphs = [];
    cookieRequests = [];
    renderCookieRequests();
    setStatus(cookieRequestsStatus, "");
    showLoginView();
  });

  revertChangesBtn?.addEventListener("click", () => {
    Object.keys(pendingShowcaseImages).forEach(id => {
      revokePendingShowcaseImageUrl(id);
    });

    draftPricing = clonePricing(originalPricing);
    draftShowcase = cloneShowcase(originalShowcase);
    draftFeaturedShowcaseId = originalFeaturedShowcaseId;
    pendingShowcaseImages = {};
    draftAboutBakerParagraphs = cloneAboutBakerParagraphs(originalAboutBakerParagraphs);

    renderPricingEditor();
    renderShowcaseEditor();
    renderAboutBakerEditor();
    updateActionBar();

    setStatus(editorStatus, "Changes reverted.", "success");
    setStatus(showcaseStatus, "Changes reverted.", "success");
    setStatus(aboutBakerStatus, "Changes reverted.", "success");
  });

  function validateDraftShowcase() {
    if (!draftShowcase.length) {
      return "At least one showcase card is required.";
    }

    if (!draftShowcase.some(item => item.id === draftFeaturedShowcaseId)) {
      return "Please select a valid Featured Set.";
    }

    const invalidItem = draftShowcase.find(item => {
      const hasTitle = Boolean(normalizeString(item.title));
      const hasDescription = (item.descriptions || []).some(description => Boolean(normalizeString(description)));
      const hasTag = Array.isArray(item.tags) && item.tags.length > 0;
      const hasExistingImage = item.image?.type === "static" || item.image?.type === "blob";
      const hasPendingImage = Boolean(pendingShowcaseImages[item.id]?.file);

      return !hasTitle || !hasDescription || !hasTag || (!hasExistingImage && !hasPendingImage);
    });

    if (invalidItem) {
      return "Each showcase card must have a title, at least one description, at least one tag, and an image.";
    }

    return "";
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Could not read selected image."));

      reader.readAsDataURL(file);
    });
  }

  async function uploadShowcaseImage(file) {
    const dataBase64 = await readFileAsDataUrl(file);

    const data = await fetchJson("/.netlify/functions/save-showcase-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        dataBase64
      })
    });

    if (!data.image) {
      throw new Error("Image upload failed.");
    }

    return data.image;
  }

  async function buildShowcaseForSave() {
    const showcaseToSave = [];

    for (const item of draftShowcase) {
      const title = normalizeString(item.title);
      const descriptions = (item.descriptions || [])
        .map(description => normalizeString(description))
        .filter(Boolean);

      const tags = [...new Set(
        (item.tags || [])
          .map(tag => normalizeString(tag).toLowerCase())
          .filter(Boolean)
      )];

      let image = item.image ? { ...item.image } : null;
      const pendingImage = pendingShowcaseImages[item.id];

      if (pendingImage?.file) {
        const uploadedImage = await uploadShowcaseImage(pendingImage.file);

        image = {
          ...uploadedImage,
          alt: `${title} cookie set`
        };
      } else if (image) {
        image = {
          ...image,
          alt: image.alt || `${title} cookie set`
        };
      }

      showcaseToSave.push({
        id: item.id,
        title,
        descriptions,
        tags,
        image
      });
    }

    return showcaseToSave;
  }

  function clearPendingShowcaseImages() {
    Object.keys(pendingShowcaseImages).forEach(id => {
      revokePendingShowcaseImageUrl(id);
    });

    pendingShowcaseImages = {};
  }

  saveChangesBtn?.addEventListener("click", async () => {
    markInvalidInputs();
    markInvalidShowcaseInputs();
    markInvalidAboutBakerInputs();

    const pricingValidationMessage = validateDraftPricing();

    if (pricingValidationMessage) {
      setStatus(editorStatus, pricingValidationMessage, "error");
      return;
    }

    const showcaseValidationMessage = validateDraftShowcase();

    if (showcaseValidationMessage) {
      setStatus(showcaseStatus, showcaseValidationMessage, "error");
      return;
    }

    const aboutBakerValidationMessage = validateDraftAboutBaker();

    if (aboutBakerValidationMessage) {
      setStatus(aboutBakerStatus, aboutBakerValidationMessage, "error");
      return;
    }

    const pricingToSave = draftPricing.map(item => ({
      id: item.id,
      quantity: Number.parseInt(item.quantity, 10),
      price: Number.parseInt(item.price, 10)
    }));

    const aboutBakerToSave = draftAboutBakerParagraphs.map(paragraph => normalizeString(paragraph));

    try {
      if (saveChangesBtn) saveChangesBtn.disabled = true;
      if (revertChangesBtn) revertChangesBtn.disabled = true;

      setStatus(editorStatus, "Saving pricing...");
      setStatus(showcaseStatus, "Uploading images and saving showcase...");
      setStatus(aboutBakerStatus, "Saving About the Baker...");

      const showcaseToSave = await buildShowcaseForSave();

      const [pricingData, showcaseData, aboutBakerData] = await Promise.all([
        fetchJson("/.netlify/functions/save-pricing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            pricing: pricingToSave
          })
        }),
        fetchJson("/.netlify/functions/save-showcase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            featuredShowcaseId: draftFeaturedShowcaseId,
            showcase: showcaseToSave
          })
        }),
        fetchJson("/.netlify/functions/save-about-baker", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            paragraphs: aboutBakerToSave
          })
        })
      ]);

      const savedPricing = normalizePricingData(pricingData);
      const savedShowcaseData = normalizeShowcaseData(showcaseData);
      const savedAboutBakerParagraphs = normalizeAboutBakerData(aboutBakerData);

      clearPendingShowcaseImages();

      originalPricing = clonePricing(savedPricing);
      draftPricing = clonePricing(savedPricing);

      originalShowcase = cloneShowcase(savedShowcaseData.showcase);
      draftShowcase = cloneShowcase(savedShowcaseData.showcase);
      originalFeaturedShowcaseId = savedShowcaseData.featuredShowcaseId;
      draftFeaturedShowcaseId = savedShowcaseData.featuredShowcaseId;

      originalAboutBakerParagraphs = cloneAboutBakerParagraphs(savedAboutBakerParagraphs);
      draftAboutBakerParagraphs = cloneAboutBakerParagraphs(savedAboutBakerParagraphs);

      renderPricingEditor();
      renderShowcaseEditor();
      renderAboutBakerEditor();
      updateActionBar();

      setStatus(editorStatus, "Pricing saved.", "success");
      setStatus(showcaseStatus, "Showcase saved. The live site will now use these cards.", "success");
      setStatus(aboutBakerStatus, "About the Baker saved.", "success");
    } catch (err) {
      setStatus(showcaseStatus, err.message || "Could not save changes.", "error");
      setStatus(aboutBakerStatus, err.message || "Could not save changes.", "error");
    } finally {
      if (saveChangesBtn) saveChangesBtn.disabled = false;
      if (revertChangesBtn) revertChangesBtn.disabled = false;
    }
  });

  adminTabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const tabName = button.getAttribute("data-admin-tab");

      if (tabName) {
        setActiveAdminTab(tabName);
      }

      if (tabName === "dashboard") {
        refreshCookieRequests();
      }
    });
  });

  checkSession();
})();
