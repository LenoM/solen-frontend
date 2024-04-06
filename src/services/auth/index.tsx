import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Layout from "../../components/default-page";

const url = import.meta.env.VITE_API_URL + "/auth/login";

const RequireAuth = () => {
  const location = useLocation();

  if (!isLoggedIn() || isExpired()) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Layout />;
};

const doLogIn = async (email: string, password: string) => {
  const body = JSON.stringify({
    password,
    email,
  });

  const headers = { "Content-Type": "application/json" };

  const params: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  const authToken = await fetch(url, params).then((resp) => resp.json());

  setData(authToken);
};

const setData = (data: any) => {
  if (data.access_token && data.email) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", data.email);
    localStorage.setItem("accessToken", data.access_token);
  }
};

const isExpired = (): boolean => {
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

  logOut();
  return true;
};

const isLoggedIn = (): boolean => {
  return Boolean(localStorage.getItem("isLoggedIn")) === true;
};

const logOut = () => {
  localStorage.clear();
};

export default RequireAuth;

export { isExpired, doLogIn, isLoggedIn, logOut };
