//OTHERS
export type Share = {
  id: number;
  user: User;
  post: Post;
  comment: Comment;
  destination: string;
  time: string;
  url?: string;
};

export type Notification = {
  id: number;
  user_id: number;
  type: "follow" | "event";
  time: string;
  email: string;
  title: string;
  description: string;
};

export type Event = {
  id: number;
  organizer_id: number;
  title: string;
  description: string;
  date_start: string;
  date_end: string;
  location: string;
  privacy: "public" | "private" | "secret";
};

export type Group = {
  id: number;
  name: string;
  description: string;
  type: "open" | "private" | "secret";
  members: number;
  moderators: number;
  rules: string;
};

export type Mention = {
  id: number;
  entity_type: "user" | "post" | "comment";
  entity_id: number;
  referenced_user_id: number;
  context: string;
};

export type Poll = {
  id: number;
  post_id: number;
  options: string[];
  votes: number[];
  time_expiration: string;
  anonymous: boolean;
};

export type Favorite = {
  id: number;
  user_id: number;
  post_id: number;
};

export type Report = {
  id: number;
  reporter_id: number;
  target_type: "user" | "post" | "comment";
  target_id: number;
  reason: string;
  state: "pending" | "accepted" | "rejected";
  actions: string[];
};

export type Policy = {
  id: number;
  name: string;
  description: string;
  rules: string;
  date: string;
};

export type Blacklist = {
  id: number;
  user_id: number;
};

export type Option = {
  id: string | number;
  label: string;
  Icon?: React.ComponentType<{ className?: string }>;
};
