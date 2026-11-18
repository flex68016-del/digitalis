/* ============================================================
   DIGITALIS TOGO — contact.js
   Formulaire : validation, honeypot, endpoint ou mailto
   Aucune clé API exposée — l'endpoint est dans config.js
   ============================================================ */
(function () {
  "use strict";

  function init() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var cfg = (window.DIGITALIS_CONFIG && window.DIGITALIS_CONFIG.contact) || {};
    var endpoint = cfg.formEndpoint || "";
    var fallbackEmail = cfg.formFallbackEmail || "digitalistogo@gmail.com";

    var errorEl = form.querySelector(".form__error");
    var successEl = form.querySelector(".form__success");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot : bot → on fait semblant de réussir
      var hp = form.querySelector(".hp-field input");
      if (hp && hp.value) {
        showSuccess();
        return;
      }

      // Validation côté client (le serveur doit revalider)
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        field.setCustomValidity("");
        if (!field.value.trim() || (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value))) {
          field.setCustomValidity("Champ requis valide");
          valid = false;
        }
      });
      if (!valid) {
        form.reportValidity();
        return;
      }

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });

      if (errorEl) errorEl.classList.remove("is-visible");

      if (!endpoint) {
        // Mode secours : ouvre le client mail
        var subject = encodeURIComponent("Demande de contact — " + (data.name || ""));
        var body = encodeURIComponent(
          "Nom : " + (data.name || "") + "\n" +
          "Email : " + (data.email || "") + "\n" +
          "Téléphone : " + (data.phone || "") + "\n\n" +
          (data.message || "")
        );
        window.location.href = "mailto:" + fallbackEmail + "?subject=" + subject + "&body=" + body;
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          showSuccess();
          form.reset();
        })
        .catch(function () {
          if (errorEl) {
            errorEl.textContent = "L'envoi a échoué. Réessayez ou écrivez-nous à " + fallbackEmail + ".";
            errorEl.classList.add("is-visible");
          }
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });

    function showSuccess() {
      if (successEl) successEl.classList.add("is-visible");
      form.classList.add("is-sent");
      var fields = form.querySelector(".form__fields");
      if (fields) fields.style.display = "none";
      if (successEl) successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
