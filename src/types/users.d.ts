export type Role = {
  id: number;
  name: "alumno" | "profesor" | "moderador";
};

export type User = {
  id: number;
  name: string;
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  sex?: "masculino" | "femenino";
  background?: string;
  note?: string;
  theme?: string;
  role?: Role;
  options?: Options;
};