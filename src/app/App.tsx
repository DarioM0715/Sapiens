import { AppProviders } from "./providers";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";
import { ErrorBoundary } from "@/shared/ErrorBoundary";

export const App = () => {
  return (
    <AppProviders>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </AppProviders>
  );
};
