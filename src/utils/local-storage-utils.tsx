import { jwtDecode } from "jwt-decode";

export const isLoggedIn = (): boolean => {
  return Boolean(localStorage.getItem("isLoggedIn")) === true;
};

export const setToken = (token: string) => {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("accessToken", token);
};

export const isExpired = (): boolean => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    const decoded = jwtDecode(token);

    if (decoded && decoded.exp) {
      const expired = decoded.exp * 1000 < Date.now();

      if (!expired) {
        return false;
      }
    }
  }

  localStorage.clear();

  return true;
};
