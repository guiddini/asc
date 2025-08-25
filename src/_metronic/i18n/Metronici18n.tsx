/* eslint-disable react-refresh/only-export-components */
import { FC, createContext, useContext } from "react";
import { WithChildren } from "../helpers";
import i18next from "i18next";

const I18N_CONFIG_KEY =
  import.meta.env.VITE_APP_I18N_CONFIG_KEY || "i18nConfig";

type Props = {
  selectedLang: "en" | "fr" | "ar";
};
const initialState: Props = {
  selectedLang: "fr",
};

function getConfig(): Props {
  const ls = localStorage.getItem(I18N_CONFIG_KEY);
  if (ls) {
    const language = JSON.parse(ls) as Props;
    try {
      i18next.changeLanguage(language.selectedLang);
      return JSON.parse(ls) as Props;
    } catch (er) {
      i18next.changeLanguage("fr");
      console.error(er);
    }
  } else {
    i18next.changeLanguage("fr");
  }
  return initialState;
}

// Side effect
export function setLanguage(lang: string) {
  localStorage.setItem(I18N_CONFIG_KEY, JSON.stringify({ selectedLang: lang }));
  i18next.changeLanguage(lang);
  window.location.reload();
}

const I18nContext = createContext<Props>(initialState);

const useLang = () => {
  return useContext(I18nContext).selectedLang;
};

const MetronicI18nProvider: FC<WithChildren> = ({ children }) => {
  const lang = getConfig();
  return <I18nContext.Provider value={lang}>{children}</I18nContext.Provider>;
};

export { MetronicI18nProvider, useLang };
