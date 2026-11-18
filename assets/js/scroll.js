/* ============================================================
   DIGITALIS TOGO — scroll.js
   ScrollTrigger : reveals génériques, header, séquences
   ============================================================ */
(function () {
  "use strict";

  function init() {
    var DT = window.DT;

    // Fallback : sans GSAP, tout le contenu reste visible
    if (!DT.gsap || !DT.ScrollTrigger) {
      document.querySelectorAll(".js [data-reveal], .js [data-split]").forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    var gsap = DT.gsap;
    var ScrollTrigger = DT.ScrollTrigger;

    /* ---------- Header : état scroll + masquage ---------- */
    var header = document.querySelector(".site-header");
    if (header) {
      var lastY = 0;
      var ticking = false;

      function onScroll() {
        var y = window.scrollY;
        header.classList.toggle("is-scrolled", y > 24);
        if (y > 400 && y > lastY + 4) {
          header.classList.add("is-hidden");
        } else if (y < lastY - 4 || y < 200) {
          header.classList.remove("is-hidden");
        }
        lastY = y;
        ticking = false;
      }

      window.addEventListener(
        "scroll",
        function () {
          if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
          }
        },
        { passive: true }
      );
      onScroll();
    }

    /* ---------- Reveal générique [data-reveal] ---------- */
    var revealEls = document.querySelectorAll("[data-reveal]");
    if (revealEls.length && !DT.reducedMotion) {
      revealEls.forEach(function (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true
            }
          }
        );
      });
    } else {
      revealEls.forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }

    /* ---------- Titres cinétiques [data-split] ---------- */
    var splitTargets = document.querySelectorAll("[data-split]");
    if (splitTargets.length && !DT.reducedMotion && window.SplitType) {
      splitTargets.forEach(function (el) {
        var split = new SplitType(el, { types: "lines,words" });
        gsap.fromTo(
          split.words,
          { yPercent: 110, rotate: 4 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.06,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true
            }
          }
        );
        // Masquer le débordement pour l'effet masque sur chaque ligne
        el.style.overflow = "hidden";
        split.lines.forEach(function (line) {
          line.style.overflow = "hidden";
        });
      });
    }

    /* ---------- Lignes de services : reveal échelonné ---------- */
    var lineGroups = document.querySelectorAll("[data-lines]");
    lineGroups.forEach(function (group) {
      var lines = group.querySelectorAll(".service-line");
      if (!lines.length) return;
      if (DT.reducedMotion) {
        lines.forEach(function (l) { l.style.opacity = "1"; });
        return;
      }
      gsap.fromTo(
        lines,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: group,
            start: "top 80%",
            once: true
          }
        }
      );
    });

    /* ---------- Étapes méthode ---------- */
    var steps = document.querySelectorAll(".method__step");
    if (steps.length && !DT.reducedMotion) {
      steps.forEach(function (step) {
        gsap.fromTo(
          step,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: step, start: "top 85%", once: true }
          }
        );
        var num = step.querySelector(".method__num");
        if (num) {
          gsap.fromTo(
            num,
            { "-webkit-text-stroke-color": "rgba(106,176,76,0)", opacity: 0.3 },
            {
              opacity: 1,
              duration: 0.8,
              scrollTrigger: { trigger: step, start: "top 85%", once: true }
            }
          );
        }
      });
    }

    /* ---------- Cartes expertise / offres ---------- */
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      var items = group.querySelectorAll(":scope > *");
      if (!items.length) return;
      if (DT.reducedMotion) return;
      gsap.fromTo(
        items,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: group, start: "top 82%", once: true }
        }
      );
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
