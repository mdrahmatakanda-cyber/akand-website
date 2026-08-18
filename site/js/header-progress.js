// Akand Smart Solutions — header-progress.js
// Scroll progress bar + floating pill header + dark/light theme toggle.
// Shared across index.html and products/product.html.

document.addEventListener("DOMContentLoaded", () => {
  // --- Scroll progress bar + floating header, driven by one scroll listener ---
  const progressBar = document.getElementById("scroll-progress");

  function onScroll() {
    if (progressBar) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${pct}%`;
    }
    document.querySelector(".header-bar")?.classList.toggle("scrolled", window.scrollY > 50);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // set correct initial state (e.g. on page reload mid-scroll)

  // --- Theme toggle ---
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("theme-icon-sun");
  const moonIcon = document.getElementById("theme-icon-moon");

  function applyTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    sunIcon?.classList.toggle("hidden", theme === "dark");
    moonIcon?.classList.toggle("hidden", theme !== "dark");
  }

  // The <head> inline script already set the class before paint (avoids flash);
  // here we just sync the icon state to match.
  const savedTheme =
    localStorage.getItem("akand_theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(savedTheme);

  themeToggle?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    localStorage.setItem("akand_theme", next);
    applyTheme(next);
  });
});
