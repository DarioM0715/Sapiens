import { AppProviders } from "./providers";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";

export const App = () => {
  return (
    <AppProviders>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </AppProviders>
  );
};
