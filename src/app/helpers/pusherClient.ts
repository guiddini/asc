import Pusher from "pusher-js";
import { getAuth } from "../modules/auth/core/AuthHelpers";

let instance: Pusher | null = null;

function createInstance(): Pusher {
  const key = "ec4e26dcaa1f65bfbd78";
  const cluster = "eu";
  const apiUrl = "https://asc.api.eventili.com";
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
