import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchUser, fetchUsers, USER_PAGE_SIZE } from "@/services/users";
import type { User } from "@/types/users";
import type { CursorParams } from "@/types/pagination";

export const useUser = (id?: string | number, enabled = true) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id as string | number),
    enabled: enabled && !!id,
  });
};

export const useUsers = (params: CursorParams = {}) => {
  const query = useInfiniteQuery({
    queryKey: ["users", params.limit ?? USER_PAGE_SIZE],
    queryFn: ({ pageParam }) => fetchUsers({ ...params, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const { data, ...rest } = query;
  return { ...rest, data: (data?.pages.flatMap((page) => page.users) ?? []) as User[] };
};