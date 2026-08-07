// Akand Smart Solutions — i18n engine
// Supports bn (default), en, ar, ur. Persists choice in localStorage.

const SUPPORTED_LOCALES = ["bn", "ar", "ur", "en"];
const DEFAULT_LOCALE = "bn";
let currentDict = null;

function detectInitialLocale() {
  const saved = localStorage.getItem("akand_locale");
  if (saved && SUPPORTED_LOCALES.includes(saved)) return saved;

  const nav = (navigator.language || "bn").slice(0, 2);
  if (SUPPORTED_LOCALES.includes(nav)) return nav;

  return DEFAULT_LOCALE;
}

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined;
    // supports array index syntax like items.0.name
    return acc[key];
  }, obj);
}

async function loadLocale(locale) {
  const base = window.ASSET_BASE || "";
  const res = await fetch(`${base}locales/${locale}.json`);
  if (!res.ok) throw new Error(`Failed to load locale: ${locale}`);
  return res.json();
}

function applyStaticStrings(dict) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = getByPath(dict, key);
    if (typeof value === "string") {
      el.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    const value = getByPath(dict, key);
    if (typeof value === "string") {
      const paragraphs = value
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      el.innerHTML = paragraphs
        .map((p) => `<p class="mb-4 last:mb-0">${p.replace(/\n/g, "<br>")}</p>`)
        .join("");
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const value = getByPath(dict, key);
    if (typeof value === "string") el.setAttribute("placeholder", value);
  });
}

function applyDirectionAndFont(dict) {
  const dir = dict.meta.dir;
  const lang = dict.meta.lang;
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lang);
  document.body.classList.remove("font-bn", "font-ar", "font-ur", "font-en");
  document.body.classList.add(`font-${lang}`);
}

function updateLangSwitcherUI(locale) {
  document.querySelectorAll("[data-lang-option]").forEach((btn) => {
    const isActive = btn.getAttribute("data-lang-option") === locale;
    if (isActive) {
      btn.classList.add("bg-brand-PRIMARY", "text-white", "shadow-sm");
      btn.classList.remove("text-brand-TEXT");
    } else {
      btn.classList.remove("bg-brand-PRIMARY", "text-white", "shadow-sm");
      btn.classList.add("text-brand-TEXT");
    }
  });
}

async function setLocale(locale, { animateHero = false } = {}) {
  if (!SUPPORTED_LOCALES.includes(locale)) locale = DEFAULT_LOCALE;
  const dict = await loadLocale(locale);
  currentDict = dict;
  localStorage.setItem("akand_locale", locale);

  applyDirectionAndFont(dict);
  applyStaticStrings(dict);
  updateLangSwitcherUI(locale);

  // Products grid (built dynamically since it's a list)
  if (typeof renderProducts === "function") renderProducts(dict);
  // Why-us grid
  if (typeof renderWhyUs === "function") renderWhyUs(dict);

  document.dispatchEvent(new CustomEvent("localechange", { detail: { locale, dict } }));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-lang-option]").forEach((btn) => {
    btn.addEventListener("click", () => setLocale(btn.getAttribute("data-lang-option")));
  });

  setLocale(detectInitialLocale(), { animateHero: true });
});
