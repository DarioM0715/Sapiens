import { apiServer } from "./apiServer";
import type { User } from "@/types/users";

export const fetchUser = async (): Promise<User[]> => {
    const { data } = await apiServer.get<{users: User[] }>("/auth/users");
    console.log(data)
    return data.users
}