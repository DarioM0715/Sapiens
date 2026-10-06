import { apiServer } from "./apiServer";
import type { Post } from "@/types/post";
import type { CursorParams, PostsPage } from "@/types/pagination";

export type CreatePostPayload = {
  title?: string;
  description: string;
  content?: string;
  type?: string;
  institution?: string;
  documentUrl?: string;
  categories?: string[];
  parentId?: string | null;
};

export const PAGE_SIZE = 10;

export const fetchPosts = async (params: CursorParams & { userId?: string | number } = {}): Promise<PostsPage> => {
  const { data } = await apiServer.get<PostsPage>("/posts", {
    params: { ...params, limit: params.limit ?? PAGE_SIZE },
  });
  return data;
};

export const fetchUserReplies = async (userId: string | number, params: CursorParams = {}): Promise<PostsPage> => {
  const { data } = await apiServer.get<PostsPage>("/posts", {
    params: { ...params, userId, replies: "true", limit: params.limit ?? PAGE_SIZE },
  });
  return data;
};

export const fetchFollowingPosts = async (params: CursorParams = {}): Promise<PostsPage> => {
  const { data } = await apiServer.get<PostsPage>("/posts/following", {
    params: { ...params, limit: params.limit ?? PAGE_SIZE },
  });
  return data;
};

export const fetchSavedPosts = async (params: CursorParams = {}): Promise<PostsPage> => {
  const { data } = await apiServer.get<PostsPage>("/posts/saved", {
    params: { ...params, limit: params.limit ?? PAGE_SIZE },
  });
  return data;
};

export const fetchLikedPosts = async (userId?: string | number, params: CursorParams = {}): Promise<PostsPage> => {
  const { data } = await apiServer.get<PostsPage>("/posts/liked", {
    params: { ...params, ...(userId ? { userId } : {}), limit: params.limit ?? PAGE_SIZE },
  });
  return data;
};

export const fetchPost = async (id: string | number): Promise<Post> => {
  const { data } = await apiServer.get<{ post: Post }>(`/posts/${id}`);
  return data.post;
};

export const createPost = async (payload: CreatePostPayload): Promise<Post> => {
  const { data } = await apiServer.post<{ post: Post }>("/posts", payload);
  return data.post;
};

export const likePost = async (id: string | number): Promise<Post> => {
  const { data } = await apiServer.post<{ post: Post }>(`/posts/${id}/like`);
  return data.post;
};

export const dislikePost = async (id: string | number): Promise<Post> => {
  const { data } = await apiServer.post<{ post: Post }>(`/posts/${id}/dislike`);
  return data.post;
};

export const savePost = async (id: string | number): Promise<Post> => {
  const { data } = await apiServer.post<{ post: Post }>(`/posts/${id}/save`);
  return data.post;
};

export const fetchReplies = async (postId: string | number, params: CursorParams = {}): Promise<PostsPage> => {
  const { data } = await apiServer.get<PostsPage>(`/posts/${postId}/replies`, {
    params: { ...params, limit: params.limit ?? PAGE_SIZE },
  });
  return data;
};

export const addReply = async (postId: string | number, content: string): Promise<Post> => {
  const { data } = await apiServer.post<{ post: Post }>(`/posts/${postId}/replies`, { content });
  return data.post;
};