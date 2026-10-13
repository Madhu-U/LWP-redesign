/**
 * main.js
 * Small site-wide enhancements. The page works fully without this file.
 */
(function () {
  "use strict";

  /** Keeps the footer copyright year current (HTML ships a static fallback). */
  function setCurrentYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-current-year]").forEach((element) => {
      element.textContent = year;
    });
  }

  setCurrentYear();
})();

/**
 * Navigation menu.
 * Below 768px the links collapse into a dropdown opened by the hamburger.
 * On wider screens the links sit inline and the button is hidden by CSS.
 */
(function () {
  "use strict";

  const toggle = document.querySelector(".site-nav__bars");
  const menu = document.querySelector("#nav-menu");
  const barsIcon = document.querySelector("#bars-icon");
  const crossIcon = document.querySelector("#cross-icon");
  if (!toggle || !menu) return;

  // CSS only collapses the menu once this class is present, so the links
  // stay reachable if this script fails to load.
  document.documentElement.classList.add("js");

  const desktopQuery = window.matchMedia("(min-width: 48rem)");

  function setOpen(isOpen) {
    menu.classList.toggle("is-open", isOpen);
    barsIcon.hidden = isOpen;
    crossIcon.hidden = !isOpen;
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  }

  toggle.addEventListener("click", () => {
    setOpen(!menu.classList.contains("is-open"));
  });

  // Close after choosing a link
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  // Close when clicking elsewhere
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-nav")) setOpen(false);
  });

  // Close with Escape and return focus to the button
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Reset when the window grows to the inline layout
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
})();
