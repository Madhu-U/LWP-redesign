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

const menuToggle = document.querySelector(".site-nav__bars");
const navMenu = document.querySelector("#nav-menu");
const crossIcon = document.querySelector("#cross-icon");
const barsIcon = document.querySelector("#bars-icon");

menuToggle.addEventListener("click", () => {
  const isOpen = !navMenu.hidden;
  console.log("Clicked");

  navMenu.hidden = isOpen;
  crossIcon.hidden = isOpen;
  barsIcon.hidden = !isOpen;
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Open navigation" : "Close navigation",
  );
});
