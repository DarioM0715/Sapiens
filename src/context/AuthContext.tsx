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
      setUser(response.data.user);
      return response.data.user;
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
    <AuthContext.Provider value={{ user, setUser, login, singup, logout, verifyUser, updateUser, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
