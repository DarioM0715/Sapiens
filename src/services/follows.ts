import { apiServer } from "./apiServer";
import type { User } from "@/types/users";

export const followUser = async (id: string | number): Promise<{ isFollowing: boolean }> => {
  const { data } = await apiServer.post<{ isFollowing: boolean }>(`/follows/${id}`);
  return data;
};

export const unfollowUser = async (id: string | number): Promise<{ isFollowing: boolean }> => {
  const { data } = await apiServer.delete<{ isFollowing: boolean }>(`/follows/${id}`);
  return data;
};

export const fetchFollowers = async (id: string | number): Promise<User[]> => {
  const { data } = await apiServer.get<{ users: User[] }>(`/follows/${id}/followers`);
  return data.users;
};

export const fetchFollowing = async (id: string | number): Promise<User[]> => {
  const { data } = await apiServer.get<{ users: User[] }>(`/follows/${id}/following`);
  return data.users;
};
