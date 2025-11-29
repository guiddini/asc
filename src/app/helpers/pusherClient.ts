import Pusher from "pusher-js";
import { getAuth } from "../modules/auth/core/AuthHelpers";
import { env } from "../config/env";

let instance: Pusher | null = null;

function createInstance(): Pusher {
  // Access Vite environment variables correctly
  const key = env.pusherAppKey;
  const cluster = env.pusherHost;
  const apiUrl = env.baseUrl;
  const token = getAuth();

  if (!key) {
    throw new Error(
      "Pusher APP KEY missing. Set `VITE_APP_PUSHER_APP_KEY` in your .env file."
    );
  }

  // Enable verbose logs in dev for easier troubleshooting
  if (import.meta.env?.DEV) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Pusher.logToConsole = true;
  }

  return new Pusher(key, {
    cluster,
    forceTLS: true,
    authEndpoint: `${apiUrl}/broadcasting/auth`,
    auth: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });
}

export function getPusher(): Pusher {
  if (!instance) instance = createInstance();
  return instance;
}

export function resetPusher(): void {
  if (instance) {
    try {
      instance.disconnect();
    } catch (_) {}
  }
  instance = null;
}
