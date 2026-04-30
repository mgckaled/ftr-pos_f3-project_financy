import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import { Toaster } from "sonner";
import { apolloClient } from "@/lib/apollo";
import { AuthProvider } from "@/contexts/AuthProvider";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <App />
        <Toaster position="bottom-right" richColors duration={4000} />
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>
);
