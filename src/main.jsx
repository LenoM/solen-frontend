import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/sonner";
import { ErrorPage } from "@/components/error-page";
import { queryClient } from "@/lib/react-query";
import App from "./App.jsx";
import "./assets/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<ErrorPage />}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
        <Toaster />
    </ErrorBoundary>
  </React.StrictMode>
);
