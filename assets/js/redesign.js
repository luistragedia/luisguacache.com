document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".priority-hero");
  const canHighlightGrid = window.matchMedia(
    "(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)"
  );

  if (hero) {
    hero.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || !canHighlightGrid.matches) return;

      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty("--hero-x", `${event.clientX - bounds.left}px`);
      hero.style.setProperty("--hero-y", `${event.clientY - bounds.top}px`);
      hero.classList.add("is-grid-active");
    }, { passive: true });

    const hideHighlight = () => hero.classList.remove("is-grid-active");
    hero.addEventListener("pointerleave", hideHighlight);
    hero.addEventListener("pointercancel", hideHighlight);
    canHighlightGrid.addEventListener("change", hideHighlight);
  }

  document.querySelectorAll(".site-header").forEach((header) => {
    const button = header.querySelector(".nav-toggle");
    const nav = header.querySelector(".nav");
    if (!button || !nav) return;

    const closeMenu = () => {
      header.classList.remove("nav-open");
      button.setAttribute("aria-expanded", "false");
      button.textContent = "Menú";
    };

    button.addEventListener("click", () => {
      const open = !header.classList.contains("nav-open");
      header.classList.toggle("nav-open", open);
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? "Cerrar" : "Menú";
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) closeMenu();
    });
  });
});
