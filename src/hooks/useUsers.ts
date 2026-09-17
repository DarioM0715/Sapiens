import { useQuery } from "@tanstack/react-query";
import { fetchUser, fetchUsers } from "@/services/users";

export const useUser = (id?: string | number, enabled = true) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id as string | number),
    enabled: enabled && !!id,
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
