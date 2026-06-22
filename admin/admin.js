(() => {
  const loginView = document.getElementById("loginView");
  const editorView = document.getElementById("editorView");
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const loginStatus = document.getElementById("loginStatus");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminPricingGrid = document.getElementById("adminPricingGrid");
  const adminShowcaseGrid = document.getElementById("adminShowcaseGrid");
  const adminPromoCodesGrid = document.getElementById("adminPromoCodesGrid");
  const adminAboutBakerFields = document.getElementById("adminAboutBakerFields");
  const editorStatus = document.getElementById("editorStatus");
  const showcaseStatus = document.getElementById("showcaseStatus");
  const promoCodesStatus = document.getElementById("promoCodesStatus");
  const aboutBakerStatus = document.getElementById("aboutBakerStatus");
  const adminActions = document.getElementById("adminActions");
  const revertChangesBtn = document.getElementById("revertChangesBtn");
  const saveChangesBtn = document.getElementById("saveChangesBtn");
  const adminTabButtons = document.querySelectorAll("[data-admin-tab]");
  const dashboardPanel = document.getElementById("dashboardPanel");
  const schedulePanel = document.getElementById("schedulePanel");
  const siteBuilderPanel = document.getElementById("siteBuilderPanel");
  const scheduleStatus = document.getElementById("scheduleStatus");
  const noticePeriodDaysInput = document.getElementById("noticePeriodDays");
  const weeklyCapacityCookiesInput = document.getElementById("weeklyCapacityCookies");
  const scheduleMonthLabel = document.getElementById("scheduleMonthLabel");
  const prevScheduleMonthBtn = document.getElementById("prevScheduleMonthBtn");
  const nextScheduleMonthBtn = document.getElementById("nextScheduleMonthBtn");
  const scheduleCalendarDays = document.getElementById("scheduleCalendarDays");
  const saveScheduleBtn = document.getElementById("saveScheduleBtn");
  const revertScheduleBtn = document.getElementById("revertScheduleBtn");
  const cookieRequestsStatus = document.getElementById("cookieRequestsStatus");
  const pendingRequestsGrid = document.getElementById("pendingRequestsGrid");
  const upcomingRequestsGrid = document.getElementById("upcomingRequestsGrid");
  const pastRequestsGrid = document.getElementById("pastRequestsGrid");
  const totalEarned = document.getElementById("totalEarned");
  const analyticsPanel = document.getElementById("analyticsPanel");
  const analyticsStatus = document.getElementById("analyticsStatus");
  const analyticsRange = document.getElementById("analyticsRange");
  const refreshAnalyticsBtn = document.getElementById("refreshAnalyticsBtn");
  const analyticsGeneratedAt = document.getElementById("analyticsGeneratedAt");
  const analyticsVisitors = document.getElementById("analyticsVisitors");
  const analyticsPageViews = document.getElementById("analyticsPageViews");
  const analyticsRequests = document.getElementById("analyticsRequests");
  const analyticsConversionRate = document.getElementById("analyticsConversionRate");
  const analyticsFormStarts = document.getElementById("analyticsFormStarts");
  const analyticsShowcaseOpens = document.getElementById("analyticsShowcaseOpens");
  const analyticsTopCategory = document.getElementById("analyticsTopCategory");
  const analyticsEventsCount = document.getElementById("analyticsEventsCount");
  const analyticsFunnel = document.getElementById("analyticsFunnel");
  const analyticsCategories = document.getElementById("analyticsCategories");
  const analyticsShowcaseImages = document.getElementById("analyticsShowcaseImages");
  const analyticsRecentActivity = document.getElementById("analyticsRecentActivity");

  const defaultPricing = [
    { id: "set-6", quantity: 6, price: 18 },
    { id: "set-12", quantity: 12, price: 33 },
    { id: "set-24", quantity: 24, price: 60 },
    { id: "set-48", quantity: 48, price: 108 },
    { id: "set-96", quantity: 96, price: 192 }
  ];

  const defaultPromoCodes = [
    {
      id: "promo-share15",
      code: "SHARE15",
      discountPercent: 15
    }
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

  const defaultSchedule = {
    noticePeriodDays: 0,
    weeklyCapacityCookies: 0,
    vacationDays: []
  };

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

  let originalPromoCodes = [];
  let draftPromoCodes = [];

  let originalShowcase = [];
  let draftShowcase = [];
  let originalFeaturedShowcaseId = "";
  let draftFeaturedShowcaseId = "";
  let pendingShowcaseImages = {};

  let originalAboutBakerParagraphs = [];
  let draftAboutBakerParagraphs = [];
  let cookieRequests = [];
  let originalSchedule = null;
  let draftSchedule = null;
  let scheduleLoaded = false;
  let scheduleCalendarDate = new Date();
  let analyticsLoaded = false;
  let draggedPricingId = "";
  let draggedShowcaseId = "";
  let editRequestModal = null;
  let editRequestForm = null;
  let editRequestStatus = null;
  let activeEditRequest = null;

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

  function reorderItemsByDrop(items, sourceId, targetId) {
    if (!sourceId || !targetId || sourceId === targetId) {
      return items;
    }

    const sourceIndex = items.findIndex(item => item.id === sourceId);
    const targetIndex = items.findIndex(item => item.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0) {
      return items;
    }

    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(sourceIndex, 1);

    reorderedItems.splice(targetIndex, 0, movedItem);

    return reorderedItems;
  }

  function moveItemsByDirection(items, id, direction) {
    const currentIndex = items.findIndex(item => item.id === id);

    if (currentIndex < 0) {
      return items;
    }

    const nextIndex = direction === "up"
      ? currentIndex - 1
      : currentIndex + 1;

    if (nextIndex < 0 || nextIndex >= items.length) {
      return items;
    }

    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(currentIndex, 1);

    reorderedItems.splice(nextIndex, 0, movedItem);

    return reorderedItems;
  }

  function createMoveButton(label, iconClass, onClick, disabled = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "admin-reorder-btn";
    button.disabled = disabled;
    button.setAttribute("aria-label", label);
    button.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i>`;
    button.addEventListener("click", onClick);

    return button;
  }

  function confirmDestructiveAction(message) {
    return window.confirm(message);
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

    if (schedulePanel) {
      schedulePanel.hidden = tabName !== "schedule";
    }

    if (analyticsPanel) {
      analyticsPanel.hidden = tabName !== "analytics";
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
    setStatus(loginStatus, "");
    setActiveAdminTab("dashboard");
  }

  function normalizeString(value) {
    return String(value || "").trim();
  }

  function cloneSchedule(schedule) {
    const normalizedSchedule = normalizeScheduleData(schedule || defaultSchedule);

    return {
      ...normalizedSchedule,
      vacationDays: [...normalizedSchedule.vacationDays]
    };
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

  function scheduleToComparableString(schedule) {
    const normalizedSchedule = normalizeScheduleData(schedule || defaultSchedule);

    return JSON.stringify({
      noticePeriodDays: normalizedSchedule.noticePeriodDays,
      weeklyCapacityCookies: normalizedSchedule.weeklyCapacityCookies,
      vacationDays: normalizedSchedule.vacationDays
    });
  }

  function getDateKeyFromDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getScheduleMonthLabel(date) {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  }

  function addCalendarDays(date, dayCount) {
    const nextDate = new Date(date);

    nextDate.setDate(nextDate.getDate() + dayCount);

    return nextDate;
  }

  function hasScheduleChanges() {
    return scheduleToComparableString(originalSchedule) !== scheduleToComparableString(draftSchedule);
  }

  function updateScheduleActionButtons() {
    const hasChanges = hasScheduleChanges();

    if (saveScheduleBtn) {
      saveScheduleBtn.disabled = !hasChanges;
    }

    if (revertScheduleBtn) {
      revertScheduleBtn.disabled = !hasChanges;
    }
  }

  function ensureDraftSchedule() {
    if (!draftSchedule) {
      draftSchedule = cloneSchedule(defaultSchedule);
    }

    if (!originalSchedule) {
      originalSchedule = cloneSchedule(defaultSchedule);
    }
  }

  function updateDraftScheduleNumber(fieldName, value) {
    ensureDraftSchedule();

    draftSchedule[fieldName] = normalizeNonNegativeInteger(value, 0);

    updateScheduleActionButtons();
    setStatus(scheduleStatus, "");
  }

  function toggleVacationDay(dateKey) {
    ensureDraftSchedule();

    const vacationDays = new Set(draftSchedule.vacationDays);

    if (vacationDays.has(dateKey)) {
      vacationDays.delete(dateKey);
    } else {
      vacationDays.add(dateKey);
    }

    draftSchedule.vacationDays = [...vacationDays].sort();

    renderScheduleCalendar();
    updateScheduleActionButtons();
    setStatus(scheduleStatus, "");
  }

  function renderScheduleSettings() {
    ensureDraftSchedule();

    if (noticePeriodDaysInput) {
      noticePeriodDaysInput.value = draftSchedule.noticePeriodDays;
    }

    if (weeklyCapacityCookiesInput) {
      weeklyCapacityCookiesInput.value = draftSchedule.weeklyCapacityCookies;
    }
  }

  function renderScheduleCalendar() {
    ensureDraftSchedule();

    if (!scheduleCalendarDays) {
      return;
    }

    scheduleCalendarDays.innerHTML = "";

    const visibleMonth = scheduleCalendarDate.getMonth();
    const monthStart = new Date(scheduleCalendarDate.getFullYear(), scheduleCalendarDate.getMonth(), 1);
    const calendarStart = addCalendarDays(monthStart, -monthStart.getDay());
    const todayKey = getTodayDateValue();
    const vacationDays = new Set(draftSchedule.vacationDays);

    if (scheduleMonthLabel) {
      scheduleMonthLabel.textContent = getScheduleMonthLabel(scheduleCalendarDate);
    }

    for (let index = 0; index < 42; index++) {
      const date = addCalendarDays(calendarStart, index);
      const dateKey = getDateKeyFromDate(date);
      const isVacationDay = vacationDays.has(dateKey);

      const dayButton = document.createElement("button");
      dayButton.type = "button";
      dayButton.className = "admin-schedule-day";
      dayButton.classList.toggle("is-outside", date.getMonth() !== visibleMonth);
      dayButton.classList.toggle("is-today", dateKey === todayKey);
      dayButton.classList.toggle("is-vacation", isVacationDay);
      dayButton.setAttribute("aria-pressed", isVacationDay ? "true" : "false");
      dayButton.setAttribute("aria-label", `${date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      })}${isVacationDay ? ", vacation day" : ""}`);

      const dayNumber = document.createElement("span");
      dayNumber.className = "admin-schedule-day-number";
      dayNumber.textContent = String(date.getDate());

      dayButton.appendChild(dayNumber);

      if (isVacationDay) {
        const badge = document.createElement("span");
        badge.className = "admin-schedule-day-badge";
        badge.textContent = "Vacation";
        dayButton.appendChild(badge);
      }

      dayButton.addEventListener("click", () => toggleVacationDay(dateKey));

      scheduleCalendarDays.appendChild(dayButton);
    }
  }

  function renderSchedule() {
    renderScheduleSettings();
    renderScheduleCalendar();
    updateScheduleActionButtons();
  }

  async function loadSchedule() {
    const data = await fetchJson("/.netlify/functions/get-schedule");

    return normalizeScheduleData(data?.schedule);
  }

  async function refreshSchedule(force = false) {
    if (!schedulePanel) {
      return;
    }

    if (scheduleLoaded && !force) {
      renderSchedule();
      return;
    }

    setStatus(scheduleStatus, "Loading schedule...");

    try {
      const schedule = await loadSchedule();

      originalSchedule = cloneSchedule(schedule);
      draftSchedule = cloneSchedule(schedule);
      scheduleLoaded = true;

      renderSchedule();
      setStatus(scheduleStatus, "");
    } catch (err) {
      console.warn("Could not load schedule.", err);

      originalSchedule = cloneSchedule(defaultSchedule);
      draftSchedule = cloneSchedule(defaultSchedule);
      scheduleLoaded = true;

      renderSchedule();
      setStatus(scheduleStatus, err.message || "Could not load schedule.", "error");
    }
  }

  async function saveSchedule() {
    ensureDraftSchedule();

    setStatus(scheduleStatus, "Saving schedule...");

    try {
      if (saveScheduleBtn) saveScheduleBtn.disabled = true;
      if (revertScheduleBtn) revertScheduleBtn.disabled = true;

      const data = await fetchJson("/.netlify/functions/save-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(draftSchedule)
      });

      const savedSchedule = normalizeScheduleData(data?.schedule);

      originalSchedule = cloneSchedule(savedSchedule);
      draftSchedule = cloneSchedule(savedSchedule);
      scheduleLoaded = true;

      renderSchedule();
      setStatus(scheduleStatus, "Schedule saved.", "success");
    } catch (err) {
      console.warn("Could not save schedule.", err);
      setStatus(scheduleStatus, err.message || "Could not save schedule.", "error");
      updateScheduleActionButtons();
    }
  }

  function revertSchedule() {
    draftSchedule = cloneSchedule(originalSchedule || defaultSchedule);
    renderSchedule();
    setStatus(scheduleStatus, "Schedule reverted.", "success");
  }

  function changeScheduleMonth(monthOffset) {
    scheduleCalendarDate = new Date(
      scheduleCalendarDate.getFullYear(),
      scheduleCalendarDate.getMonth() + monthOffset,
      1
    );

    renderScheduleCalendar();
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

  function clonePromoCodes(promoCodes) {
    return promoCodes.map(promoCode => ({ ...promoCode }));
  }

  function normalizePromoCodeValue(value) {
    return normalizeString(value).replace(/\s+/g, "").toUpperCase();
  }

  function normalizeDiscountPercent(value) {
    const discountPercent = Number.parseInt(value, 10);

    return Number.isInteger(discountPercent) && discountPercent > 0 && discountPercent <= 100
      ? discountPercent
      : null;
  }

  function normalizePromoCodesData(data) {
    const hasSavedPromoCodes = data && Array.isArray(data.promoCodes);
    const promoCodes = hasSavedPromoCodes ? data.promoCodes : defaultPromoCodes;
    const promoCodeMap = new Map();

    promoCodes.forEach(promoCode => {
      const code = normalizePromoCodeValue(promoCode.code);
      const discountPercent = normalizeDiscountPercent(promoCode.discountPercent);

      if (!code || !Number.isInteger(discountPercent)) {
        return;
      }

      promoCodeMap.set(code, {
        id: normalizeString(promoCode.id) || `promo-${code.toLowerCase()}`,
        code,
        discountPercent
      });
    });

    return Array.from(promoCodeMap.values());
  }

  function promoCodesToComparableString(promoCodes) {
    return JSON.stringify(
      promoCodes
        .map(promoCode => ({
          id: promoCode.id,
          code: normalizePromoCodeValue(promoCode.code),
          discountPercent: Number.parseInt(promoCode.discountPercent, 10)
        }))
        .sort((a, b) => a.code.localeCompare(b.code))
    );
  }

  function validateDraftPromoCodes() {
    const invalidPromoCode = draftPromoCodes.find(promoCode => {
      const code = normalizePromoCodeValue(promoCode.code);
      const discountPercent = normalizeDiscountPercent(promoCode.discountPercent);

      return !code || !Number.isInteger(discountPercent);
    });

    if (invalidPromoCode) {
      return "Each promo code must have a code and a discount percent from 1 to 100.";
    }

    const codes = draftPromoCodes.map(promoCode => normalizePromoCodeValue(promoCode.code));
    const duplicateCode = codes.find((code, index) => code && codes.indexOf(code) !== index);

    if (duplicateCode) {
      return "Promo codes must be unique.";
    }

    return "";
  }

  function markInvalidPromoCodeInputs() {
    const promoCodeItems = adminPromoCodesGrid?.querySelectorAll(".admin-promo-code-item") || [];
    const codes = draftPromoCodes.map(promoCode => normalizePromoCodeValue(promoCode.code));

    promoCodeItems.forEach(item => {
      const id = item.getAttribute("data-promo-code-id");
      const promoCode = draftPromoCodes.find(currentPromoCode => currentPromoCode.id === id);

      const codeInput = item.querySelector("[data-promo-code-field='code']");
      const discountInput = item.querySelector("[data-promo-code-field='discountPercent']");

      const code = normalizePromoCodeValue(promoCode?.code);
      const discountPercent = normalizeDiscountPercent(promoCode?.discountPercent);
      const isDuplicate = code && codes.filter(currentCode => currentCode === code).length > 1;

      codeInput?.classList.toggle("is-invalid", !code || isDuplicate);
      discountInput?.classList.toggle("is-invalid", !Number.isInteger(discountPercent));
    });
  }

  function updatePromoCodeValue(id, field, value) {
    draftPromoCodes = draftPromoCodes.map(promoCode => {
      if (promoCode.id !== id) {
        return promoCode;
      }

      return {
        ...promoCode,
        [field]: field === "code" ? normalizePromoCodeValue(value) : value
      };
    });

    renderPromoCodesEditor();
    updateActionBar();
    setStatus(promoCodesStatus, "");
  }

  function deletePromoCode(id) {
    if (!confirmDestructiveAction("Are you sure you want to delete this promo code?")) {
      return;
    }

    draftPromoCodes = draftPromoCodes.filter(promoCode => promoCode.id !== id);

    renderPromoCodesEditor();
    updateActionBar();
    setStatus(promoCodesStatus, "");
  }

  function getNextPromoCodeDefaults() {
    let index = draftPromoCodes.length + 1;
    let code = `PROMO${index}`;

    while (draftPromoCodes.some(promoCode => normalizePromoCodeValue(promoCode.code) === code)) {
      index += 1;
      code = `PROMO${index}`;
    }

    return {
      code,
      discountPercent: 10
    };
  }

  function addPromoCode() {
    const defaults = getNextPromoCodeDefaults();

    draftPromoCodes.push({
      id: crypto.randomUUID(),
      code: defaults.code,
      discountPercent: defaults.discountPercent
    });

    renderPromoCodesEditor();
    updateActionBar();
    setStatus(promoCodesStatus, "");
  }

  function createPromoCodeCard(promoCode) {
    const item = document.createElement("div");
    item.className = "admin-promo-code-item";
    item.setAttribute("data-promo-code-id", promoCode.id);

    const codeField = document.createElement("div");
    codeField.className = "admin-promo-code-field";

    const codeLabel = document.createElement("label");
    codeLabel.className = "admin-promo-code-label";
    codeLabel.setAttribute("for", `promo-code-${promoCode.id}`);
    codeLabel.textContent = "Code";

    const codeInput = document.createElement("input");
    codeInput.className = "admin-promo-code-input code-input";
    codeInput.id = `promo-code-${promoCode.id}`;
    codeInput.type = "text";
    codeInput.value = promoCode.code || "";
    codeInput.placeholder = "SHARE15";
    codeInput.setAttribute("data-promo-code-field", "code");
    codeInput.addEventListener("input", () => updatePromoCodeValue(promoCode.id, "code", codeInput.value));

    codeField.append(codeLabel, codeInput);

    const discountField = document.createElement("div");
    discountField.className = "admin-promo-code-field";

    const discountLabel = document.createElement("label");
    discountLabel.className = "admin-promo-code-label";
    discountLabel.setAttribute("for", `promo-discount-${promoCode.id}`);
    discountLabel.textContent = "Discount";

    const discountWrap = document.createElement("div");
    discountWrap.className = "admin-promo-discount-wrap";

    const discountInput = document.createElement("input");
    discountInput.className = "admin-promo-code-input";
    discountInput.id = `promo-discount-${promoCode.id}`;
    discountInput.type = "number";
    discountInput.min = "1";
    discountInput.max = "100";
    discountInput.step = "1";
    discountInput.value = promoCode.discountPercent || "";
    discountInput.setAttribute("data-promo-code-field", "discountPercent");
    discountInput.addEventListener("input", () => updatePromoCodeValue(promoCode.id, "discountPercent", discountInput.value));

    discountWrap.appendChild(discountInput);
    discountField.append(discountLabel, discountWrap);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "admin-delete-promo-code-btn";
    deleteBtn.setAttribute("aria-label", `Delete promo code ${promoCode.code || ""}`);
    deleteBtn.addEventListener("click", () => deletePromoCode(promoCode.id));

    item.append(codeField, discountField, deleteBtn);

    return item;
  }

  function createPromoCodeAddButton() {
    const wrap = document.createElement("div");
    wrap.className = "admin-add-promo-code-wrap";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "admin-add-promo-code-btn";
    button.innerHTML = `<i class="bi bi-plus-lg" aria-hidden="true"></i> Add Promo Code`;
    button.addEventListener("click", addPromoCode);

    wrap.appendChild(button);

    return wrap;
  }

  function renderPromoCodesEditor() {
    if (!adminPromoCodesGrid) return;

    adminPromoCodesGrid.innerHTML = "";

    if (!draftPromoCodes.length) {
      const empty = document.createElement("div");
      empty.className = "admin-request-empty";
      empty.textContent = "No promo codes are currently active.";
      adminPromoCodesGrid.appendChild(empty);
    }

    draftPromoCodes.forEach(promoCode => {
      adminPromoCodesGrid.appendChild(createPromoCodeCard(promoCode));
    });

    adminPromoCodesGrid.appendChild(createPromoCodeAddButton());
    markInvalidPromoCodeInputs();
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

  function normalizeRequestStatus(value) {
    const status = normalizeString(value).toLowerCase();
    const allowedStatuses = ["pending", "accepted", "completed"];

    return allowedStatuses.includes(status) ? status : "pending";
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
    const promoCodesChanged = promoCodesToComparableString(originalPromoCodes) !== promoCodesToComparableString(draftPromoCodes);
    const showcaseChanged = showcaseToComparableString(originalShowcase) !== showcaseToComparableString(draftShowcase);
    const featuredShowcaseChanged = originalFeaturedShowcaseId !== draftFeaturedShowcaseId;
    const aboutBakerChanged = aboutBakerToComparableString(originalAboutBakerParagraphs) !== aboutBakerToComparableString(draftAboutBakerParagraphs);

    return pricingChanged || promoCodesChanged || showcaseChanged || featuredShowcaseChanged || aboutBakerChanged || hasPendingShowcaseImages();
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

  function movePricingCard(id, direction) {
    draftPricing = moveItemsByDirection(draftPricing, id, direction);
    renderPricingEditor();
    updateActionBar();
    setStatus(editorStatus, "");
  }

  function handlePricingDrop(targetId) {
    if (!draggedPricingId || draggedPricingId === targetId) {
      return;
    }

    draftPricing = reorderItemsByDrop(draftPricing, draggedPricingId, targetId);
    draggedPricingId = "";

    renderPricingEditor();
    updateActionBar();
    setStatus(editorStatus, "");
  }

  function deletePricingCard(id) {
    if (!confirmDestructiveAction("Are you sure you want to delete this pricing card?")) {
      return;
    }

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

    itemWrap.addEventListener("dragover", (e) => {
      if (draggedPricingId && draggedPricingId !== item.id) {
        e.preventDefault();

        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = "move";
        }

        itemWrap.classList.add("is-drag-over");
      }
    });

    itemWrap.addEventListener("dragleave", () => {
      itemWrap.classList.remove("is-drag-over");
    });

    itemWrap.addEventListener("drop", (e) => {
      e.preventDefault();
      itemWrap.classList.remove("is-drag-over");
      handlePricingDrop(item.id);
    });

    const card = document.createElement("div");
    card.className = "admin-pricing-card";

    const itemIndex = draftPricing.findIndex(pricingItem => pricingItem.id === item.id);

    const reorderControls = document.createElement("div");
    reorderControls.className = "admin-reorder-controls";

    const dragHandle = document.createElement("button");
    dragHandle.type = "button";
    dragHandle.className = "admin-drag-handle";
    dragHandle.draggable = true;
    dragHandle.setAttribute("aria-label", `Drag set of ${item.quantity} pricing card`);
    dragHandle.innerHTML = `<i class="bi bi-grip-vertical" aria-hidden="true"></i>`;

    dragHandle.addEventListener("dragstart", (e) => {
      draggedPricingId = item.id;
      itemWrap.classList.add("is-dragging");

      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", item.id);
      }
    });

    dragHandle.addEventListener("dragend", () => {
      draggedPricingId = "";
      itemWrap.classList.remove("is-dragging");
    });

    reorderControls.append(
      dragHandle,
      createMoveButton(`Move set of ${item.quantity} left`, "bi bi-chevron-left", () => movePricingCard(item.id, "up"), itemIndex <= 0),
      createMoveButton(`Move set of ${item.quantity} right`, "bi bi-chevron-right", () => movePricingCard(item.id, "down"), itemIndex >= draftPricing.length - 1)
    );

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

    card.append(reorderControls, deleteBtn, quantityField, priceField);
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

  function moveShowcaseCard(id, direction) {
    draftShowcase = moveItemsByDirection(draftShowcase, id, direction);
    renderShowcaseEditor();
    updateActionBar();
    setStatus(showcaseStatus, "");
  }

  function handleShowcaseDrop(targetId) {
    if (!draggedShowcaseId || draggedShowcaseId === targetId) {
      return;
    }

    draftShowcase = reorderItemsByDrop(draftShowcase, draggedShowcaseId, targetId);
    draggedShowcaseId = "";

    renderShowcaseEditor();
    updateActionBar();
    setStatus(showcaseStatus, "");
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
    if (!confirmDestructiveAction("Are you sure you want to delete this showcase card?")) {
      return;
    }

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

    itemWrap.addEventListener("dragover", (e) => {
      if (draggedShowcaseId && draggedShowcaseId !== item.id) {
        e.preventDefault();

        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = "move";
        }

        itemWrap.classList.add("is-drag-over");
      }
    });

    itemWrap.addEventListener("dragleave", () => {
      itemWrap.classList.remove("is-drag-over");
    });

    itemWrap.addEventListener("drop", (e) => {
      e.preventDefault();
      itemWrap.classList.remove("is-drag-over");
      handleShowcaseDrop(item.id);
    });

    const card = document.createElement("div");
    card.className = "admin-showcase-card";

    const itemIndex = draftShowcase.findIndex(showcaseItem => showcaseItem.id === item.id);

    const reorderControls = document.createElement("div");
    reorderControls.className = "admin-reorder-controls";

    const dragHandle = document.createElement("button");
    dragHandle.type = "button";
    dragHandle.className = "admin-drag-handle";
    dragHandle.draggable = true;
    dragHandle.setAttribute("aria-label", `Drag ${item.title || "showcase"} card`);
    dragHandle.innerHTML = `<i class="bi bi-grip-vertical" aria-hidden="true"></i>`;

    dragHandle.addEventListener("dragstart", (e) => {
      draggedShowcaseId = item.id;
      itemWrap.classList.add("is-dragging");

      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", item.id);
      }
    });

    dragHandle.addEventListener("dragend", () => {
      draggedShowcaseId = "";
      itemWrap.classList.remove("is-dragging");
    });

    reorderControls.append(
      dragHandle,
      createMoveButton(`Move ${item.title || "showcase card"} left`, "bi bi-chevron-left", () => moveShowcaseCard(item.id, "up"), itemIndex <= 0),
      createMoveButton(`Move ${item.title || "showcase card"} right`, "bi bi-chevron-right", () => moveShowcaseCard(item.id, "down"), itemIndex >= draftShowcase.length - 1)
    );

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
      reorderControls,
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
      status: normalizeRequestStatus(request?.status),
      name: normalizeString(request?.name),
      email: normalizeString(request?.email),
      phone: normalizeString(request?.phone),
      eventDate: normalizeString(request?.eventDate),
      quantity: Number.parseInt(request?.quantity, 10),
      estimatedPrice: normalizeString(request?.estimatedPrice),
      originalEstimatedPrice: normalizeString(request?.originalEstimatedPrice),
      discountAmount: normalizeString(request?.discountAmount),
      promoCode: normalizeString(request?.promoCode),
      finalPrice: normalizeString(request?.finalPrice),
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

  function parseEstimatedPrice(value) {
    const normalizedValue = normalizeString(value).replace(/[^0-9.]/g, "");
    const parsedValue = Number.parseFloat(normalizedValue);

    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  function formatCurrency(value) {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
  }

  function formatPhoneInput(value) {
    const digits = normalizeString(value).replace(/\D/g, "");
    const normalizedDigits = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits.slice(0, 10);

    if (!normalizedDigits) {
      return "";
    }

    if (normalizedDigits.length <= 3) {
      return `(${normalizedDigits}`;
    }

    if (normalizedDigits.length <= 6) {
      return `(${normalizedDigits.slice(0, 3)}) ${normalizedDigits.slice(3)}`;
    }

    return `(${normalizedDigits.slice(0, 3)}) ${normalizedDigits.slice(3, 6)}-${normalizedDigits.slice(6)}`;
  }

  function formatPriceInput(value) {
    const rawValue = normalizeString(value).replace(/[^0-9.]/g, "");

    if (!rawValue) {
      return "";
    }

    const hasDecimal = rawValue.includes(".");
    const parts = rawValue.split(".");
    const dollars = parts[0].replace(/^0+(?=\d)/, "") || "0";
    const cents = parts.slice(1).join("").slice(0, 2);

    return hasDecimal ? `$${dollars}.${cents}` : `$${dollars}`;
  }

  function formatPriceForModal(value) {
    const rawValue = normalizeString(value);

    if (!rawValue) {
      return "";
    }

    const priceValue = parseEstimatedPrice(rawValue);

    if (!Number.isFinite(priceValue)) {
      return "";
    }

    return formatCurrency(priceValue);
  }

  function attachEditRequestInputFormatting() {
    const phoneInput = document.getElementById("editRequestPhone");
    const estimatedPriceInput = document.getElementById("editRequestEstimatedPrice");
    const finalPriceInput = document.getElementById("editRequestFinalPrice");
    const priceInputs = [
      estimatedPriceInput,
      finalPriceInput
    ].filter(Boolean);

    phoneInput?.addEventListener("input", () => {
      phoneInput.value = formatPhoneInput(phoneInput.value);
    });

    priceInputs.forEach(input => {
      input.addEventListener("input", () => {
        input.value = formatPriceInput(input.value);
      });

      input.addEventListener("blur", () => {
        input.value = formatPriceForModal(input.value);
      });
    });
  }

  function promptForFinalPrice(request) {
    const defaultValue = request.finalPrice || request.estimatedPrice || "";
    const enteredValue = window.prompt("Enter the final price for this completed order:", defaultValue);

    if (enteredValue === null) {
      return "";
    }

    const finalPriceValue = parseEstimatedPrice(enteredValue);

    if (!Number.isFinite(finalPriceValue) || finalPriceValue <= 0) {
      window.alert("Please enter a valid final price greater than $0.");
      return promptForFinalPrice(request);
    }

    return formatCurrency(finalPriceValue);
  }

  function updateTotalEarned(pastRequests) {
    if (!totalEarned) return;

    const valueEl = totalEarned.querySelector(".admin-total-earned-value");

    if (!valueEl) return;

    const total = pastRequests.reduce((sum, request) =>
      sum + parseEstimatedPrice(request.finalPrice), 0
    );

    valueEl.textContent = formatCurrency(total);
  }

  function getRequestPriceLabel(request) {
    return request.status === "completed" ? "Final Price" : "Estimated Price";
  }

  function getRequestDisplayPrice(request) {
    return request.status === "completed" ? request.finalPrice || "$0.00" : request.estimatedPrice;
  }

  function ensureEditRequestModal() {
    if (editRequestModal && editRequestForm) {
      return;
    }

    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "editRequestModal";
    modal.tabIndex = -1;
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content admin-edit-request-modal">
        <div class="modal-header">
          <div>
            <p class="admin-eyebrow mb-1">Edit Request</p>
            <h2 class="modal-title h5 fw-semibold mb-0">Update Cookie Request</h2>
          </div>
          <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <form id="editRequestForm" novalidate>
          <div class="modal-body">
            <input type="hidden" id="editRequestId" name="id" />

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label" for="editRequestName">Name</label>
                <input class="form-control" id="editRequestName" name="name" type="text" required />
                <div class="invalid-feedback">Name is required.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label" for="editRequestEmail">Email</label>
                <input class="form-control" id="editRequestEmail" name="email" type="email" required />
                <div class="invalid-feedback">A valid email is required.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label" for="editRequestPhone">Phone</label>
                <input class="form-control" id="editRequestPhone" name="phone" type="tel" />
              </div>

              <div class="col-md-6">
                <label class="form-label" for="editRequestEventDate">Event Date</label>
                <input class="form-control" id="editRequestEventDate" name="eventDate" type="date" required />
                <div class="invalid-feedback">Event date is required.</div>
              </div>

              <div class="col-md-4">
                <label class="form-label" for="editRequestQuantity">Quantity</label>
                <input class="form-control" id="editRequestQuantity" name="quantity" type="number" min="1" step="1" required />
                <div class="invalid-feedback">Quantity is required.</div>
              </div>

              <div class="col-md-4" id="editRequestEstimatedPriceWrap">
                <label class="form-label" for="editRequestEstimatedPrice">Estimated Price</label>
                <input class="form-control" id="editRequestEstimatedPrice" name="estimatedPrice" type="text" placeholder="$0.00" />
              </div>

              <div class="col-md-4" id="editRequestFinalPriceWrap">
                <label class="form-label" for="editRequestFinalPrice">Final Price</label>
                <input class="form-control" id="editRequestFinalPrice" name="finalPrice" type="text" placeholder="$0.00" />
                <div class="invalid-feedback">Final price is required.</div>
              </div>

              <div class="col-12">
                <label class="form-label" for="editRequestTheme">Theme</label>
                <input class="form-control" id="editRequestTheme" name="theme" type="text" required />
                <div class="invalid-feedback">Theme is required.</div>
              </div>

              <div class="col-12">
                <label class="form-label" for="editRequestInspo">Inspiration Link</label>
                <input class="form-control" id="editRequestInspo" name="inspo" type="url" />
              </div>

              <div class="col-12">
                <label class="form-label" for="editRequestDetails">Details</label>
                <textarea class="form-control" id="editRequestDetails" name="details" rows="5" required></textarea>
                <div class="invalid-feedback">Details are required.</div>
              </div>
            </div>

            <div class="admin-status mt-3" id="editRequestStatus" role="status" aria-live="polite"></div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline-dark" type="button" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary" id="saveRequestEditsBtn" type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;

    document.body.appendChild(modal);

    editRequestModal = new bootstrap.Modal(modal);
    editRequestForm = document.getElementById("editRequestForm");
    editRequestStatus = document.getElementById("editRequestStatus");

    editRequestForm.addEventListener("submit", saveRequestEdits);
    attachEditRequestInputFormatting();
  }

  function setEditRequestValue(fieldName, value) {
    const field = editRequestForm?.querySelector(`[name="${fieldName}"]`);

    if (field) {
      field.value = value || "";
    }
  }

  function openEditRequestModal(request) {
    ensureEditRequestModal();

    activeEditRequest = request;
    editRequestForm.classList.remove("was-validated");
    setStatus(editRequestStatus, "");

    setEditRequestValue("id", request.id);
    setEditRequestValue("name", request.name);
    setEditRequestValue("email", request.email);
    setEditRequestValue("phone", formatPhoneInput(request.phone));
    setEditRequestValue("eventDate", request.eventDate);
    setEditRequestValue("quantity", Number.isInteger(request.quantity) ? String(request.quantity) : "");
    setEditRequestValue("estimatedPrice", formatPriceForModal(request.estimatedPrice));
    setEditRequestValue("finalPrice", formatPriceForModal(request.finalPrice));
    setEditRequestValue("theme", request.theme);
    setEditRequestValue("inspo", request.inspo);
    setEditRequestValue("details", request.details);

    const estimatedPriceWrap = document.getElementById("editRequestEstimatedPriceWrap");
    const finalPriceWrap = document.getElementById("editRequestFinalPriceWrap");
    const estimatedPriceInput = document.getElementById("editRequestEstimatedPrice");
    const finalPriceInput = document.getElementById("editRequestFinalPrice");
    const isCompletedRequest = request.status === "completed";

    if (estimatedPriceWrap) {
      estimatedPriceWrap.hidden = isCompletedRequest;
    }

    if (finalPriceWrap) {
      finalPriceWrap.hidden = !isCompletedRequest;
    }

    if (estimatedPriceInput) {
      estimatedPriceInput.required = !isCompletedRequest;
      estimatedPriceInput.disabled = isCompletedRequest;
    }

    if (finalPriceInput) {
      finalPriceInput.required = isCompletedRequest;
      finalPriceInput.disabled = !isCompletedRequest;
    }

    editRequestModal.show();
  }

  function buildRequestEditPayload() {
    const values = Object.fromEntries(new FormData(editRequestForm).entries());
    const isCompletedRequest = activeEditRequest?.status === "completed";

    return {
      id: normalizeString(values.id),
      name: normalizeString(values.name),
      email: normalizeString(values.email),
      phone: formatPhoneInput(values.phone),
      eventDate: normalizeString(values.eventDate),
      quantity: normalizeString(values.quantity),
      estimatedPrice: isCompletedRequest ? normalizeString(activeEditRequest?.estimatedPrice) : formatPriceForModal(values.estimatedPrice),
      finalPrice: isCompletedRequest ? formatPriceForModal(values.finalPrice) : normalizeString(activeEditRequest?.finalPrice),
      theme: normalizeString(values.theme),
      inspo: normalizeString(values.inspo),
      details: normalizeString(values.details)
    };
  }

  async function saveRequestEdits(e) {
    e.preventDefault();

    if (!editRequestForm.checkValidity()) {
      editRequestForm.classList.add("was-validated");
      setStatus(editRequestStatus, "Please fix the highlighted fields.", "error");
      return;
    }

    const saveBtn = document.getElementById("saveRequestEditsBtn");
    const payload = buildRequestEditPayload();

    try {
      if (saveBtn) saveBtn.disabled = true;

      setStatus(editRequestStatus, "Saving request...");

      await fetchJson("/.netlify/functions/update-cookie-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      editRequestModal.hide();
      activeEditRequest = null;

      await refreshCookieRequests();
    } catch (err) {
      console.warn("Could not save request edits.", err);
      setStatus(editRequestStatus, err.message || "Could not save request edits.", "error");
    } finally {
      if (saveBtn) saveBtn.disabled = false;
    }
  }

  function formatAnalyticsNumber(value) {
    const numberValue = Number.parseInt(value, 10);

    if (!Number.isInteger(numberValue)) {
      return "0";
    }

    return numberValue.toLocaleString("en-US");
  }

  function formatAnalyticsPercent(value) {
    const numberValue = Number.parseFloat(value);

    if (!Number.isFinite(numberValue)) {
      return "0%";
    }

    return `${numberValue.toLocaleString("en-US", {
      maximumFractionDigits: 1
    })}%`;
  }

  function formatAnalyticsDateTime(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function formatCategoryLabel(value) {
    const normalizedValue = normalizeString(value).toLowerCase();

    const labels = {
      all: "All",
      floral: "Floral",
      kids: "Kids",
      lux: "Luxe",
      minimal: "Minimal"
    };

    return labels[normalizedValue] || value || "—";
  }

  function getAnalyticsDays() {
    const days = Number.parseInt(analyticsRange?.value, 10);

    return Number.isInteger(days) && days > 0 ? days : 30;
  }

  function setAnalyticsText(el, value) {
    if (!el) return;
    el.textContent = value;
  }

  function createAnalyticsEmpty(message) {
    const empty = document.createElement("div");
    empty.className = "admin-analytics-empty";
    empty.textContent = message;

    return empty;
  }

  function renderAnalyticsBarList(container, items, emptyMessage, labelFormatter = value => value) {
    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(items) || !items.length) {
      container.appendChild(createAnalyticsEmpty(emptyMessage));
      return;
    }

    const maxCount = Math.max(...items.map(item => Number.parseInt(item.count, 10) || 0), 1);

    items.forEach(item => {
      const count = Number.parseInt(item.count, 10) || 0;
      const percent = Math.max(4, Math.round((count / maxCount) * 100));

      const row = document.createElement("div");
      row.className = "admin-analytics-list-row";

      const top = document.createElement("div");
      top.className = "admin-analytics-list-row-top";

      const label = document.createElement("div");
      label.className = "admin-analytics-list-label";
      label.textContent = labelFormatter(item.label);

      const value = document.createElement("div");
      value.className = "admin-analytics-list-value";
      value.textContent = formatAnalyticsNumber(count);

      const barWrap = document.createElement("div");
      barWrap.className = "admin-analytics-bar-wrap";

      const bar = document.createElement("div");
      bar.className = "admin-analytics-bar";
      bar.style.width = `${percent}%`;

      top.append(label, value);
      barWrap.appendChild(bar);
      row.append(top, barWrap);
      container.appendChild(row);
    });
  }

  function getActivityDescription(activity) {
    const metadata = activity?.metadata || {};

    if (activity.type === "page_view") {
      return activity.path || "/";
    }

    if (activity.type === "showcase_filter") {
      return `Filtered by ${formatCategoryLabel(metadata.filter)}`;
    }

    if (activity.type === "showcase_lightbox") {
      return `Opened ${metadata.title || "showcase image"}`;
    }

    if (activity.type === "featured_lightbox") {
      return `Opened featured image: ${metadata.title || "Featured Set"}`;
    }

    if (activity.type === "gallery_page") {
      return `Page ${metadata.page || "—"} • ${formatCategoryLabel(metadata.filter)}`;
    }

    if (activity.type === "request_form_start") {
      return "Started filling out the request form";
    }

    if (activity.type === "request_submit") {
      const quantity = metadata.quantity ? `Quantity ${metadata.quantity}` : "";
      const estimatedPrice = metadata.estimatedPrice ? `${metadata.estimatedPrice}` : "";

      return [quantity, estimatedPrice].filter(Boolean).join(" • ") || "Submitted request form";
    }

    return activity.path || "";
  }

  function renderAnalyticsRecentActivity(activityItems) {
    if (!analyticsRecentActivity) return;

    analyticsRecentActivity.innerHTML = "";

    if (!Array.isArray(activityItems) || !activityItems.length) {
      analyticsRecentActivity.appendChild(createAnalyticsEmpty("No recent activity yet."));
      return;
    }

    activityItems.forEach(activity => {
      const row = document.createElement("div");
      row.className = "admin-analytics-activity-row";

      const icon = document.createElement("div");
      icon.className = "admin-analytics-activity-icon";

      if (activity.type === "request_submit") {
        icon.innerHTML = `<i class="bi bi-envelope-check"></i>`;
      } else if (activity.type === "showcase_lightbox" || activity.type === "featured_lightbox") {
        icon.innerHTML = `<i class="bi bi-image"></i>`;
      } else if (activity.type === "showcase_filter") {
        icon.innerHTML = `<i class="bi bi-funnel"></i>`;
      } else {
        icon.innerHTML = `<i class="bi bi-activity"></i>`;
      }

      const body = document.createElement("div");
      body.className = "admin-analytics-activity-body";

      const label = document.createElement("div");
      label.className = "admin-analytics-activity-label";
      label.textContent = activity.label || activity.type || "Activity";

      const description = document.createElement("div");
      description.className = "admin-analytics-activity-description";
      description.textContent = getActivityDescription(activity);

      const time = document.createElement("div");
      time.className = "admin-analytics-activity-time";
      time.textContent = formatAnalyticsDateTime(activity.createdAt);

      body.append(label, description, time);
      row.append(icon, body);
      analyticsRecentActivity.appendChild(row);
    });
  }

  function renderAnalyticsFunnel(funnel) {
    const pageViews = Number.parseInt(funnel?.pageViews, 10) || 0;
    const formStarts = Number.parseInt(funnel?.formStarts, 10) || 0;
    const requestSubmissions = Number.parseInt(funnel?.requestSubmissions, 10) || 0;

    renderAnalyticsBarList(analyticsFunnel, [
      {
        label: "Page Views",
        count: pageViews
      },
      {
        label: "Form Starts",
        count: formStarts
      },
      {
        label: "Requests",
        count: requestSubmissions
      }
    ], "No funnel data yet.");
  }

  function renderAnalytics(analytics) {
    const totals = analytics?.totals || {};

    setAnalyticsText(analyticsVisitors, formatAnalyticsNumber(totals.visitors));
    setAnalyticsText(analyticsPageViews, formatAnalyticsNumber(totals.pageViews));
    setAnalyticsText(analyticsRequests, formatAnalyticsNumber(totals.requestSubmissions));
    setAnalyticsText(analyticsConversionRate, formatAnalyticsPercent(totals.requestConversionRate));
    setAnalyticsText(analyticsFormStarts, formatAnalyticsNumber(totals.formStarts));
    setAnalyticsText(analyticsShowcaseOpens, formatAnalyticsNumber(totals.showcaseImageOpens));
    setAnalyticsText(analyticsTopCategory, totals.mostPopularCategory ? formatCategoryLabel(totals.mostPopularCategory) : "—");
    setAnalyticsText(analyticsEventsCount, formatAnalyticsNumber(analytics?.eventCount));

    if (analyticsGeneratedAt) {
      const generatedAt = formatAnalyticsDateTime(analytics?.generatedAt);
      analyticsGeneratedAt.textContent = generatedAt
        ? `Showing the last ${analytics?.days || getAnalyticsDays()} days • Updated ${generatedAt}`
        : "Analytics will appear after the public site starts collecting events.";
    }

    renderAnalyticsFunnel(analytics?.funnel);
    renderAnalyticsBarList(analyticsCategories, analytics?.popularCategories, "No category activity yet.", formatCategoryLabel);
    renderAnalyticsBarList(analyticsShowcaseImages, analytics?.popularShowcaseImages, "No image activity yet.");
    renderAnalyticsRecentActivity(analytics?.recentActivity);
  }

  async function refreshAnalytics() {
    if (!analyticsPanel) return;

    const days = getAnalyticsDays();

    setStatus(analyticsStatus, "Loading analytics...");

    try {
      if (refreshAnalyticsBtn) refreshAnalyticsBtn.disabled = true;

      const data = await fetchJson(`/.netlify/functions/get-analytics?days=${encodeURIComponent(days)}`);
      renderAnalytics(data.analytics || {});
      analyticsLoaded = true;
      setStatus(analyticsStatus, "");
    } catch (err) {
      console.warn("Could not load analytics.", err);
      setStatus(analyticsStatus, err.message || "Could not load analytics.", "error");
    } finally {
      if (refreshAnalyticsBtn) refreshAnalyticsBtn.disabled = false;
    }
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

  function createRequestActions(request) {
    const actions = document.createElement("div");
    actions.className = "admin-request-actions";

    if (request.status === "accepted" || request.status === "completed") {
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn btn-primary admin-request-action-btn";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => openEditRequestModal(request));

      actions.appendChild(editBtn);
    }

    if (request.status === "pending") {
      const acceptBtn = document.createElement("button");
      acceptBtn.type = "button";
      acceptBtn.className = "btn btn-success admin-request-action-btn";
      acceptBtn.textContent = "Accept";
      acceptBtn.addEventListener("click", () => updateCookieRequestStatus(request.id, "accepted"));

      const rejectBtn = document.createElement("button");
      rejectBtn.type = "button";
      rejectBtn.className = "btn btn-danger admin-request-action-btn";
      rejectBtn.textContent = "Reject";
      rejectBtn.addEventListener("click", () => deleteCookieRequest(request.id, "reject"));

      actions.append(acceptBtn, rejectBtn);
    }

    if (request.status === "accepted") {
      const completeBtn = document.createElement("button");
      completeBtn.type = "button";
      completeBtn.className = "btn btn-success admin-request-action-btn";
      completeBtn.textContent = "Complete";
      completeBtn.addEventListener("click", () => {
        const finalPrice = promptForFinalPrice(request);

        if (!finalPrice) {
          return;
        }

        updateCookieRequestStatus(request.id, "completed", {
          finalPrice
        });
      });

      actions.appendChild(completeBtn);
    }

    if (request.status === "completed") {
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn btn-danger admin-request-action-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteCookieRequest(request.id, "delete"));

      actions.appendChild(deleteBtn);
    }

    return actions;
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
    date.textContent = request.status === "accepted"
      ? `Due ${formatDateValue(request.eventDate)}`
      : formatDateValue(request.eventDate);

    header.append(titleWrap, date);

    const details = document.createElement("div");
    details.className = "admin-request-details";

    details.append(
      createRequestDetail("Email", request.email),
      createRequestDetail("Phone", request.phone),
      createRequestDetail("Quantity", Number.isInteger(request.quantity) ? String(request.quantity) : ""),
      createRequestDetail(getRequestPriceLabel(request), getRequestDisplayPrice(request))
    );

    if (request.promoCode) {
      details.append(
        createRequestDetail("Promo Code", `${request.promoCode}${request.discountAmount ? ` • ${request.discountAmount} off` : ""}`)
      );
    }

    details.append(
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

    const actions = createRequestActions(request);

    if (actions.children.length) {
      card.appendChild(actions);
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
    const pendingRequests = cookieRequests
      .filter(request => request.status === "pending")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const upcomingRequests = cookieRequests
      .filter(request => request.status === "accepted")
      .sort((a, b) => {
        const dateSort = a.eventDate.localeCompare(b.eventDate);

        if (dateSort !== 0) {
          return dateSort;
        }

        return b.createdAt.localeCompare(a.createdAt);
      });

    const pastRequests = cookieRequests
      .filter(request => request.status === "completed")
      .sort((a, b) => {
        const dateSort = b.eventDate.localeCompare(a.eventDate);

        if (dateSort !== 0) {
          return dateSort;
        }

        return b.createdAt.localeCompare(a.createdAt);
      });

    updateTotalEarned(pastRequests);

    renderRequestGrid(pendingRequestsGrid, pendingRequests, "No pending cookie requests yet.");
    renderRequestGrid(upcomingRequestsGrid, upcomingRequests, "No upcoming cookie requests yet.");
    renderRequestGrid(pastRequestsGrid, pastRequests, "No completed cookie requests yet.");
  }

  async function loadCookieRequests() {
    const data = await fetchJson("/.netlify/functions/get-cookie-requests");
    const requests = Array.isArray(data?.requests) ? data.requests : [];

    return requests
      .map(normalizeCookieRequest)
      .filter(request =>
        request.id &&
        request.createdAt &&
        request.status &&
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

  async function updateCookieRequestStatus(id, status, extraValues = {}) {
    setStatus(cookieRequestsStatus, "Updating request...");

    try {
      await fetchJson("/.netlify/functions/update-cookie-request-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          status,
          ...extraValues
        })
      });

      await refreshCookieRequests();
    } catch (err) {
      console.warn("Could not update cookie request.", err);
      setStatus(cookieRequestsStatus, err.message || "Could not update cookie request.", "error");
    }
  }

  async function deleteCookieRequest(id, action = "delete") {
    const message = action === "reject"
      ? "Are you sure you want to reject this request? This will permanently delete it from the dashboard."
      : "Are you sure you want to delete this request? This cannot be undone.";

    if (!confirmDestructiveAction(message)) {
      return;
    }

    setStatus(cookieRequestsStatus, "Deleting request...");

    try {
      await fetchJson("/.netlify/functions/delete-cookie-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id
        })
      });

      await refreshCookieRequests();
    } catch (err) {
      console.warn("Could not delete cookie request.", err);
      setStatus(cookieRequestsStatus, err.message || "Could not delete cookie request.", "error");
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

  async function loadPromoCodes() {
    try {
      const data = await fetchJson("/.netlify/functions/get-promo-codes");
      return normalizePromoCodesData(data);
    } catch (err) {
      console.warn("Could not load promo codes from function.", err);
    }

    return clonePromoCodes(defaultPromoCodes);
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
    setStatus(promoCodesStatus, "Loading promo codes...");
    setStatus(aboutBakerStatus, "Loading About the Baker...");

    const [pricing, promoCodes, showcaseData, aboutBakerParagraphs] = await Promise.all([
      loadPricing(),
      loadPromoCodes(),
      loadShowcase(),
      loadAboutBaker()
    ]);

    originalPricing = clonePricing(pricing);
    draftPricing = clonePricing(pricing);

    originalPromoCodes = clonePromoCodes(promoCodes);
    draftPromoCodes = clonePromoCodes(promoCodes);

    originalShowcase = cloneShowcase(showcaseData.showcase);
    draftShowcase = cloneShowcase(showcaseData.showcase);
    originalFeaturedShowcaseId = showcaseData.featuredShowcaseId;
    draftFeaturedShowcaseId = showcaseData.featuredShowcaseId;
    pendingShowcaseImages = {};

    originalAboutBakerParagraphs = cloneAboutBakerParagraphs(aboutBakerParagraphs);
    draftAboutBakerParagraphs = cloneAboutBakerParagraphs(aboutBakerParagraphs);

    renderPricingEditor();
    renderShowcaseEditor();
    renderPromoCodesEditor();
    renderAboutBakerEditor();
    updateActionBar();

    setStatus(editorStatus, "");
    setStatus(showcaseStatus, "");
    setStatus(promoCodesStatus, "");
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
    originalPromoCodes = [];
    draftPromoCodes = [];
    originalShowcase = [];
    draftShowcase = [];
    originalFeaturedShowcaseId = "";
    draftFeaturedShowcaseId = "";
    pendingShowcaseImages = {};
    originalAboutBakerParagraphs = [];
    draftAboutBakerParagraphs = [];
    cookieRequests = [];
    originalSchedule = null;
    draftSchedule = null;
    scheduleLoaded = false;
    activeEditRequest = null;
    renderCookieRequests();
    setStatus(scheduleStatus, "");
    setStatus(cookieRequestsStatus, "");
    showLoginView();
  });

  revertChangesBtn?.addEventListener("click", () => {
    Object.keys(pendingShowcaseImages).forEach(id => {
      revokePendingShowcaseImageUrl(id);
    });

    draftPricing = clonePricing(originalPricing);
    draftPromoCodes = clonePromoCodes(originalPromoCodes);
    draftShowcase = cloneShowcase(originalShowcase);
    draftFeaturedShowcaseId = originalFeaturedShowcaseId;
    pendingShowcaseImages = {};
    draftAboutBakerParagraphs = cloneAboutBakerParagraphs(originalAboutBakerParagraphs);

    renderPricingEditor();
    renderShowcaseEditor();
    renderPromoCodesEditor();
    renderAboutBakerEditor();
    updateActionBar();

    setStatus(editorStatus, "Changes reverted.", "success");
    setStatus(showcaseStatus, "Changes reverted.", "success");
    setStatus(promoCodesStatus, "Changes reverted.", "success");
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
    markInvalidPromoCodeInputs();
    markInvalidAboutBakerInputs();

    const pricingValidationMessage = validateDraftPricing();

    if (pricingValidationMessage) {
      setStatus(editorStatus, pricingValidationMessage, "error");
      return;
    }

    const promoCodesValidationMessage = validateDraftPromoCodes();

    if (promoCodesValidationMessage) {
      setStatus(promoCodesStatus, promoCodesValidationMessage, "error");
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

    const promoCodesToSave = draftPromoCodes.map(promoCode => ({
      id: promoCode.id,
      code: normalizePromoCodeValue(promoCode.code),
      discountPercent: Number.parseInt(promoCode.discountPercent, 10)
    }));

    const aboutBakerToSave = draftAboutBakerParagraphs.map(paragraph => normalizeString(paragraph));

    try {
      if (saveChangesBtn) saveChangesBtn.disabled = true;
      if (revertChangesBtn) revertChangesBtn.disabled = true;

      setStatus(editorStatus, "Saving pricing...");
      setStatus(showcaseStatus, "Uploading images and saving showcase...");
      setStatus(promoCodesStatus, "Saving promo codes...");
      setStatus(aboutBakerStatus, "Saving About the Baker...");

      const showcaseToSave = await buildShowcaseForSave();

      const [pricingData, promoCodesData, showcaseData, aboutBakerData] = await Promise.all([
        fetchJson("/.netlify/functions/save-pricing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            pricing: pricingToSave
          })
        }),
        fetchJson("/.netlify/functions/save-promo-codes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            promoCodes: promoCodesToSave
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
      const savedPromoCodes = normalizePromoCodesData(promoCodesData);
      const savedShowcaseData = normalizeShowcaseData(showcaseData);
      const savedAboutBakerParagraphs = normalizeAboutBakerData(aboutBakerData);

      clearPendingShowcaseImages();

      originalPricing = clonePricing(savedPricing);
      draftPricing = clonePricing(savedPricing);

      originalPromoCodes = clonePromoCodes(savedPromoCodes);
      draftPromoCodes = clonePromoCodes(savedPromoCodes);

      originalShowcase = cloneShowcase(savedShowcaseData.showcase);
      draftShowcase = cloneShowcase(savedShowcaseData.showcase);
      originalFeaturedShowcaseId = savedShowcaseData.featuredShowcaseId;
      draftFeaturedShowcaseId = savedShowcaseData.featuredShowcaseId;

      originalAboutBakerParagraphs = cloneAboutBakerParagraphs(savedAboutBakerParagraphs);
      draftAboutBakerParagraphs = cloneAboutBakerParagraphs(savedAboutBakerParagraphs);

      renderPricingEditor();
      renderShowcaseEditor();
      renderPromoCodesEditor();
      renderAboutBakerEditor();
      updateActionBar();

      setStatus(editorStatus, "Pricing saved.", "success");
      setStatus(showcaseStatus, "Showcase saved. The live site will now use these cards.", "success");
      setStatus(promoCodesStatus, "Promo codes saved.", "success");
      setStatus(aboutBakerStatus, "About the Baker saved.", "success");
    } catch (err) {
      setStatus(showcaseStatus, err.message || "Could not save changes.", "error");
      setStatus(promoCodesStatus, err.message || "Could not save changes.", "error");
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

      if (tabName === "schedule") {
        refreshSchedule();
      }

      if (tabName === "analytics") {
        refreshAnalytics();
      }
    });
  });

  refreshAnalyticsBtn?.addEventListener("click", refreshAnalytics);

  analyticsRange?.addEventListener("change", () => {
    if (analyticsPanel && !analyticsPanel.hidden) {
      refreshAnalytics();
    } else {
      analyticsLoaded = false;
    }
  });

  noticePeriodDaysInput?.addEventListener("input", () => {
    updateDraftScheduleNumber("noticePeriodDays", noticePeriodDaysInput.value);
  });

  weeklyCapacityCookiesInput?.addEventListener("input", () => {
    updateDraftScheduleNumber("weeklyCapacityCookies", weeklyCapacityCookiesInput.value);
  });

  prevScheduleMonthBtn?.addEventListener("click", () => {
    changeScheduleMonth(-1);
  });

  nextScheduleMonthBtn?.addEventListener("click", () => {
    changeScheduleMonth(1);
  });

  saveScheduleBtn?.addEventListener("click", saveSchedule);
  revertScheduleBtn?.addEventListener("click", revertSchedule);

  checkSession();
})();
