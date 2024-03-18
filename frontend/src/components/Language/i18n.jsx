// i18n.js ou i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "../locale/en.json";
import translationPT from "../locale/pt.json";
import translationES from "../locale/es.json";

i18n
  .use(initReactI18next) // inicializa o i18n e configura o uso do react-i18next
  .init({
    resources: {
      en: {
        translation: translationEN,
      },
      pt: {
        translation: translationPT,
      },
      es: {
        translation: translationES,
      },
    },
    lng: "pt-BR", // define o idioma padrão
    fallbackLng: "pt-BR", // define o idioma de fallback
    interpolation: {
      escapeValue: false, // Not needed for react as it escapes by default
    },
  });

export default i18n;
