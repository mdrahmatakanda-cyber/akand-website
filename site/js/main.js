// Akand Smart Solutions — main.js
// NOTE: replace WHATSAPP_NUMBER with the real number (country code, no + or spaces)
const WHATSAPP_NUMBER = "8801752005057"; // set to provided WhatsApp number

function renderProducts(dict) {
  const grid = document.getElementById("products-grid");
  if (!grid) return;
  grid.innerHTML = "";
  dict.products.items.forEach((p, i) => {
    const card = document.createElement("a");
    card.href = `products/product.html?id=${p.id}`;
    card.className =
      "product-card group block glass-card rounded-2xl p-6 md:p-8 " +
      "hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300";
    card.style.opacity = "0";
    card.style.transform = "translateY(40px) scale(0.96)";
    card.innerHTML = `
      <div class="w-11 h-11 rounded-full bg-brand-LIGHT flex items-center justify-center mb-5 text-brand-PRIMARY group-hover:bg-brand-PRIMARY group-hover:text-white transition-all duration-300">
        <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none">
          <circle class="draw-path" cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
        </svg>
      </div>
      <h3 class="text-lg md:text-xl font-semibold text-brand-TEXT mb-1.5">${p.name}</h3>
      <p class="text-sm text-brand-TEXT/70 mb-5">${p.tagline}</p>
      <ul class="space-y-2 mb-6">
        ${p.usps.map((u) => `<li class="text-sm text-brand-TEXT/80 flex items-start gap-2">
          <span class="mt-1.5 w-1 h-1 rounded-full bg-brand-PRIMARY shrink-0"></span>${u}
        </li>`).join("")}
      </ul>
      <span class="text-sm font-medium text-brand-PRIMARY inline-flex items-center gap-1">
        ${dict.products.cta}
        <span class="rtl-flip transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    `;
    grid.appendChild(card);
  });

  if (typeof initSvgDraw === "function") initSvgDraw(grid);

  const trialEl = document.getElementById("products-trial");
  if (trialEl) trialEl.textContent = dict.products.trial;

  if (window.gsap) {
    gsap.to("#products-grid .product-card", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: "back.out(1.4)",
      scrollTrigger: {
        trigger: "#products-grid",
        start: "top 85%",
      },
      onStart: () => {
        if (typeof playSvgDraw === "function") playSvgDraw(grid, { stagger: 0.12, delay: 0.15 });
      },
    });
  } else {
    document.querySelectorAll("#products-grid .product-card").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }
}

function renderWhyUs(dict) {
  const grid = document.getElementById("why-grid");
  if (!grid) return;
  grid.innerHTML = "";
  dict.why.items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "flex items-start gap-3 glass-card rounded-xl px-4 py-3.5";
    row.innerHTML = `
      <span class="mt-0.5 w-5 h-5 rounded-full bg-brand-PRIMARY/15 text-brand-PRIMARY flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
      <span class="text-sm text-brand-TEXT/85">${item.title}</span>
    `;
    grid.appendChild(row);
  });
}

// --- Hero headline script-morph: cycles bn -> ar -> ur -> en then settles ---
async function playHeroMorph() {
  const el = document.getElementById("hero-headline");
  if (!el || el.dataset.played) return;
  el.dataset.played = "1";

  const sequence = ["en", "ar", "ur", "bn"];
  const base = window.ASSET_BASE || "";
  const cache = {};
  for (const loc of sequence) {
    try {
      const res = await fetch(`${base}locales/${loc}.json`);
      cache[loc] = await res.json();
    } catch (e) {
      /* ignore, skip that step */
    }
  }

  for (const loc of sequence) {
    const dict = cache[loc];
    if (!dict) continue;
    const text = dict.hero.headline_words[1]; // tagline line, short & punchy
    el.setAttribute("dir", dict.meta.dir);
    el.setAttribute("lang", dict.meta.lang);
    el.className = el.className.replace(/font-(bn|ar|ur|en)/g, "").trim() + ` font-${dict.meta.lang}`;

    if (window.gsap) {
      await gsap.to(el, { opacity: 0, y: -20, scale: 0.96, duration: 0.3, ease: "power1.in" }).then(() => {
        el.textContent = text;
      });
      await gsap.fromTo(el, { opacity: 0, y: 20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.6)" });
      await new Promise((r) => setTimeout(r, loc === "en" ? 0 : 600));
    } else {
      el.textContent = text;
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  if (currentDict) {
    el.setAttribute("dir", currentDict.meta.dir);
    el.setAttribute("lang", currentDict.meta.lang);
    el.className = el.className.replace(/font-(bn|ar|ur|en)/g, "").trim() + ` font-${currentDict.meta.lang}`;
    el.textContent = currentDict.hero.headline_words[1];
  }
  document.dispatchEvent(new Event("hero-morph-done"));
}

document.addEventListener("localechange", (e) => {
  const el = document.getElementById("hero-headline");
  if (el && el.dataset.played) {
    const dict = e.detail.dict;
    el.setAttribute("dir", dict.meta.dir);
    el.setAttribute("lang", dict.meta.lang);
    el.className = el.className.replace(/font-(bn|ar|ur|en)/g, "").trim() + ` font-${dict.meta.lang}`;
    el.textContent = dict.hero.headline_words[1];
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  setTimeout(playHeroMorph, 400);

  // mobile nav toggle + auto-close handlers
  const navToggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (navToggle && mobileMenu) {
    const closeMobileMenu = () => {
      if (mobileMenu.classList.contains("hidden")) return;
      mobileMenu.classList.add("hidden");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", (e) => {
      const isHidden = mobileMenu.classList.toggle("hidden");
      navToggle.setAttribute("aria-expanded", String(!isHidden));
    });

    // Close when clicking outside the menu or the toggle
    document.addEventListener("click", (e) => {
      if (mobileMenu.classList.contains("hidden")) return;
      const path = e.composedPath ? e.composedPath() : (function (node) {
        const p = [];
        while (node) { p.push(node); node = node.parentNode; }
        return p;
      })(e.target);
      if (!path.includes(mobileMenu) && !path.includes(navToggle)) closeMobileMenu();
    });

    // Close on scroll (small screens only) — passive for performance
    window.addEventListener("scroll", () => {
      if (mobileMenu.classList.contains("hidden")) return;
      closeMobileMenu();
    }, { passive: true });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileMenu();
    });

    // Close when a menu item or language button is clicked
    mobileMenu.querySelectorAll("a, button[data-lang-option]").forEach((el) =>
      el.addEventListener("click", () => {
        // small timeout so the link/navigation can start
        setTimeout(closeMobileMenu, 50);
      })
    );
  }

  // contact form -> WhatsApp deep link
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("[name=name]").value.trim();
      const whatsapp = form.querySelector("[name=whatsapp]").value.trim();
      const need = form.querySelector("[name=need]").value.trim();
      const text = encodeURIComponent(`নাম: ${name}\nWhatsApp: ${whatsapp}\nপ্রয়োজন: ${need}`);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    });
  }

  // fade-up reveal for generic sections
  if (window.gsap && window.ScrollTrigger) {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
    });

    // ambient floating blobs — slow, subtle, always running
    gsap.to("#blob-1", { x: -40, y: 30, duration: 9, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to("#blob-2", { x: 30, y: -40, duration: 11, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to("#blob-3", { x: -30, y: -25, duration: 8, yoyo: true, repeat: -1, ease: "sine.inOut" });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("#products, #about, #contact");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "nav-active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
});
