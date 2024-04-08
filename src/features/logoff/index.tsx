import { Navigate, useLocation } from "react-router-dom";

export default function Logoff() {
  const location = useLocation();
  localStorage.clear();
  return <Navigate to="/login" state={{ from: location }} />;
}