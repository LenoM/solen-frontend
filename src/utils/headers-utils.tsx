import { isExpired, isLoggedIn } from "@/utils/local-storage-utils";
import { useNavigate } from "react-router-dom";

const getHeader = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  if (isExpired() || !isLoggedIn()) {
    navigate("/login");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return headers;
};

export { getHeader };
