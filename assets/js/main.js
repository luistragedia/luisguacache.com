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
    const versionedCss = "/assets/css/v14.css?v=148";
    const currentLink = document.querySelector('link[href*="/assets/css/v14.css"]');
    if (currentLink && currentLink.getAttribute("href") !== versionedCss) {
      currentLink.setAttribute("href", versionedCss);
    }
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
