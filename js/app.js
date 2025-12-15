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

  // Request form
  const form = document.getElementById("cookieRequestForm");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const mailtoBtn = document.getElementById("mailtoBtn");

  const destinationEmail = "haleigh.zaccaria@gmail.com";

  // ===== EmailJS CONFIG =====
  // 1) EmailJS dashboard -> Email Services -> copy your Service ID
  // 2) EmailJS dashboard -> Email Templates -> create/copy Template ID
  // 3) EmailJS dashboard -> Account -> copy Public Key
  const EMAILJS_PUBLIC_KEY = "PASTE_YOUR_PUBLIC_KEY_HERE";
  const EMAILJS_SERVICE_ID = "PASTE_YOUR_SERVICE_ID_HERE";
  const EMAILJS_TEMPLATE_ID = "PASTE_YOUR_TEMPLATE_ID_HERE";

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
