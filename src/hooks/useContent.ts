import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPosts,
  fetchUserReplies,
  fetchFollowingPosts,
  fetchSavedPosts,
  fetchLikedPosts,
  fetchPost,
  createPost,
  likePost,
  dislikePost,
  savePost,
  fetchReplies,
  addReply,
} from "@/services/content";
import type { CreatePostPayload } from "@/services/content";

export const usePosts = (userId?: string | number) => {
  return useQuery({
    queryKey: ["posts", userId ?? null],
    queryFn: () => fetchPosts(userId),
  });
};

export const useUserReplies = (userId?: string | number) => {
  return useQuery({
    queryKey: ["replies", "user", userId],
    queryFn: () => fetchUserReplies(userId as string | number),
    enabled: !!userId,
  });
};

export const useFollowingPosts = (enabled = true) => {
  return useQuery({
    queryKey: ["posts", "following"],
    queryFn: () => fetchFollowingPosts(),
    enabled,
  });
};

export const useSavedPosts = (enabled = true) => {
  return useQuery({
    queryKey: ["posts", "saved"],
    queryFn: () => fetchSavedPosts(),
    enabled,
  });
};

export const useLikedPosts = (userId?: string | number) => {
  return useQuery({
    queryKey: ["posts", "liked", userId ?? null],
    queryFn: () => fetchLikedPosts(userId),
  });
};

export const usePost = (id?: string | number) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id as string | number),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

const usePostReaction = (mutationFn: (id: string | number) => Promise<unknown>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => mutationFn(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["replies"] });
    },
  });
};

export const useLikePost = () => usePostReaction(likePost);
export const useDislikePost = () => usePostReaction(dislikePost);

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => savePost(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
  });
};

export const useReplies = (postId?: string | number) => {
  return useQuery({
    queryKey: ["replies", postId],
    queryFn: () => fetchReplies(postId as string | number),
    enabled: !!postId,
  });
};

export const useAddReply = (postId?: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => addReply(postId as string | number, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};