/* ============================================================
   DIGITALIS TOGO — navigation.js
   Menu mobile, curseur personnalisé, boutons magnétiques
   ============================================================ */
(function () {
  "use strict";

  function init() {
    var DT = window.DT;

    /* ---------- Menu mobile ---------- */
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".mobile-menu");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        var open = menu.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
        if (DT.lenis) {
          open ? DT.lenis.stop() : DT.lenis.start();
        }
      });
    }

    /* ---------- Lien actif selon la page ---------- */
    var path = location.pathname.replace(/\\/index\.html$/, "/").replace(/\\.html$/, "");
    document.querySelectorAll(".main-nav a, .mobile-menu a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      var target = href.replace(/\\.html$/, "").replace(/\\/index$/, "/");
      if (target === path || (path === "/" && (target === "./" || target === "/" || target === "index"))) {
        a.classList.add("is-active");
        a.setAttribute("aria-current", "page");
      }
    });

    /* ---------- Curseur personnalisé (desktop uniquement) ---------- */
    if (DT.isTouch || DT.reducedMotion || !("matchMedia" in window) || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = -100, my = -100, rx = -100, ry = -100;

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = "translate(" + (mx - 4) + "px," + (my - 4) + "px)";
    }, { passive: true });

    (function ringLoop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = "translate(" + (rx - 18) + "px," + (ry - 18) + "px)";
      requestAnimationFrame(ringLoop);
    })();

    // États survol
    var hoverables = "a, button, .service-line, .offer, .expertise__card, input, textarea, select, [data-hover]";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(hoverables)) {
        ring.classList.add("is-hover");
      }
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(hoverables)) {
        ring.classList.remove("is-hover");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
