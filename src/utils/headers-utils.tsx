import useLogin from "@/features/login/useLogin";
import { Navigate } from "react-router-dom";

const getHeader = () => {
  const login = useLogin();
  const token = localStorage.getItem("accessToken");

  if (login.isExpired()) {
    <Navigate to={"/login"} />;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return headers;
};

export { getHeader };
