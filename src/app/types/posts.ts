import { User } from "./user";

export type createPostType = {
  description: string;
  media: {
    file: File | null;
    id: string | number;
  }[];
  comments: CommentType[];
  likes: string[];
  saves: string[];
  id: number;
};

export type like = {
  id: number;
  liker_id: string;
  liker_type: string;
  likable_id: string;
  likable_type: string;
  created_at: string;
  updated_at: string;
};

export type MediaPostProps = {
  id: number;
  mediable_id: string;
  mediable_type: string;
  name: string;
  path: string;
  size: string;
  type: string;
};

export type PostType = {
  id: string;
  description: string;
  user_id: string;
  has_media: number; // Consider using a boolean if the value can only be "0" or "1"
  created_at: string;
  updated_at: string;
  comments: CommentType[]; // You might want to create a separate type for comments
  likes: like[]; // You might want to create a separate type for likes
  user: {
    id: string;
    fname: string;
    lname: string;
    email: string;
    avatar: string;
    email_verified_at: string | null; // You might want to adjust the type based on your use case
    created_at: string;
    updated_at: string;
    ticket_count: string;
    user_has_ticket_id: string;
  };
  media?: MediaPostProps[];
};

export type CommentType = {
  id: number;
  commenter_id: string;
  commenter_type: string;
  commentable_id: string;
  commentable_type: string;
  content: string;
  created_at: string;
  updated_at: string;
  commenter: {
    id: string;
    fname: string;
    lname: string;
    avatar: string;
  };
};

export type commentReplyType = {
  user: User;
  description: string;
  created_at: string;
  id: number;
};

export type uploadMediaResponseType = {
  mediaTemp: {
    path: string;
    name: string;
    ext: string;
    size: number;
    type: string;
    user_id: string;
    id: number;
  };
};
