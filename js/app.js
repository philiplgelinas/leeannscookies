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

  const destinationEmail = "leeannscookiesnj@gmail.com";

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

  function buildMailto(formData) {
    const subject = `Cookie Request - ${formData.name} (${formData.eventDate})`;
    const bodyLines = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Event Date: ${formData.eventDate}`,
      `Quantity: ${formData.quantity}`,
      `Theme/Occasion: ${formData.theme}`,
      `Inspiration Link: ${formData.inspo || "(none)"}`,
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

  // Mailto button always available
  if (mailtoBtn) {
    mailtoBtn.addEventListener("click", () => {
      if (!form) return;
      const values = Object.fromEntries(new FormData(form).entries());
      window.location.href = buildMailto(values);
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");

    // Bootstrap validation
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      setStatus("Please fix the highlighted fields.", true);
      return;
    }

    try {
      submitBtn && (submitBtn.disabled = true);
      setStatus("Sending...");

      // Preferred: EmailJS sendForm collects fields by their `name` attributes :contentReference[oaicite:3]{index=3}
      if (canSendViaEmailJS()) {
        initEmailJSOnce();

        // Send the form values through EmailJS
        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);

        setStatus("Request sent! We’ll reply soon.");
        form.reset();
        form.classList.remove("was-validated");
        return;
      }

      // Fallback: open email client
      setStatus("Email sending isn’t configured yet—opening your email app...");
      const values = Object.fromEntries(new FormData(form).entries());
      window.location.href = buildMailto(values);

    } catch (err) {
      console.error(err);
      setStatus("Couldn’t send right now. Please use the email button instead.", true);
    } finally {
      submitBtn && (submitBtn.disabled = false);
    }
  });
})();
