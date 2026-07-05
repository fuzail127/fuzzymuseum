// Theme toggle — persisted in localStorage, defaults to system preference
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const current = root.dataset.theme || (systemDark ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
});

// Mobile nav
const burger = document.getElementById("nav-burger");
const navLinks = document.getElementById("nav-links");
burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }
});

// Scroll reveal
const revealTargets = document.querySelectorAll(
  ".section-title, .about-grid, .timeline-item, .card, .edu-card, .contact-lead"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);
revealTargets.forEach((el) => observer.observe(el));
