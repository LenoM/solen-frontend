import { isExpired } from "@/services/auth";
import { Navigate } from "react-router-dom";

const getHeader = () => {
  const token = localStorage.getItem("accessToken");

  if (isExpired()) {
    <Navigate to={"/login"} />;
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  return headers;
};

export { getHeader };
