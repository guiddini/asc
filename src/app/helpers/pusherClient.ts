import Pusher from "pusher-js";
import { getAuth } from "../modules/auth/core/AuthHelpers";

let instance: Pusher | null = null;

function createInstance(): Pusher {
  const key = import.meta.env.VITE_APP_PUSHER_APP_KEY as string;
  const cluster = import.meta.env.VITE_APP_PUSHER_HOST as string;
  const apiUrl = import.meta.env.VITE_APP_BASE_URL as string;
  const token = getAuth();

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
