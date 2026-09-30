import { apiServer } from "./apiServer";
import type { Post } from "@/types/post";

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

export const fetchPosts = async (userId?: string | number): Promise<Post[]> => {
  const { data } = await apiServer.get<{ posts: Post[] }>("/posts", {
    params: userId ? { userId } : undefined,
  });
  return data.posts;
};

export const fetchUserReplies = async (userId: string | number): Promise<Post[]> => {
  const { data } = await apiServer.get<{ posts: Post[] }>("/posts", {
    params: { userId, replies: "true" },
  });
  return data.posts;
};

export const fetchFollowingPosts = async (): Promise<Post[]> => {
  const { data } = await apiServer.get<{ posts: Post[] }>("/posts/following");
  return data.posts;
};

export const fetchSavedPosts = async (): Promise<Post[]> => {
  const { data } = await apiServer.get<{ posts: Post[] }>("/posts/saved");
  return data.posts;
};

export const fetchLikedPosts = async (userId?: string | number): Promise<Post[]> => {
  const { data } = await apiServer.get<{ posts: Post[] }>("/posts/liked", {
    params: userId ? { userId } : undefined,
  });
  return data.posts;
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

export const fetchReplies = async (postId: string | number): Promise<Post[]> => {
  const { data } = await apiServer.get<{ posts: Post[] }>(`/posts/${postId}/replies`);
  return data.posts;
};

export const addReply = async (postId: string | number, content: string): Promise<Post> => {
  const { data } = await apiServer.post<{ post: Post }>(`/posts/${postId}/replies`, { content });
  return data.post;
};