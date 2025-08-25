import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enMessages from "./messages/en.json";
import frMessages from "./messages/fr.json";
import arMessages from "./messages/ar.json";

const resources = {
  ar: {
    translation: arMessages,
  },
  fr: {
    translation: frMessages,
  },
  en: {
    translation: enMessages,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "fr",
  fallbackLng: "fr",
  compatibilityJSON: "v4",
  interpolation: {
    escapeValue: false,
    alwaysFormat: true,
  },
});

export default i18n;
