import Cookies from "js-cookie";

export const setCookie = (key, value, options = {}) => {
  try {
    const defaultOptions = {
      expires: 1,         // 1 day
      path: "/",          // globally accessible
      sameSite: "Lax",    // prevent cross-site issues
      secure: false,      // important for localhost
      ...options,
    };

    Cookies.set(key, JSON.stringify(value), defaultOptions);
    // console.log(`🍪 [CookieService] Set ${key}:`, value);
  } catch (error) {
    console.error(`❌ Error setting cookie "${key}":`, error);
  }
};

export const getCookie = (key) => {
  try {
    const raw = Cookies.get(key);
    const parsed = raw ? JSON.parse(raw) : null;
    // console.log(`📥 [CookieService] Get ${key}:`, parsed);
    return parsed;
  } catch (error) {
    console.error(`❌ Error getting cookie "${key}":`, error);
    return null;
  }
};

export const removeCookie = (key, options = {}) => {
  try {
    Cookies.remove(key, { path: "/", ...options });
    // console.log(`🧹 [CookieService] Removed ${key}`);
  } catch (error) {
    console.error(`❌ Error removing cookie "${key}":`, error);
  }
};
