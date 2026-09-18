import { User } from "./users";

export type Media = {
  id: number;
  name: string;
  url: string;
};

export type Options = {
  id: number;
  name: string;
  function: any;
};

export type Like = {
  id: number;
  user: User;
  post: Post;
};

export type Bibliography = {
  id: number;
  title: string;
  description: string;
  url: string;
};

export type Post = {
  id: string | number;
  title: string;
  description: string;
  content?: string;
  time: string;
  categories?: string[];
  views: number;
  messages: number;
  likes: number;
  dislikes?: number;
  media?: Media[];
  user: User;
  institution?: string;
  type?: string;
  documentUrl?: string;
  bibliography?: Bibliography[];
};

export type Comment = {
  id: string | number;
  postId: string | number;
  content: string;
  likes: number;
  time: string;
  user: User;
};