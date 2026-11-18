/* ============================================================
   DIGITALIS TOGO — animations.js
   Intro cinématique, hero, séquences de scroll, footer
   ============================================================ */
(function () {
  "use strict";

  var INTRO_KEY = "dt_intro_seen";

  /* ================================================================
     INTRO CINÉMATIQUE — pixels dispersés → monogramme DT → rideau
     ================================================================ */
  function buildIntroPixels(container) {
    // Génère des pixels qui convergent vers la position du logo.
    var count = DT.isTouch ? 60 : 110;
    var frag = document.createDocumentFragment();
    var colors = ["#6AB04C", "#1E4DA1", "#12275C", "#3D63B8", "#8CC472"];

    for (var i = 0; i < count; i++) {
      var p = document.createElement("div");
      p.className = "intro__px";
      var size = 6 + Math.random() * 14;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.background = colors[i % colors.length];
      p.style.borderRadius = "2px";
      p.style.position = "absolute";
      // Position de départ aléatoire sur tout l'écran
      var sx = Math.random() * 100;
      var sy = Math.random() * 100;
      p.dataset.x = sx;
      p.dataset.y = sy;
      p.style.left = sx + "vw";
      p.style.top = sy + "vh";
      frag.appendChild(p);
    }
    container.appendChild(frag);
    return container.querySelectorAll(".intro__px");
  }

  function runIntro(onDone) {
    var DT = window.DT;
    var intro = document.querySelector(".intro");
    if (!intro) {
      onDone && onDone();
      return;
    }

    // Déjà vue cette session → sortie immédiate
    try {
      if (sessionStorage.getItem(INTRO_KEY)) {
        intro.remove();
        document.body.classList.add("intro-done");
        onDone && onDone();
        return;
      }
    } catch (e) { /* storage indisponible */ }

    var gsap = DT.gsap;
    var skipBtn = intro.querySelector(".intro__skip");
    var mark = intro.querySelector(".intro__mark");
    var word = intro.querySelector(".intro__word");
    var canvas = intro.querySelector(".intro__canvas");

    if (DT.reducedMotion || !gsap) {
      finishIntro();
      return;
    }

    var pixels = buildIntroPixels(canvas);
    var done = false;

    function finishIntro() {
      if (done) return;
      done = true;
      try { sessionStorage.setItem(INTRO_KEY, "1"); } catch (e) {}
      document.body.classList.add("intro-done");
      if (DT.lenis) DT.lenis.start();
      onDone && onDone();
      gsap.to(intro, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: function () { intro.remove(); }
      });
    }

    if (skipBtn) {
      skipBtn.addEventListener("click", finishIntro);
    }

    // Bloquer le scroll pendant l'intro
    if (DT.lenis) DT.lenis.stop();
    document.body.style.overflow = "hidden";

    // Sécurité : ne jamais piéger l'utilisateur
    setTimeout(finishIntro, 2600);

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Pixels : apparition + convergence vers le centre (zone logo)
    tl.fromTo(
      pixels,
      { opacity: 0, scale: 0 },
      {
        opacity: 0.9,
        scale: 1,
        duration: 0.5,
        stagger: { each: 0.012, from: "random" },
        ease: "power2.out"
      },
      0
    );

    // 2. Les pixels convergent vers le centre puis disparaissent
    tl.to(
      pixels,
      {
        left: "50%",
        top: "46%",
        opacity: 0,
        scale: 0.2,
        duration: 0.7,
        stagger: { each: 0.008, from: "random" },
        ease: "power3.in"
      },
      0.55
    );

    // 3. Monogramme DT : les pixels du logo apparaissent en cascade
    if (mark) {
      var px = mark.querySelectorAll(".logo-px");
      tl.to(mark, { opacity: 1, duration: 0.3 }, 0.9);
      tl.fromTo(
        px,
        { opacity: 0, scale: 0, transformOrigin: "center" },
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: { each: 0.018, from: "random" },
          ease: "back.out(1.6)"
        },
        0.95
      );
    }

    // 4. Nom de marque
    if (word) {
      tl.to(word, { opacity: 1, duration: 0.5, letterSpacing: "0.35em" }, 1.7);
    }

    // 5. Rideau
    tl.add(finishIntro, 2.3);
  }

  /* ================================================================
     HERO — titre mot à mot, pixels flottants, parallax curseur
     ================================================================ */
  function initHero() {
    var DT = window.DT;
    var hero = document.querySelector(".hero");
    if (!hero) return;

    var gsap = DT.gsap;
    var title = hero.querySelector(".hero__title");
    var kicker = hero.querySelector(".hero__kicker");
    var sub = hero.querySelector(".hero__sub");
    var actions = hero.querySelector(".hero__actions");
    var meta = hero.querySelector(".hero__meta");

    if (DT.reducedMotion || !gsap) {
      [title, kicker, sub, actions, meta].forEach(function (el) {
        if (el) { el.style.opacity = "1"; el.style.transform = "none"; }
      });
      return;
    }

    // Découpage du titre en lignes/mots masqués
    var words = title ? title.querySelectorAll(".hero__title .word, .hero__title .line") : [];
    var lines = title ? title.querySelectorAll(".hero__title .line") : [];

    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(kicker, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.2);

    if (lines.length) {
      lines.forEach(function (line) {
        var lineWords = line.querySelectorAll(".word");
        tl.fromTo(
          lineWords,
          { yPercent: 115, rotate: 3 },
          { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.09, ease: "power4.out" },
          "<0.1"
        );
      });
    }

    tl.fromTo(sub, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.5");
    tl.fromTo(actions, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.7");
    tl.fromTo(meta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");
    tl.fromTo(hero.querySelector(".hero__scrollcue"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.3");

    /* Parallax au scroll : le hero se dissout doucement */
    if (DT.ScrollTrigger) {
      gsap.to(hero.querySelector(".hero__inner"), {
        yPercent: -12,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    /* Interaction curseur : parallaxe douce des pixels flottants */
    if (!DT.isTouch && gsap) {
      var floats = hero.querySelectorAll(".float-px");
      var depth = [];
      floats.forEach(function (el, i) {
        depth.push({ el: el, d: 0.02 + (i % 5) * 0.015 });
      });
      window.addEventListener("mousemove", function (e) {
        var nx = (e.clientX / window.innerWidth - 0.5) * 2;
        var ny = (e.clientY / window.innerHeight - 0.5) * 2;
        depth.forEach(function (item) {
          gsap.to(item.el, {
            x: nx * 40 * item.d * 10,
            y: ny * 40 * item.d * 10,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto"
          });
        });
      }, { passive: true });
    }
  }

  /* ================================================================
     SÉQUENCE 1 — DIGITALISATION (pin + progression scrub)
     ================================================================ */
  function initDigitalisation() {
    var DT = window.DT;
    var section = document.querySelector("[data-sequence='digitalisation']");
    if (!section || DT.reducedMotion || !DT.gsap || !DT.ScrollTrigger) return;

    var gsap = DT.gsap;
    var stage = section.querySelector(".seq__stage");
    var items = section.querySelectorAll(".seq__chip");
    if (!stage || !items.length) return;

    // Position de départ éparpillée, état final : grille ordonnée
    var final = [];
    items.forEach(function (chip, i) {
      var r = Math.floor(i / 4);
      var c = i % 4;
      final.push({ x: c * 25 - 37.5, y: r * 25 - 25, chip: chip });
      gsap.set(chip, {
        x: (Math.random() - 0.5) * 160,
        y: (Math.random() - 0.5) * 160,
        rotation: (Math.random() - 0.5) * 50,
        opacity: 0.15,
        scale: 0.7
      });
    });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=220%",
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    // Le titre de scène reste, les chips s'assemblent
    tl.to(items, {
      opacity: 1,
      scale: 1,
      duration: 1,
      stagger: 0.15,
      ease: "power2.out"
    });

    final.forEach(function (f) {
      tl.to(f.chip, {
        x: f.x + "%",
        y: f.y + "%",
        rotation: 0,
        duration: 1.4,
        ease: "power3.inOut"
      }, "<0.2");
    });

    // Transition vers la suite : le stage se dissout légèrement
    tl.to(stage, { opacity: 0.25, duration: 0.8 }, ">-0.4");
  }

  /* ================================================================
     SÉQUENCE 2 — GESTION (révélation horizontale scrub)
     ================================================================ */
  function initGestion() {
    var DT = window.DT;
    var section = document.querySelector("[data-sequence='gestion']");
    if (!section || DT.reducedMotion || !DT.gsap || !DT.ScrollTrigger) return;

    var gsap = DT.gsap;
    var panels = section.querySelectorAll(".seq__panel");
    var track = section.querySelector(".seq__track");
    if (!panels.length || !track) return;

    // Défilement horizontal contrôlé par le scroll vertical
    gsap.to(track, {
      x: function () {
        var dist = Math.max(0, track.scrollWidth - window.innerWidth + 64);
        return -dist;
      },
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: function () {
          return "+=" + (track.scrollWidth * 0.9);
        },
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  }

  /* ================================================================
     FOOTER — reconstruction du logo à la clôture
     ================================================================ */
  function initFooterScene() {
    var DT = window.DT;
    var scene = document.querySelector("[data-footer-scene]");
    if (!scene || DT.reducedMotion || !DT.gsap || !DT.ScrollTrigger) return;

    var gsap = DT.gsap;
    var px = scene.querySelectorAll(".logo-px");

    gsap.fromTo(
      px,
      { opacity: 0.12, scale: 0.6 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: { each: 0.02, from: "random" },
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: scene,
          start: "top 75%",
          once: true
        }
      }
    );
  }

  /* ================================================================
     PARALLAXE GÉNÉRIQUE [data-parallax]
     ================================================================ */
  function initParallax() {
    var DT = window.DT;
    if (DT.reducedMotion || !DT.gsap || !DT.ScrollTrigger) return;

    document.querySelectorAll("[data-parallax]").forEach(function (el) {
      var speed = parseFloat(el.dataset.parallax) || 0.15;
      DT.gsap.to(el, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") || el,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }

  /* ================================================================ */
  function init() {
    var DT = window.DT;

    // Intro d'abord : elle pilote le démarrage visuel
    runIntro(function () {
      initHero();
      initDigitalisation();
      initGestion();
      initFooterScene();
      initParallax();
      if (DT.ScrollTrigger) ScrollTrigger.refresh();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
