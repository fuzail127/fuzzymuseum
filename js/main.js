// Theme toggle: saved in localStorage, defaults to the system preference
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = root.dataset.theme || (systemDark ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked */ }
  });
}

// Mobile nav
const burger = document.getElementById("nav-burger");
const navLinks = document.getElementById("nav-links");
if (burger && navLinks) {
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
}
