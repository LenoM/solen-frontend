import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Layout from "../../components/default-page";

const url = import.meta.env.VITE_API_URL + "/auth/login";

const RequireAuth = () => {  
  if (!isLoggedIn() || isExpired()) {
    const location = useLocation();
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Layout />;
};

const doLogIn = async (email: string, password: string) => {
  const body: BodyInit = JSON.stringify({
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

  if (authToken.access_token && authToken.email) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", authToken.email);
    localStorage.setItem("accessToken", authToken.access_token);
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

  localStorage.clear();

  return true;
};

const isLoggedIn = (): boolean => {
  return Boolean(localStorage.getItem("isLoggedIn")) === true;
};

export default RequireAuth;

export { isExpired, doLogIn, isLoggedIn };
