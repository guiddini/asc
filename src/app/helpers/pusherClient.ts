import Pusher from "pusher-js";
import { getAuth } from "../modules/auth/core/AuthHelpers";

let instance: Pusher | null = null;

function createInstance(): Pusher {
  // Access Vite environment variables correctly
  const key = import.meta.env.VITE_APP_PUSHER_APP_KEY || "ec4e26dcaa1f65bfbd78";
  const cluster = import.meta.env.VITE_APP_PUSHER_CLUSTER || "eu";
  const apiUrl = "https://asc.api.eventili.com";
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
