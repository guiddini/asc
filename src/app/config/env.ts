const useEnv = false;

export const env = {
  i18nConfigKey: useEnv
    ? import.meta.env.VITE_APP_I18N_CONFIG_KEY
    : "i18nConfig",
  pusherAppKey: useEnv
    ? import.meta.env.VITE_APP_PUSHER_APP_KEY
    : "ec4e26dcaa1f65bfbd78",
  pusherHost: useEnv ? import.meta.env.VITE_APP_PUSHER_HOST : "eu",
  baseLayoutConfigKey: useEnv
    ? import.meta.env.VITE_APP_BASE_LAYOUT_CONFIG_KEY
    : "LayoutConfig",
  baseUrl: useEnv
    ? import.meta.env.VITE_APP_BASE_URL
    : "https://asc.api.eventili.com",
  apiUrl: useEnv
    ? import.meta.env.VITE_APP_API_URL
    : "https://asc.api.eventili.com/api",
  httpApiUrl: useEnv
    ? import.meta.env.VITE_APP_HTTP_API_URL
    : "http://asc.api.eventili.com/api",
  storageUrl: useEnv
    ? import.meta.env.VITE_APP_STORAGE_URL
    : "https://asc.api.eventili.com/storage",

  encryptionKey: useEnv ? import.meta.env.VITE_APP_ENCRYPTION_KEY : "asc-2025",
};
