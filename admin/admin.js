(() => {
  const loginView = document.getElementById("loginView");
  const editorView = document.getElementById("editorView");
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const loginStatus = document.getElementById("loginStatus");
  const adminUser = document.getElementById("adminUser");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminPricingGrid = document.getElementById("adminPricingGrid");
  const editorStatus = document.getElementById("editorStatus");
  const adminActions = document.getElementById("adminActions");
  const revertChangesBtn = document.getElementById("revertChangesBtn");
  const saveChangesBtn = document.getElementById("saveChangesBtn");

  const defaultPricing = [
    { id: "set-6", quantity: 6, price: 18 },
    { id: "set-12", quantity: 12, price: 33 },
    { id: "set-24", quantity: 24, price: 60 },
    { id: "set-48", quantity: 48, price: 108 },
    { id: "set-96", quantity: 96, price: 192 }
  ];

  let originalPricing = [];
  let draftPricing = [];

  function clonePricing(pricing) {
    return pricing.map(item => ({ ...item }));
  }

  function setStatus(el, message, type = "") {
    if (!el) return;

    el.textContent = message;
    el.classList.toggle("is-error", type === "error");
    el.classList.toggle("is-success", type === "success");
  }

  function showLoginView() {
    if (loginView) loginView.hidden = false;
    if (editorView) editorView.hidden = true;
    setStatus(loginStatus, "");
    setStatus(editorStatus, "");
  }

  function showEditorView(username = "") {
    if (loginView) loginView.hidden = true;
    if (editorView) editorView.hidden = false;
    if (adminUser) adminUser.textContent = username ? `Signed in as ${username}` : "";
    setStatus(loginStatus, "");
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

  function pricingToComparableString(pricing) {
    return JSON.stringify(
      pricing.map(item => ({
        id: item.id,
        quantity: Number.parseInt(item.quantity, 10),
        price: Number.parseInt(item.price, 10)
      }))
    );
  }

  function hasUnsavedChanges() {
    return pricingToComparableString(originalPricing) !== pricingToComparableString(draftPricing);
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

  async function initializeEditor(username = "") {
    showEditorView(username);
    setStatus(editorStatus, "Loading pricing...");

    const pricing = await loadPricing();

    originalPricing = clonePricing(pricing);
    draftPricing = clonePricing(pricing);

    renderPricingEditor();
    updateActionBar();
    setStatus(editorStatus, "");
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
    showLoginView();
  });

  revertChangesBtn?.addEventListener("click", () => {
    draftPricing = clonePricing(originalPricing);
    renderPricingEditor();
    updateActionBar();
    setStatus(editorStatus, "Changes reverted.", "success");
  });

  saveChangesBtn?.addEventListener("click", async () => {
    markInvalidInputs();

    const validationMessage = validateDraftPricing();

    if (validationMessage) {
      setStatus(editorStatus, validationMessage, "error");
      return;
    }

    const pricingToSave = draftPricing.map(item => ({
      id: item.id,
      quantity: Number.parseInt(item.quantity, 10),
      price: Number.parseInt(item.price, 10)
    }));

    try {
      if (saveChangesBtn) saveChangesBtn.disabled = true;
      if (revertChangesBtn) revertChangesBtn.disabled = true;

      setStatus(editorStatus, "Saving changes...");

      const data = await fetchJson("/.netlify/functions/save-pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pricing: pricingToSave
        })
      });

      const savedPricing = normalizePricingData(data);

      originalPricing = clonePricing(savedPricing);
      draftPricing = clonePricing(savedPricing);

      renderPricingEditor();
      updateActionBar();
      setStatus(editorStatus, "Changes saved. The live site will now use this pricing.", "success");
    } catch (err) {
      setStatus(editorStatus, err.message || "Could not save changes.", "error");
    } finally {
      if (saveChangesBtn) saveChangesBtn.disabled = false;
      if (revertChangesBtn) revertChangesBtn.disabled = false;
    }
  });

  checkSession();
})();
