import { createContext, useContext, useEffect, useState } from "react";
import { apiServer } from "@/services/apiServer";

interface AuthContextProps {
  user: any;
  setUser: any;
  login: any;
  singup: any;
  logout: any;
  verifyUser: any;
  updateUser: any;
  verifyEmail: any;
  resendCode: any;
  setPassword: any;
  acceptTerms: any;
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  login: () => {},
  singup: () => {},
  logout: () => {},
  verifyUser: () => {},
  updateUser: () => {},
  verifyEmail: () => {},
  resendCode: () => {},
  setPassword: () => {},
  acceptTerms: () => {},
  isLoadingAuth: true,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const login = async (data: any) => {
    try {
      const response = await apiServer.post("/auth/login", data);
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("Error al login", error);
      throw error;
    }
  };

  const singup = async (data: any) => {
    try {
      const response = await apiServer.post("/auth/signup", data);
      return response.data;
    } catch (error) {
      console.error("Error al signup", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiServer.post("/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Error al logout", error);
    }
  };

  const verifyUser = async () => {
    try {
      const response = await apiServer.get("/auth/verify");
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("Error al verificar usuario", error);
      setUser(null);
    }
  };

  const verifyEmail = async (data: any) => {
    try {
      const response = await apiServer.post("/auth/verify-email", data);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error("Error al verificar el email", error);
      throw error;
    }
  };

  const resendCode = async (data: any) => {
    try {
      const response = await apiServer.post("/auth/resend-code", data);
      return response.data;
    } catch (error) {
      console.error("Error al reenviar el código", error);
      throw error;
    }
  };

  const setPassword = async (data: any) => {
    try {
      const response = await apiServer.post("/auth/set-password", data);
      return response.data;
    } catch (error) {
      console.error("Error al configurar la contraseña", error);
      throw error;
    }
  };

  const acceptTerms = async () => {
    try {
      const response = await apiServer.post("/auth/accept-terms", { accepted: true });
      setUser((prev: any) => (prev ? { ...prev, termsAccepted: true } : prev));
      return response.data;
    } catch (error) {
      console.error("Error al aceptar términos", error);
      throw error;
    }
  };

  const updateUser = async (data: any) => {
    try {
      const response = await apiServer.put("/auth/users/me", data);
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("Error al actualizar usuario", error);
      throw error;
    }
  };

  useEffect(() => {
    verifyUser().finally(() => setIsLoadingAuth(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, singup, logout, verifyUser, updateUser, verifyEmail, resendCode, setPassword, acceptTerms, isLoadingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};