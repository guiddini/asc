export interface User {
  id: string;
  fname: string;
  lname: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  commenter_id: string;
  commenter_type: string;
  commentable_id: string;
  commentable_type: string;
  content: string;
  created_at: string;
  updated_at: string;
  commenter: User;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published" | "archived";
  cover_image: string;
  published_at: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  excerpt?: string;
}

export interface BlogSearchParams {
  title?: string;
}
