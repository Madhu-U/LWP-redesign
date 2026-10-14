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
 * The links live in a glassmorphic dropdown opened by the hamburger.
 */
(function () {
  "use strict";

  const toggle = document.querySelector(".site-nav__bars");
  const menu = document.querySelector("#nav-menu");
  const closeBtn = document.querySelector(".site-nav__close");
  if (!toggle || !menu) return;

  function setOpen(isOpen) {
    menu.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    // Trap focus inside the panel when open
    if (isOpen && closeBtn) closeBtn.focus();
  }

  toggle.addEventListener("click", () => {
    setOpen(!menu.classList.contains("is-open"));
  });

  // Close via the ✕ button inside the panel
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      setOpen(false);
      toggle.focus();
    });
  }

  // Close after choosing a link
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  // Close when clicking outside the menu-wrap or logo
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-nav__menu-wrap") && !event.target.closest(".site-nav__logo")) {
      setOpen(false);
    }
  });

  // Close with Escape and return focus to the button
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
})();
