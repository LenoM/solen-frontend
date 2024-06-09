import { Navigate, useLocation } from "react-router-dom";

import Layout from "@/components/default-page";
import { isExpired, isLoggedIn } from "@/utils/local-storage-utils";

const RequireAuth = () => {
  if (!isLoggedIn() || isExpired()) {
    const location = useLocation();
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Layout />;
};

export default RequireAuth;
