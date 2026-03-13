// config.js (dans sekhamet-origine/)

/* =========================================================
   CONFIGURATION DE L'APPLICATION
   ========================================================= */

const urlParams = new URLSearchParams(window.location.search);
const appFromUrl = urlParams.get("app");

/* =========================================================
   CONFIGURATION DES PROGRAMMES À AFFICHER
   ========================================================= */

// CHANGER CETTE VARIABLE pour choisir les pages gérées par l'app :
// variables possibles : ["origine", "enveloppe", "emergence"]
// puis quand les paramètres seront entrés "fondement" (pour la mini-app bonus sur la préparation de notre environnement pour bien vivre le programme principal) et éventuellement "envol"
window.ALLOWED_APP_IDS = ["fondation","origine"];
// Les notifications suivent exactement les mêmes pages
window.NOTIFICATION_APP_IDS = window.ALLOWED_APP_IDS;

// CHANGER CETTE VARIABLE pour choisir la PAGE PAR DÉFAUT vers laquelle on est redirigé en cas de soucis :
window.DEFAULT_APP_ID = "origine";
window.TECH_SUPPORT_EMAIL = "contact@sekhamet.com";

// Ordre de progression par défault
window.PROGRAM_FLOW = ["fondation","origine"]

// OneSignal : laisser sur false tant que tu veux seulement les notifs natives
window.ENABLE_ONESIGNAL = false;

// Programme actif
window.APP_ID = window.ALLOWED_APP_IDS.includes(appFromUrl)
  ? appFromUrl
  : window.DEFAULT_APP_ID;


/* =========================================================
   CONFIGURATION DES PROGRAMMES
   ========================================================= */

window.APP_CONFIGS = {
  origine: {
    ID: "origine",
    NAME: "ORIGINE",
    STORAGE_PREFIX: "origine_",
    CACHE_NAME: "origine-pwa-v1",
    ICON_192: "./core/assets/icons/ORIGINE-192.png",
    ICON_512: "./core/assets/icons/ORIGINE-512.png",
    NOTIF_TITLE: "ORIGINE — Défi du jour",
    INSTALL_TITLE: "Installer ORIGINE ?",
    INSTALL_LABEL: "📱 Installer ORIGINE sur l'écran d'accueil",
    MAIN_TITLE: "Vers l'Alimentation consciente",
    BROWSER_TITLE: "ORIGINE - Défi Quotidien",
    TOTAL_DAYS: 21,
    SUPPORT_URL: "https://coaching.sekhamet.com/school/course/origine/"
  },

  enveloppe: {
    ID: "enveloppe",
    NAME: "ENVELOPPE",
    STORAGE_PREFIX: "enveloppe_",
    CACHE_NAME: "enveloppe-pwa-v1",
    ICON_192: "./core/assets/icons/ENVELOPPE-192.png",
    ICON_512: "./core/assets/icons/ENVELOPPE-512.png",
    NOTIF_TITLE: "ENVELOPPE — Défi du jour",
    INSTALL_TITLE: "Installer ENVELOPPE ?",
    INSTALL_LABEL: "📱 Installer ENVELOPPE sur l'écran d'accueil",
    MAIN_TITLE: "Le Corps comme Outil de Retour à Soi",
    BROWSER_TITLE: "ENVELOPPE - Défi Quotidien",
    TOTAL_DAYS: 31,
    SUPPORT_URL: "https://coaching.sekhamet.com/school/course/enveloppe/"
  },

  emergence: {
    ID: "emergence",
    NAME: "EMERGENCE",
    STORAGE_PREFIX: "emergence_",
    CACHE_NAME: "emergence-pwa-v1",
    ICON_192: "./core/assets/icons/EMERGENCE-192.png",
    ICON_512: "./core/assets/icons/EMERGENCE-512.png",
    NOTIF_TITLE: "EMERGENCE — Défi du jour",
    INSTALL_TITLE: "Installer EMERGENCE ?",
    INSTALL_LABEL: "📱 Installer EMERGENCE sur l'écran d'accueil",
    MAIN_TITLE: "Mon Inconscient comme Allié",
    BROWSER_TITLE: "EMERGENCE - Défi Quotidien",
    TOTAL_DAYS: 62,
    SUPPORT_URL: "https://coaching.sekhamet.com/school/course/emergence/"
  },
  fondation: {
    ID: "fondation",
    NAME: "FONDATION",
    STORAGE_PREFIX: "fondation_",
    CACHE_NAME: "fondation-pwa-v1",
    ICON_192: "./core/assets/icons/FONDATION-192.png",
    ICON_512: "./core/assets/icons/FONDATION-512.png",
    NOTIF_TITLE: "FONDATION — Défi du jour",
    INSTALL_TITLE: "Installer FONDATION ?",
    INSTALL_LABEL: "📱 Installer FONDATION sur l'écran d'accueil",
    MAIN_TITLE: "Prépare ton terrain",
    BROWSER_TITLE: "FONDATION - Défi Quotidien",
    TOTAL_DAYS: 7,
    SUPPORT_URL: "https://github.com/Iscobia/base-pwa-coaching/blob/main/data/FONDATION_Support.pdf"
  },
};


/* =========================================================
   CONFIG ACTIVE
   ========================================================= */

window.APP_CONFIG = window.APP_CONFIGS[window.APP_ID] || window.APP_CONFIGS.enveloppe;
