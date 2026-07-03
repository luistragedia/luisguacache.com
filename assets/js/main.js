document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const GA_ID = "G-QC6G42P1HY";
  const CONSENT_KEY = "lg_cookie_analytics";

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
