// Akand Smart Solutions — effects.js
// Shared across index.html and products/product.html
// 1) Page transitions (fade between pages)
// 2) Subtle cursor-follow glow on glass cards / gradient buttons
// 3) SVG stroke draw-in helper (used by main.js when rendering product icons)

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-loaded");
});

// --- Page transitions: intercept internal same-site link clicks, fade out, then navigate ---
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a) return;
  const href = a.getAttribute("href");
  if (!href) return;
  if (href.startsWith("#")) return; // same-page anchor, no transition needed
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return; // external
  if (a.target === "_blank") return;

  e.preventDefault();
  document.body.classList.add("page-leaving");
  setTimeout(() => {
    window.location.href = href;
  }, 320);
});

// --- Cursor-follow glow: works for any current or future .glass-card / .cta-gradient element ---
document.addEventListener("mousemove", (e) => {
  const el = e.target.closest(".glass-card, .cta-gradient");
  if (!el) return;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
});

// --- SVG stroke draw-in ---
// Call initSvgDraw(container) right after inserting SVGs containing .draw-path circles/paths,
// then playSvgDraw(container) when you want the stroke to animate in (e.g. on scroll reveal).
function initSvgDraw(root = document) {
  root.querySelectorAll(".draw-path:not([data-draw-ready])").forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.setAttribute("data-draw-ready", "1");
  });
}

function playSvgDraw(root = document, opts = {}) {
  const paths = root.querySelectorAll(".draw-path[data-draw-ready]");
  if (!paths.length) return;
  if (window.gsap) {
    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 0.9,
      ease: "power2.out",
      stagger: opts.stagger || 0.08,
      delay: opts.delay || 0,
    });
  } else {
    paths.forEach((p) => (p.style.strokeDashoffset = 0));
  }
}
