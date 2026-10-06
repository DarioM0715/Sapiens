import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import type { Post } from "@/types/post";

type PostsPageResponse = { posts: Post[]; nextCursor: string | null; hasMore: boolean };

const flatten = (query: { data?: { pages: PostsPageResponse[] } }): Post[] =>
  query.data?.pages.flatMap((page) => page.posts) ?? [];

const usePostList = (
  key: readonly unknown[],
  fetchPage: (params: { cursor?: string }) => Promise<PostsPageResponse>,
  enabled = true
) => {
  const query = useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam }) => fetchPage({ cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- data se reemplaza por la version plana
  const { data, ...rest } = query;
  return { ...rest, data: flatten(query) };
};

export const usePosts = (userId?: string | number, enabled = true) =>
  usePostList(["posts", userId ?? null], (params) => fetchPosts({ ...params, userId }), enabled);

export const useUserReplies = (userId?: string | number) =>
  usePostList(["replies", "user", userId], (params) => fetchUserReplies(userId as string | number, params), !!userId);

export const useFollowingPosts = (enabled = true) =>
  usePostList(["posts", "following"], (params) => fetchFollowingPosts(params), enabled);

export const useSavedPosts = (enabled = true) =>
  usePostList(["posts", "saved"], (params) => fetchSavedPosts(params), enabled);

export const useLikedPosts = (userId?: string | number) =>
  usePostList(["posts", "liked", userId ?? null], (params) => fetchLikedPosts(userId, params));

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

export const useReplies = (postId?: string | number) =>
  usePostList(["replies", postId], (params) => fetchReplies(postId as string | number, params), !!postId);

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

