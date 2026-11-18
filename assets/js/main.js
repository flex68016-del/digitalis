/* ============================================================
   DIGITALIS TOGO — main.js
   Amorçage : flags, Lenis, ScrollTrigger, orchestration
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  window.DT = {
    config: window.DIGITALIS_CONFIG || {},
    reducedMotion: reducedMotion,
    isTouch: isTouch,
    lenis: null,
    gsap: window.gsap || null,
    ScrollTrigger: window.ScrollTrigger || null
  };

  function initSmoothScroll() {
    if (DT.reducedMotion || typeof Lenis === "undefined") return;

    var lenis = new Lenis({
      duration: 1.15,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      touchMultiplier: 1.4
    });

    DT.lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    if (window.gsap && window.ScrollTrigger) {
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  function scrollToTarget(target) {
    if (DT.lenis) {
      DT.lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    } else if (typeof target === "string") {
      var el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (target && target.scrollIntoView) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  DT.scrollTo = scrollToTarget;

  document.addEventListener("DOMContentLoaded", function () {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    initSmoothScroll();

    // Liens d'ancrage interceptés pour Lenis
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var href = link.getAttribute("href");
      if (href === "#" || href.length < 2) return;
      var el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      // Fermer le menu mobile si ouvert
      var toggle = document.querySelector(".nav-toggle");
      var menu = document.querySelector(".mobile-menu");
      if (toggle && menu && menu.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
        document.body.style.overflow = "";
      }
    });
  });
})();
