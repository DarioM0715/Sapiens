import { apiServer } from "./apiServer";
import type { Post, Comment } from "@/types/post";

export type CreatePostPayload = {
  title: string;
  description: string;
  content?: string;
  type?: string;
  institution?: string;
  documentUrl?: string;
  categories?: string[];
};

export const fetchPosts = async (): Promise<Post[]> => {
  const { data } = await apiServer.get<{ posts: Post[] }>("/posts");
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

export const fetchComments = async (postId: string | number): Promise<Comment[]> => {
  const { data } = await apiServer.get<{ comments: Comment[] }>(`/posts/${postId}/comments`);
  return data.comments;
};

export const addComment = async (postId: string | number, content: string): Promise<Comment> => {
  const { data } = await apiServer.post<{ comment: Comment }>(`/posts/${postId}/comments`, { content });
  return data.comment;
};

export const likeComment = async (commentId: string | number): Promise<Comment> => {
  const { data } = await apiServer.post<{ comment: Comment }>(`/comments/${commentId}/like`);
  return data.comment;
};