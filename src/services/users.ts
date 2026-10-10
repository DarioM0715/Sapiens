import { apiServer } from "./apiServer";
import type { User } from "@/types/users";
import type { CursorParams, UsersPage } from "@/types/pagination";

export const USER_PAGE_SIZE = 10;

export const fetchUser = async (id: string | number): Promise<User> => {
  const { data } = await apiServer.get<{ user: User }>(`/auth/users/${id}`);
  return data.user;
};

export const fetchUsers = async (params: CursorParams = {}): Promise<UsersPage> => {
  const { data } = await apiServer.get<UsersPage>("/auth/users", {
    params: { ...params, limit: params.limit ?? USER_PAGE_SIZE },
  });
  return data;
};