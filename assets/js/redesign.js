document.addEventListener("DOMContentLoaded", () => {
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
