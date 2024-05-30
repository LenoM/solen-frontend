import { Navigate, useLocation } from "react-router-dom";
import useLogin from "@/hooks/useLogin";

import Layout from "@/components/default-page";

const RequireAuth = () => {
  const login = useLogin();

  if (!login.isLoggedIn() || login.isExpired()) {
    const location = useLocation();
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Layout />;
};

export default RequireAuth;
