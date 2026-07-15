const selectors = {
  header: "[data-header]",
  navToggle: "[data-nav-toggle]",
  navMenu: "[data-nav-menu]",
  reveal: ".reveal",
};

class MobileNavigation {
  constructor(toggle, menu) {
    this.toggle = toggle;
    this.menu = menu;
  }

  init() {
    if (!this.toggle || !this.menu) return;

    this.toggle.addEventListener("click", () => this.toggleMenu());
    this.menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) this.close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.close();
    });
  }

  toggleMenu() {
    const shouldOpen = !this.menu.classList.contains("is-open");
    shouldOpen ? this.open() : this.close();
  }

  open() {
    this.menu.classList.add("is-open");
    this.toggle.classList.add("is-open");
    this.toggle.setAttribute("aria-expanded", "true");
  }

  close() {
    this.menu.classList.remove("is-open");
    this.toggle.classList.remove("is-open");
    this.toggle.setAttribute("aria-expanded", "false");
  }
}

function updateHeaderState() {
  const header = document.querySelector(selectors.header);
  if (!header) return;

  const sync = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  sync();
  window.addEventListener("scroll", sync, { passive: true });
}

function revealOnScroll() {
  const items = document.querySelectorAll(selectors.reveal);
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  items.forEach((item) => observer.observe(item));
}

function initApp() {
  const navigation = new MobileNavigation(
    document.querySelector(selectors.navToggle),
    document.querySelector(selectors.navMenu)
  );

  navigation.init();
  updateHeaderState();
  revealOnScroll();
}

document.addEventListener("DOMContentLoaded", initApp);
