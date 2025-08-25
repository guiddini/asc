import "./_metronic/i18n/i18n";
import { createRoot } from "react-dom/client";
import { Chart, registerables } from "chart.js";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
// Apps
import "./_metronic/assets/sass/style.react.scss";
import "./_metronic/assets/fonticon/fonticon.css";
import "./_metronic/assets/keenicons/duotone/style.css";
import "./_metronic/assets/keenicons/outline/style.css";
import "./_metronic/assets/keenicons/solid/style.css";
/**
 * TIP: Replace this style import with rtl styles to enable rtl mode
 *
 * import './_metronic/assets/css/style.rtl.css'
 **/
import "./_metronic/assets/sass/style.scss";
import "./_metronic/assets/sass/plugins.scss";
import { AppRoutes } from "./app/routing/AppRoutes";
import { AuthProvider } from "./app/modules/auth";
/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
/**
 * Inject Metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
// setupAxios(axios);
Chart.register(...registerables);

// redux toolkit and persistence
import store from "./app/features/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();
import { MetronicI18nProvider } from "./_metronic/i18n/Metronici18n";
import { AbilityContext } from "./app/utils/ability-context";
import ability from "./app/utils/ability";
const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={queryClient}>
      <MetronicI18nProvider>
        <Provider store={store}>
          <AuthProvider>
            <AbilityContext.Provider value={ability}>
              <AppRoutes />
              <Toaster />
            </AbilityContext.Provider>
          </AuthProvider>
        </Provider>
      </MetronicI18nProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
