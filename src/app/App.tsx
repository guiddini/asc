import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { LayoutProvider, LayoutSplashScreen } from "../_metronic/layout/core";
import { MasterInit } from "../_metronic/layout/MasterInit";
import { AuthInit } from "./modules/auth";
import { ThemeModeProvider } from "../_metronic/partials";
import "./globale.scss";
import { useTranslation } from "react-i18next";

const App = () => {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <LayoutProvider>
        <ThemeModeProvider>
          <AuthInit>
            <Outlet />
            <MasterInit />
          </AuthInit>
        </ThemeModeProvider>
      </LayoutProvider>
    </Suspense>
  );
};

export { App };
