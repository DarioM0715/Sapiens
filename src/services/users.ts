import { apiServer } from "./apiServer";
import type { User } from "@/types/users";

export const fetchUser = async (id: string | number): Promise<User> => {
  const { data } = await apiServer.get<{ user: User }>(`/auth/users/${id}`);
  return data.user;
};

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await apiServer.get<{ users: User[] }>("/auth/users");
  return data.users;
};
