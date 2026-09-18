import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFollowers, fetchFollowing, followUser, unfollowUser } from "@/services/follows";

export const useFollowers = (id?: string | number) => {
  return useQuery({
    queryKey: ["followers", id],
    queryFn: () => fetchFollowers(id as string | number),
    enabled: !!id,
  });
};

export const useFollowing = (id?: string | number) => {
  return useQuery({
    queryKey: ["following", id],
    queryFn: () => fetchFollowing(id as string | number),
    enabled: !!id,
  });
};

const useFollowReaction = (mutationFn: (id: string | number) => Promise<{ isFollowing: boolean }>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => mutationFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });
};

export const useFollowUser = () => useFollowReaction(followUser);
export const useUnfollowUser = () => useFollowReaction(unfollowUser);
