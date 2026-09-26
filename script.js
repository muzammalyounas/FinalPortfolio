(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const state = {
    roleIndex: 0,
    roles: [
      "Senior .NET & Oracle NetSuite Reporting Developer",
      "SuiteScript 2.x / 2.0 / 2.1 • SuiteQL • Suitelets",
      "Telerik Grid • Customized Popup • ERP Dashboard Specialist"
    ]
  };

  const header = $("#siteHeader");
  const progress = $("#pageProgress");
  const backToTop = $("#backToTop");
  const role = $("#heroRole");
  const year = $("#year");

  if (year) year.textContent = new Date().getFullYear();

  const updateScrollUI = () => {
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    const percent = max > 0 ? (root.scrollTop / max) * 100 : 0;

    if (progress) progress.style.width = `${percent}%`;
    if (header) header.classList.toggle("scrolled", window.scrollY > 30);
    if (backToTop) backToTop.classList.toggle("show", window.scrollY > 520);
  };

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  if (backToTop) {
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Professional rotating role text with a subtle fade.
  if (role) {
    setInterval(() => {
      role.animate(
        [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(6px)" }],
        { duration: 220, fill: "forwards" }
      ).finished.then(() => {
        state.roleIndex = (state.roleIndex + 1) % state.roles.length;
        role.textContent = state.roles[state.roleIndex];

        role.animate(
          [{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 260, fill: "forwards" }
        );
      });
    }, 2800);
  }

  // Scroll reveal.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

  $$(".reveal").forEach(el => revealObserver.observe(el));

  // Highlight active nav item while scrolling.
  const sections = $$("main section[id]");
  const navLinks = $$("#mainNav .nav-link");

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { threshold: 0.32 });

  sections.forEach(section => navObserver.observe(section));

  // Close Bootstrap mobile navbar after selecting a link.
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const nav = $("#mainNav");
      const instance = bootstrap.Collapse.getInstance(nav);
      if (instance) instance.hide();
    });
  });

  // Bootstrap modal-based project preview.
  const modalEl = $("#projectModal");
  const modalImage = $("#projectModalImage");
  const projectModal = modalEl ? bootstrap.Modal.getOrCreateInstance(modalEl) : null;

  $$("[data-preview]").forEach(button => {
    button.addEventListener("click", () => {
      const src = button.dataset.preview;
      const sourceImage = $("img", button);
      if (!src || !modalImage || !projectModal) return;

      modalImage.src = src;
      modalImage.alt = sourceImage?.alt || "Project preview";
      projectModal.show();
    });
  });

  if (modalEl && modalImage) {
    modalEl.addEventListener("hidden.bs.modal", () => {
      modalImage.src = "";
    });
  }

  // Image error diagnostics: keeps broken assets visually obvious during testing.
  $$("img").forEach(img => {
    img.addEventListener("error", () => {
      img.classList.add("image-error");
      console.error("Image failed to load:", img.getAttribute("src"));
    });
  });
})();
