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

/**
 * Hero background video autoplay safeguard.
 */
(function () {
  const heroVideo = document.querySelector(".hero__video");
  if (!heroVideo) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroVideo.pause();
  } else {
    heroVideo.play().catch(() => {});
  }
})();

/**
 * Dynamic navbar: stretches the whole row at the top / when scrolling up,
 * collapses to the logo pill (and hides the menu on the right) when scrolling down.
 */
(function () {
  "use strict";

  const nav = document.querySelector(".site-nav");
  const menu = document.querySelector("#nav-menu");
  if (!nav) return;

  let lastScrollY = window.scrollY;
  const SCROLL_THRESHOLD = 30;
  const DELTA = 6;
  let ticking = false;

  function updateNav() {
    const currentScrollY = Math.max(0, window.scrollY);

    // If dropdown menu is open, keep navbar in full state
    if (menu && menu.classList.contains("is-open")) {
      nav.classList.remove("is-collapsed");
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }

    if (currentScrollY <= SCROLL_THRESHOLD) {
      // At the top of the page: full state
      nav.classList.remove("is-collapsed");
    } else if (currentScrollY > lastScrollY + DELTA) {
      // Scrolling down: collapse to logo pill
      nav.classList.add("is-collapsed");
    } else if (currentScrollY < lastScrollY - DELTA) {
      // Scrolling up: expand to full state immediately
      nav.classList.remove("is-collapsed");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Initialize on load
  updateNav();
})();


