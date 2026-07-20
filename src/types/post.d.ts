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

export type Comment = {
  id: number;
  user: User;
  content: string;
  media?: Media[];
  time: string;
  likes: number;
  dislikes?: number;
  views: number;
  messages: number;
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
  id: number;
  title: string;
  description: string;
  time: string;
  categories?: string[];
  views: number;
  messages: number;
  likes: number;
  dislikes?: number;
  media?: Media[];
  comments?: Comment[];
  user: User;
  institution?: string;
  type?: string;
  documentUrl?: string;
  bibliography?: Bibliography[];
};