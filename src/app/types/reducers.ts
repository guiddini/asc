import { JobOffer } from "./company";
import { Notification } from "./notification";
import { PostType } from "./posts";
import { ParticipantProps, User } from "./user";

export interface UserNotInCompany {
  id: string;
  fname: string;
  lname: string;
  email: string;
  avatar: string;
  can_create_company: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  ticket_count: string;
  user_has_ticket_id: string;
  has_password: string;
  info: {
    phone: string;
    address: string;
    country_id: string;
    is_registered: string;
    type: string;
    wilaya_id: string;
    commune_id: string;
    foreign_university: string | null;
    university_id: string;
    occupation: string | null;
    occupation_id: string | null;
    institution_type: string | null;
    institution_name: string | null;
  };
  roles: {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    display_name: string;
    uuid: string;
    pivot: {
      model_type: string;
      model_id: string;
      role_id: string;
    };
  }[];
}

export type UserResponse = {
  user: {
    user: User;
    token: string;
  };
};

export type PostsReducer = {
  posts: {
    posts: PostType[];
    currentPage: number;
  };
};

export type ParticipantsReducer = {
  participants: {
    participants: ParticipantProps[];
    filteringResults: ParticipantProps[];
    currentPage: number;
  };
};

export type JobsReducer = {
  jobs: {
    jobs: JobOffer[];
  };
};

export type UsersReducer = {
  users: {
    users: User[];
    filteringResults: User[];
    currentPage: number;
  };
};

export type NotificationsReducer = {
  notifications: {
    notifications: Notification[];
    currentPage: number;
  };
};

export type usersNotInCompanyReducer = {
  usersNotInCompany: {
    users: UserNotInCompany[];
    currentPage: number;
  };
};
