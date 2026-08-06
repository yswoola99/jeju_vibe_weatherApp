import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import { LocationProvider } from "@/context/LocationContext";
import { UnitProvider } from "@/context/UnitContext";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          <UnitProvider>
            <TooltipProvider>
              <App />
            </TooltipProvider>
          </UnitProvider>
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
