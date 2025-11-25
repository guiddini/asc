export type UUID = string;

export interface UserSummary {
  id: UUID;
  fname?: string;
  lname?: string;
  email?: string;
  avatar?: string;
}

export interface Conversation {
  id: string;
  title?: string | null;
  is_direct?: boolean | null;
  created_at?: string;
  updated_at?: string;
  participants?: UserSummary[];
  unread_messages_count?: number;
}

export interface CreateConversationRequest {
  participant_id: UUID;
}

export interface CreateConversationResponse {
  conversation: Conversation;
}

export interface ShowConversationResponse {
  conversation: Conversation;
}

export interface DeleteConversationResponse {
  message: string;
}

export type MessageType = "text" | "file";

export interface MessageRead {
  message_id: string | number;
  user_id: UUID;
  read_at: string;
}

export interface Message {
  id: string | number;
  conversation_id: string;
  user_id: UUID;
  content: string;
  type: MessageType;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
  user?: UserSummary;
  reads?: MessageRead[];
}

export interface SendMessageRequest {
  content?: string;
  file?: File;
}

export interface MarkMessageAsReadResponse {
  status: "ok";
}

export interface DeleteMessageResponse {
  message: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Pagination<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface GetUserConversationsRequest {
  per_page?: number;
  search?: string;
}

export type ConversationsPage = Pagination<Conversation>;
export type MessagesPage = Pagination<Message>;

export interface GetMessagesRequest {
  page?: number;
  per_page?: number;
}
