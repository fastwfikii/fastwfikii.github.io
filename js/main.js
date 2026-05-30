/*
   main.js
   - sticky-ish nav highlighting (active link)
   - mobile menu toggle
   - smooth scroll (native + offset handling)
   - dark mode with localStorage
   - typing animation
   - progress bar animation on scroll
   - back to top button
   - modal open/close helpers are in portfolio-filter.js
 */

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Footer year
  $("#year").textContent = new Date().getFullYear();

  // Mobile menu
  const navToggle = $(".nav__toggle");
  const navMenu = $("#navMenu");

  const setMenuOpen = (isOpen) => {
    navMenu.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  navToggle?.addEventListener("click", () => {
    setMenuOpen(!navMenu.classList.contains("is-open"));
  });

  // Close menu when clicking a link (mobile)
  $$(".nav__link").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  // Active link based on scroll position
  const sections = ["about","skills","portfolio","experience","education","contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navLinks = $$(".nav__link");

  const updateActiveNav = () => {
    const y = window.scrollY + 120;
    let currentId = "hero";

    for (const sec of sections) {
      if (sec.offsetTop <= y) currentId = sec.id;
    }

    navLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      const isActive = href === `#${currentId}`;
      a.classList.toggle("is-active", isActive);
    });
  };

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // Theme toggle with localStorage
  const themeToggle = $("#themeToggle");
  const THEME_KEY = "ev_portfolio_theme";

  const applyTheme = (theme) => {
    document.body.classList.toggle("theme--dark", theme === "dark");
    document.body.classList.toggle("theme--light", theme !== "dark");
  };

  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    const isDark = document.body.classList.contains("theme--dark");
    const next = isDark ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  // Typing animation
  const typingEl = $("#typingText");
  const words = [
    "EV product experiences",
    "charging dashboards",
    "high-performance websites",
    "accessible interfaces"
  ];

  let w = 0, i = 0, deleting = false;

  const typeTick = () => {
    if (!typingEl) return;

    const word = words[w];
    const speed = deleting ? 38 : 52;

    typingEl.textContent = deleting
      ? word.slice(0, i--)
      : word.slice(0, i++);

    if (!deleting && i === word.length + 1) {
      deleting = true;
      setTimeout(typeTick, 900);
      return;
    }

    if (deleting && i < 0) {
      deleting = false;
      w = (w + 1) % words.length;
      i = 0;
      setTimeout(typeTick, 220);
      return;
    }

    setTimeout(typeTick, speed);
  };
  typeTick();

  // Progress bars animate on visibility
  const bars = $$(".progress");
  const setProgress = (el) => {
    const val = Number(el.dataset.progress || "0");
    const bar = $(".progress__bar", el);
    if (!bar) return;

    bar.style.width = `${Math.max(0, Math.min(100, val))}%`;
    bar.setAttribute("aria-valuenow", String(val));
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setProgress(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  bars.forEach((p) => io.observe(p));

  // Back to top button
  const toTop = $("#toTop");
  const toggleToTop = () => {
    const show = window.scrollY > 700;
    toTop?.classList.toggle("is-visible", show);
  };
  window.addEventListener("scroll", toggleToTop, { passive: true });
  toggleToTop();

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Close menu on outside click (mobile)
  document.addEventListener("click", (e) => {
    if (!navMenu.classList.contains("is-open")) return;
    const target = e.target;
    const insideMenu = navMenu.contains(target) || navToggle.contains(target);
    if (!insideMenu) setMenuOpen(false);
  });
})();
