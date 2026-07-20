import { createContext, useContext, useState } from "react";
import { apiServer } from "@/services/apiServer";
import profileimage from "@/assets/images/048617ceb68b40a45847078db347ba59.png";
import backgroundimage from "@/assets/images/image.png";

interface AuthContextProps {
  user: any;
  setUser: any;
  login: any;
  singup: any;
  logout: any;
  verifyUser: any;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  login: () => {},
  singup: () => {},
  logout: () => {},
  verifyUser: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState({
    id: 1,
    name: "Dario Martinez",
    email: "dario@gmail.com",
    password: "123456",
    avatar: profileimage,
    background: backgroundimage,
    note: "Este es mi user",
    theme: "light",
  });

  const login = async (data: any) => {
    try {
      const response = await apiServer.post("/auth/login", data);
      setUser(response.data);
    } catch (error) {
      console.log("Error al login");
    }
  };

  const singup = async (data: any) => {
    try {
      const response = await apiServer.post("/auth/signup", data);
      setUser(response.data);
    } catch (error) {
      console.log("Error al signup");
    }
  };

  const logout = async () => {
    try {
      await apiServer.post("/auth/logout");
      // setUser(null);
    } catch (error) {
      console.log("Error al logout");
    }
  };

  const verifyUser = async () => {
    try {
      await apiServer.get("/auth/verify");
    } catch (error) {
      console.log("Error al verificar usuario");
    }
  };

  return <AuthContext.Provider value={{ user, setUser, login, singup, logout, verifyUser }}>{children}</AuthContext.Provider>;
};
