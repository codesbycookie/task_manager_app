import Cookies from "js-cookie";

export const setCookie = (key, value, options = {}) => {
  try {
    const defaultOptions = { expires: 1, ...options };

    Cookies.set(key, JSON.stringify(value), defaultOptions);
  } catch (error) {
    console.error(`Error setting cookie "${key}":`, error);
  }
};

export const getCookie = (key) => {
  try {
    const value = Cookies.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error getting cookie "${key}":`, error);
    return null;
  }
};

export const removeCookie = (key, options = {}) => {
  try {
    Cookies.remove(key, options);
  } catch (error) {
    console.error(`Error removing cookie "${key}":`, error);
  }
};
