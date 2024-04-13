import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorPage } from "@/components/error-page"
import App from "./App.jsx";
import "./assets/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<ErrorPage />}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
