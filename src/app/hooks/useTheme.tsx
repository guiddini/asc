export const useTheme = () => {
  const localLang = localStorage.getItem("i18nConfig");
  const userLang: {
    selectedLang: string;
  } = JSON.parse(localLang);

  const isRtl = userLang?.selectedLang === "ar" ? true : false;

  const theme = localStorage.getItem("kt_theme_mode_value");
  const isDarkTheme = false;

  return {
    theme,
    isDarkTheme,
    isRtl,
    userLang,
  };
};
