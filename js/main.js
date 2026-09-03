/* ------------------------------------------------------------------
   Baseline behaviour — runs with or without Motion.
   ------------------------------------------------------------------ */

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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Anything here is held for the lifetime of the page (see the reveal observer).
const keepAlive = [];

// Cursor-tracked spotlight on the project cards (kokonutui-style glow).
// Pure CSS custom properties — no animation library needed.
const cards = Array.from(document.querySelectorAll(".card"));
if (!reducedMotion && window.matchMedia("(hover: hover)").matches) {
  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

/* ------------------------------------------------------------------
   Motion layer (https://motion.dev) — loaded lazily from a CDN.
   Everything below is progressive enhancement: if the import fails,
   the page stays fully readable and nothing is left hidden.
   ------------------------------------------------------------------ */

if (!reducedMotion) {
  import("https://cdn.jsdelivr.net/npm/motion@11.18.2/+esm")
    .then(({ animate, inView, scroll, stagger }) => {
      const ease = [0.22, 1, 0.36, 1];

      // From here on the entrance states are ours to drive, so it is safe
      // to let the stylesheet hide anything tagged for animation.
      document.documentElement.classList.add("motion-ready");

      /* ---- Scroll progress bar riding the nav's bottom border ---- */
      const nav = document.querySelector(".nav");
      if (nav) {
        const bar = document.createElement("div");
        bar.className = "scroll-progress";
        nav.appendChild(bar);
        keepAlive.push(scroll(animate(bar, { scaleX: [0, 1] }, { ease: "linear" })));
      }

      /* ---- Hero entrance: staggered blur-up ---- */
      const heroBits = document.querySelectorAll("[data-hero]");
      if (heroBits.length) {
        animate(
          heroBits,
          { opacity: [0, 1], y: [18, 0], filter: ["blur(8px)", "blur(0px)"] },
          { duration: 0.7, ease, delay: stagger(0.08) }
        );
      }

      /* ---- Scroll-triggered reveals ---- */
      const revealTargets = document.querySelectorAll(
        [
          ".section-title",
          ".about-text p",
          ".skill-group",
          ".timeline-item",
          ".card",
          ".edu-card",
          ".contact-lead",
          ".contact .btn",
          ".marquee",
          ".detail > h1",
          ".detail > .detail-sub",
          ".detail > .tags",
          ".detail-media",
          ".detail > h2",
          ".detail > p",
          ".detail > ul",
          ".detail-note",
        ].join(", ")
      );

      revealTargets.forEach((el) => el.setAttribute("data-anim", ""));

      // One inView() call for the whole set, not one per element: the stop
      // function it returns is the only strong reference to its
      // IntersectionObserver, so per-element observers get collected before
      // most of them ever fire. `keepAlive` holds onto it for the page's life.
      let revealed = 0;
      keepAlive.push(
        inView(
          Array.from(revealTargets),
          (entry) => {
            // Motion 11 passes the IntersectionObserverEntry; 12 passes the element.
            const el = entry.target || entry;
            revealed++;
            animate(
              el,
              { opacity: [0, 1], y: [22, 0], filter: ["blur(6px)", "blur(0px)"] },
              { duration: 0.6, ease }
            );
          },
          { amount: 0.15, margin: "0px 0px -60px 0px" }
        )
      );

      // Safety net: the stylesheet hides [data-anim] on our promise that Motion
      // will reveal it. If nothing has been revealed by now the observer is not
      // doing its job (API drift, a throw inside the callback) — drop the hiding
      // rule rather than leave the page blank.
      setTimeout(() => {
        if (revealed === 0) document.documentElement.classList.remove("motion-ready");
      }, 1500);

      /* ---- Timeline spine drawn by scroll position ---- */
      const timeline = document.querySelector(".timeline");
      if (timeline) {
        const spine = document.createElement("div");
        spine.className = "timeline-progress";
        timeline.appendChild(spine);
        keepAlive.push(
          scroll(animate(spine, { scaleY: [0, 1] }, { ease: "linear" }), {
            target: timeline,
            offset: ["start 80%", "end 60%"],
          })
        );
      }

      /* ---- Rotating role words in the hero ---- */
      const rotator = document.querySelector(".rotator");
      if (rotator) {
        const items = Array.from(rotator.querySelectorAll(".rotator-item"));
        let index = 0;

        const show = (el) => {
          el.style.visibility = "visible";
          animate(
            el,
            { opacity: [0, 1], y: [14, 0], filter: ["blur(5px)", "blur(0px)"] },
            { duration: 0.45, ease }
          );
        };
        const hide = (el) =>
          animate(
            el,
            { opacity: [1, 0], y: [0, -14], filter: ["blur(0px)", "blur(5px)"] },
            { duration: 0.35, ease }
          ).finished.then(() => {
            el.style.visibility = "hidden";
          });

        if (items.length > 1) {
          setInterval(() => {
            const current = items[index];
            index = (index + 1) % items.length;
            hide(current);
            show(items[index]);
          }, 2800);
        }
      }

      /* ---- Springy card lift on hover ---- */
      if (window.matchMedia("(hover: hover)").matches) {
        cards.forEach((card) => {
          const spring = { type: "spring", stiffness: 320, damping: 26 };
          card.addEventListener("pointerenter", () =>
            animate(card, { y: -6, scale: 1.012 }, spring)
          );
          card.addEventListener("pointerleave", () =>
            animate(card, { y: 0, scale: 1 }, spring)
          );
        });
      }
    })
    .catch(() => {
      /* CDN unreachable — the page is already fully visible, so do nothing. */
    });
}
