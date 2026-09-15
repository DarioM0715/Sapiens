import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPosts,
  fetchPost,
  createPost,
  likePost,
  dislikePost,
  fetchComments,
  addComment,
  likeComment,
} from "@/services/content";
import type { CreatePostPayload } from "@/services/content";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
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
    },
  });
};

export const useLikePost = () => usePostReaction(likePost);
export const useDislikePost = () => usePostReaction(dislikePost);

export const useComments = (postId?: string | number) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId as string | number),
    enabled: !!postId,
  });
};

export const useAddComment = (postId?: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => addComment(postId as string | number, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string | number) => likeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};