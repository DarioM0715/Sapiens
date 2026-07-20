export type Contact = {
  user: User;
  last_message?: string;
  read?: string;
  last_time?: string;
};

export type Message = {
  id: number;
  conversation_id: number;
  from_user: User;
  to_user: User;
  content: string;
  attachments?: Media[];
  time: string;
};

export type Chat = {
  id: number;
  user: User;
  messages: Message[];
  time: string;
};