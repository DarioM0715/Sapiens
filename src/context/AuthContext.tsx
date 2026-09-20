import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiServer } from "@/services/apiServer";
import type { User } from "@/types/users";
import type { LOGIN_FORM, PASSWORD_FORM, REGISTER_FORM } from "@/types/formstypes";

export type SignupPayload = REGISTER_FORM & { sex: User["sex"] };
export type VerifyEmailPayload = { email: string; code: string };
export type ResendCodePayload = { email: string };
export type PasswordPayload = Pick<PASSWORD_FORM, "password">;

type AuthResponse = { user: User };
type SignupResponse = { message?: string; needsEmailVerification?: boolean };
type Result = { message?: string };

interface AuthContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  login: (data: LOGIN_FORM) => Promise<User>;
  singup: (data: SignupPayload) => Promise<SignupResponse>;
  logout: () => Promise<void>;
  verifyUser: () => Promise<User | null>;
  updateUser: (data: Partial<User>) => Promise<User>;
  verifyEmail: (data: VerifyEmailPayload) => Promise<AuthResponse>;
  resendCode: (data: ResendCodePayload) => Promise<Result>;
  setPassword: (data: PasswordPayload) => Promise<Result>;
  acceptTerms: () => Promise<Result>;
  isLoadingAuth: boolean;
}

const defaultContext = {
  user: null,
  setUser: () => {},
  login: async () => ({} as User),
  singup: async () => ({} as SignupResponse),
  logout: async () => {},
  verifyUser: async () => null,
  updateUser: async () => ({} as User),
  verifyEmail: async () => ({} as AuthResponse),
  resendCode: async () => ({} as Result),
  setPassword: async () => ({} as Result),
  acceptTerms: async () => ({} as Result),
  isLoadingAuth: true,
} as AuthContextProps;

const AuthContext = createContext<AuthContextProps>(defaultContext);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const login = async (data: LOGIN_FORM) => {
    try {
      const response = await apiServer.post("/auth/login", data);
      setUser(response.data.user as User);
      return response.data.user as User;
    } catch (error) {
      console.error("Error al login", error);
      throw error;
    }
  };

  const singup = async (data: SignupPayload) => {
    try {
      const response = await apiServer.post("/auth/signup", data);
      return response.data as SignupResponse;
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
      setUser(response.data.user as User);
      return response.data.user as User;
    } catch (error) {
      console.error("Error al verificar usuario", error);
      setUser(null);
      return null;
    }
  };

  const verifyEmail = async (data: VerifyEmailPayload) => {
    try {
      const response = await apiServer.post("/auth/verify-email", data);
      setUser(response.data.user as User);
      return response.data as AuthResponse;
    } catch (error) {
      console.error("Error al verificar el email", error);
      throw error;
    }
  };

  const resendCode = async (data: ResendCodePayload) => {
    try {
      const response = await apiServer.post("/auth/resend-code", data);
      return response.data as Result;
    } catch (error) {
      console.error("Error al reenviar el código", error);
      throw error;
    }
  };

  const setPassword = async (data: PasswordPayload) => {
    try {
      const response = await apiServer.post("/auth/set-password", data);
      return response.data as Result;
    } catch (error) {
      console.error("Error al configurar la contraseña", error);
      throw error;
    }
  };

  const acceptTerms = async () => {
    try {
      const response = await apiServer.post("/auth/accept-terms", { accepted: true });
      setUser((prev) => (prev ? { ...prev, termsAccepted: true } : prev));
      return response.data as Result;
    } catch (error) {
      console.error("Error al aceptar términos", error);
      throw error;
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const response = await apiServer.put("/auth/users/me", data);
      setUser(response.data.user as User);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return response.data.user as User;
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