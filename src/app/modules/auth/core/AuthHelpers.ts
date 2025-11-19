import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const AUTH_COOKIE_KEY = "asc-user";
const SECRET_KEY = "ASC";
const COOKIE_OPTIONS = { secure: true, sameSite: "Strict", expires: 7 };

const setAuth = (auth: string) => {
  try {
    const encryptedAuth = CryptoJS.AES.encrypt(auth, SECRET_KEY).toString(); // Encrypt the token
    Cookies.set(AUTH_COOKIE_KEY, encryptedAuth, COOKIE_OPTIONS); // Save the encrypted token to cookies
  } catch (error) {
    console.error("AUTH COOKIE ENCRYPT ERROR", error);
  }
};

const getAuth = (): string | undefined => {
  try {
    const encryptedAuth = Cookies.get(AUTH_COOKIE_KEY); // Retrieve the encrypted value
    if (encryptedAuth) {
      const bytes = CryptoJS.AES.decrypt(encryptedAuth, SECRET_KEY); // Decrypt the value
      const originalAuth = bytes.toString(CryptoJS.enc.Utf8); // Convert bytes to original string
      return originalAuth; // Return the decrypted token
    }
  } catch (error) {
    console.error("AUTH COOKIE DECRYPT ERROR", error);
  }
};

const removeAuth = () => {
  try {
    Cookies.remove(AUTH_COOKIE_KEY, { secure: true, sameSite: "Strict" });
  } catch (error) {
    console.error("AUTH COOKIE REMOVE ERROR", error);
  }
};

export { setAuth, getAuth, removeAuth, AUTH_COOKIE_KEY };
