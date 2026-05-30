/* 
   portfolio-filter.js
   - portfolio filtering by category
   - modal open/close + focus handling
 */

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const filterButtons = $$(".pill");
  const projects = $$(".project");

  const applyFilter = (filter) => {
    projects.forEach((card) => {
      const cats = (card.dataset.category || "").split(" ");
      const show = filter === "all" || cats.includes(filter);
      card.style.display = show ? "" : "none";
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyFilter(btn.dataset.filter || "all");
    });
  });

  // Modal
  const modal = $("#projectModal");
  const modalTitle = $("#modalTitle");
  const modalDesc = $("#modalDesc");
  const modalTech = $("#modalTech");
  const modalImg = $("#modalImg");

  let lastFocused = null;

  const openModal = (projectEl) => {
    if (!modal) return;
    lastFocused = document.activeElement;

    const title = projectEl.dataset.title || "Project";
    const desc = projectEl.dataset.desc || "";
    const tech = projectEl.dataset.tech || "";
    const image = projectEl.dataset.image || "";

    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalTech.textContent = tech;
    modalImg.src = image;
    modalImg.alt = `${title} preview`;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    // Focus close button for accessibility
    const closeBtn = $(".modal__close", modal);
    closeBtn?.focus();

    // Prevent background scroll
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  };

  // Open by button / card click / Enter key
  projects.forEach((p) => {
    $(".project__open", p)?.addEventListener("click", () => openModal(p));
    p.addEventListener("dblclick", () => openModal(p));
    p.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openModal(p);
    });
  });

  // Close handlers
  modal?.addEventListener("click", (e) => {
    const t = e.target;
    if (t?.matches("[data-modal-close]")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal?.classList.contains("is-open")) return;
    if (e.key === "Escape") closeModal();

    // Minimal focus trap (keeps tabbing inside modal)
    if (e.key === "Tab") {
      const focusables = $$("button, a[href], input, textarea, [tabindex]:not([tabindex='-1'])", modal)
        .filter((el) => !el.hasAttribute("disabled"));

      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Default filter
  applyFilter("all");

  // Expose close in case other scripts need it (optional)
  window.EVPortfolio = window.EVPortfolio || {};
  window.EVPortfolio.closeModal = closeModal;
})();
