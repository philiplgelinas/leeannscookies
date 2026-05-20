(() => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Showcase filtering
  const filterButtons = document.querySelectorAll("[data-filter]");
  const items = document.querySelectorAll(".showcase-item");

  function setActiveButton(activeBtn) {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  }

  function filterShowcase(tag) {
    items.forEach(item => {
      const tags = (item.getAttribute("data-tags") || "").split(" ").filter(Boolean);
      const show = tag === "all" ? true : tags.includes(tag);
      item.hidden = !show;
    });
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

  // Showcase image lightbox
  const showcaseCards = document.querySelectorAll(".showcase-card");
  const lightbox = document.getElementById("imageLightbox");
  const lightboxImg = document.getElementById("imageLightboxImg");
  const lightboxCaption = document.getElementById("imageLightboxCaption");
  const lightboxClose = document.getElementById("imageLightboxClose");

  function openLightbox(card) {
    if (!lightbox || !lightboxImg) return;

    const img = card.querySelector("img");
    const title = card.querySelector(".fw-semibold")?.textContent?.trim() || img?.alt || "Cookie image";

    if (!img) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || title;
    if (lightboxCaption) lightboxCaption.textContent = title;

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
    if (lightboxCaption) lightboxCaption.textContent = "";
  }

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

  lightboxClose?.addEventListener("click", closeLightbox);

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
    // EmailJS init (v4 style) :contentReference[oaicite:2]{index=2}
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

    // Bootstrap validation
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

      // Preferred: EmailJS sendForm collects fields by their `name` attributes :contentReference[oaicite:3]{index=3}
      if (sendViaEmailJS) {
        initEmailJSOnce();

        // Send the form values through EmailJS
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

      // Fallback: open email client
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
