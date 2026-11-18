/**
 * DIGITALIS TOGO — Configuration centrale du site.
 * Toutes les informations "à confirmer" sont centralisées ici.
 * Ne jamais exposer de clé API ou de secret dans ce fichier public.
 */
window.DIGITALIS_CONFIG = {
  brand: {
    name: "DIGITALIS TOGO",
    legalName: "DIGITALIS TOGO — SARL",
    slogan: "Votre succès, notre mission",
    baseline: "Cabinet de digitalisation et de gestion innovante d'entreprise",
    location: "Lomé, Togo",
    createdAt: "24 juin 2024",
    activityStart: "17 mai 2024",
    cfeNumber: "07575PM2024"
  },

  contact: {
    email: "digitalistogo@gmail.com",
    phones: ["+228 90 88 44 20", "+228 70 15 95 21", "+228 99 95 42 40"],
    // Adresse exacte à confirmer — laisser null pour masquer l'affichage
    address: null,
    // Horaires à confirmer — laisser null pour masquer l'affichage
    hours: null,
    // Endpoint du formulaire : service externe sécurisé (ex. Formspree, endpoint serverless).
    // Laisser vide : le formulaire bascule en mode "mailto" de secours.
    formEndpoint: "",
    formFallbackEmail: "digitalistogo@gmail.com"
  },

  social: {
    facebook: "",   // URL à renseigner — ex. "https://facebook.com/digitalistogo"
    linkedin: ""    // URL à renseigner — ex. "https://linkedin.com/company/digitalis-togo"
  },

  seo: {
    // Nom de domaine définitif à confirmer
    domain: "",
    defaultLang: "fr",
    langs: ["fr", "en"]
  },

  // Logo officiel : remplacer assets/logo/logo.svg par le fichier source
  // dès qu'il est fourni. Le SVG actuel est une interprétation fidèle
  // de la description (monogramme DT, vert #6AB04C, bleu #1E4DA1, pixels).
  logo: {
    path: "assets/logo/logo.svg",
    hasOfficialFile: false
  }
};
