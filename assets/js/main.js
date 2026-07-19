document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const GA_ID = "G-QC6G42P1HY";
  const CONSENT_KEY = "lg_cookie_analytics";
  const SOCIAL_LINKS = [
    { label: "Facebook", url: "https://www.facebook.com/luisitoendigital" },
    { label: "Instagram", url: "https://www.instagram.com/luisitoendigital" },
    { label: "TikTok", url: "https://www.tiktok.com/@luisitoendigital" },
    { label: "YouTube", url: "https://www.youtube.com/@luisitoendigital" }
  ];

  function ensureLatestStylesheet() {
    const versionedCss = "/assets/css/v14.css?v=149";
    const currentLink = document.querySelector('link[href*="/assets/css/v14.css"]');
    if (currentLink && currentLink.getAttribute("href") !== versionedCss) {
      currentLink.setAttribute("href", versionedCss);
    }
  }

  function injectRedesStyles() {
    if (document.getElementById("lg-redes-style")) return;

    const style = document.createElement("style");
    style.id = "lg-redes-style";
    style.textContent = `
      .redes-card .pill{
        text-decoration:none;
        line-height:1;
      }
      .redes-card .pill:hover,
      .redes-card .pill:focus{
        text-decoration:none;
      }
    `;
    document.head.appendChild(style);
  }

  function renderRedes() {
    const contactGrid = document.querySelector("#contacto .contact-grid");
    if (contactGrid && !document.querySelector(".redes-card")) {
      const redesCard = document.createElement("div");
      redesCard.className = "contact-card redes-card";
      redesCard.innerHTML = `
        <h3>Redes sociales</h3>
        <p class="muted">También puedes seguir mi contenido, procesos y proyectos digitales.</p>
        <div class="cta-row cta-row-spaced-sm">
          ${SOCIAL_LINKS.map((item) => `<a class="pill" href="${item.url}" target="_blank" rel="noopener">${item.label}</a>`).join("")}
        </div>
      `;
      contactGrid.appendChild(redesCard);
    }

    const footerNav = document.querySelector(".footer-nav");
    if (footerNav && !footerNav.querySelector('[href="https://www.instagram.com/luisitoendigital"]')) {
      SOCIAL_LINKS.forEach((item) => {
        const link = document.createElement("a");
        link.href = item.url;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = item.label;
        footerNav.appendChild(link);
      });
    }
  }

  function enrichStructuredData() {
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (!jsonLd || !jsonLd.textContent) return;

    try {
      const data = JSON.parse(jsonLd.textContent);
      const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [];
      const person = graph.find((item) => item["@type"] === "Person");
      if (!person) return;

      const current = Array.isArray(person.sameAs) ? person.sameAs : [];
      SOCIAL_LINKS.forEach((item) => {
        if (!current.includes(item.url)) current.push(item.url);
      });
      person.sameAs = current;
      jsonLd.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
      // Si el JSON-LD no se puede leer, no bloqueamos la web.
    }
  }

  ensureLatestStylesheet();
  injectRedesStyles();
  renderRedes();
  enrichStructuredData();

  const storage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch (error) { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch (error) { /* Navegador sin localStorage */ }
    }
  };

  function loadAnalytics() {
    if (window.gtag || document.querySelector(`script[src*="${GA_ID}"]`)) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(){ window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
  }

  function trackWhatsAppClick() {
    if (typeof window.gtag === "function") {
      window.gtag("event", "click_whatsapp", {
        event_category: "Contacto",
        event_label: "WhatsApp",
        transport_type: "beacon"
      });
    }
  }

  function trackQualifierEvent(action, label) {
    if (typeof window.gtag === "function") {
      window.gtag("event", action, {
        event_category: "Cualificador",
        event_label: label
      });
    }
  }

  function setupLeadQualifier() {
    const qualifier = document.getElementById("lead-qualifier");
    if (!qualifier) return;

    const WHATSAPP_NUMBER = "34647551192";
    const state = { category: "", urgency: "", context: "" };
    const steps = qualifier.querySelectorAll("[data-qualifier-step]");
    const progress = qualifier.querySelectorAll("[data-qualifier-progress]");
    const contextField = qualifier.querySelector("#lead-qualifier-context");
    const result = qualifier.querySelector("[data-qualifier-result]");
    const whatsappLink = qualifier.querySelector("[data-qualifier-whatsapp]");

    function showStep(stepNumber, moveFocus = true) {
      steps.forEach((step) => {
        const isActive = Number(step.dataset.qualifierStep) === stepNumber;
        step.classList.toggle("is-active", isActive);
        step.hidden = !isActive;
      });

      progress.forEach((item) => {
        item.classList.toggle("is-complete", Number(item.dataset.qualifierProgress) <= Math.min(stepNumber, 3));
      });

      if (moveFocus) {
        const activeStep = qualifier.querySelector(`[data-qualifier-step="${stepNumber}"]`);
        const focusTarget = activeStep?.querySelector("button, textarea, a");
        focusTarget?.focus({ preventScroll: true });
      }
    }

    qualifier.querySelectorAll("[data-qualifier-category]").forEach((button) => {
      button.addEventListener("click", () => {
        state.category = button.dataset.qualifierCategory;
        trackQualifierEvent("qualifier_category", state.category);
        showStep(2);
      });
    });

    qualifier.querySelectorAll("[data-qualifier-urgency]").forEach((button) => {
      button.addEventListener("click", () => {
        state.urgency = button.dataset.qualifierUrgency;
        trackQualifierEvent("qualifier_urgency", state.urgency);
        showStep(3);
      });
    });

    qualifier.querySelectorAll("[data-qualifier-back]").forEach((button) => {
      button.addEventListener("click", () => showStep(Number(button.dataset.qualifierBack)));
    });

    qualifier.querySelector("[data-qualifier-finish]")?.addEventListener("click", () => {
      state.context = contextField.value.trim();
      const lines = [
        "Hola Luis, vengo de luisguacache.com.",
        `Necesito ayuda con: ${state.category}.`,
        `Plazo: ${state.urgency}.`
      ];

      if (state.context) lines.push(`Contexto: ${state.context}`);

      const message = lines.join("\n");
      result.textContent = message;
      whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      trackQualifierEvent("qualifier_complete", state.category);
      showStep(4);
    });

    qualifier.querySelector("[data-qualifier-reset]")?.addEventListener("click", () => {
      state.category = "";
      state.urgency = "";
      state.context = "";
      contextField.value = "";
      result.textContent = "";
      whatsappLink.href = "#";
      showStep(1);
    });

    showStep(1, false);
  }

  setupLeadQualifier();

  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach((link) => {
    link.addEventListener("click", trackWhatsAppClick);
  });

  function createCookieBanner() {
    if (storage.get(CONSENT_KEY)) return;

    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Preferencias de cookies");
    banner.innerHTML = `
      <p>
        Uso cookies técnicas y, solo si aceptas, Google Analytics para medir visitas y mejorar la web.
        <a href="/legal/cookies.html">Ver política de cookies</a>.
      </p>
      <div class="cookie-actions">
        <button class="btn btn-outline" type="button" data-cookie-choice="rejected">Rechazar</button>
        <button class="btn" type="button" data-cookie-choice="accepted">Aceptar</button>
      </div>
    `;

    banner.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cookie-choice]");
      if (!button) return;

      const choice = button.getAttribute("data-cookie-choice");
      storage.set(CONSENT_KEY, choice);
      if (choice === "accepted") loadAnalytics();
      banner.remove();
    });

    document.body.appendChild(banner);
  }

  if (storage.get(CONSENT_KEY) === "accepted") {
    loadAnalytics();
  }

  createCookieBanner();
});
