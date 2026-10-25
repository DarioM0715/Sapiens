import { Options } from "./post";

export type Role = {
  id: number;
  name: "alumno" | "profesor" | "moderador";
};

export type User = {
  id: string | number;
  name: string;
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  sex?: "masculino" | "femenino" | "otro";
  background?: string;
  note?: string;
  theme?: string;
  emailVerified?: boolean;
  role?: Role;
  options?: Options;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
};