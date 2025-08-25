export interface User {
  id: string;
  fname: string;
  lname: string;
  email: string;
  can_create_company: number;
  user_has_ticket_id: string | null;
  avatar: string;
  ticket_count: string;
  activity_areas: Array<{
    id: number;
    name: string;
    label_fr: string;
    label_en: string;
    created_at: string;
    updated_at: string;
    pivot: {
      user_id: string;
      activity_area_id: string;
    };
  }>;
  info: InfoType;
  ticket: Ticket | any;
  qrcode: {
    id: number;
    created_at: string;
    updated_at: string;
    value: string;
    path: string;
    file_name: string;
    user_id: string;
  };
  roleValues: Role;
  permissions: Permission[];
  company: Company;
  giftedTickets: Ticket[];
  created_at: string;
  has_password: string;
  tickets: Ticket[];
  companyStaffRole?: Role;
}

type InfoType = {
  phone: string | null;
  address: string | null;
  country_id: string | null;
  is_registered: string | number | null;
  type: string | null;
  wilaya: {
    id: number | null;
    name: string | null;
    arabic_name: string | null;
    longitude: string | null;
    latitude: string | null;
    created_at: string | null;
    updated_at: string | null;
  } | null;
  city: string | null;
  wilaya_id: string | null;
  commune_id: string | null;
  foreign_university: string | null;
  university_id: string | null;
  occupationFound: {
    id: string | null;
    label_fr: string | null;
    label_en: string | null;
    created_at: string | null;
    updated_at: string | null;
  } | null;
  occupation: string | null;
  occupation_id: string | null;
  institution_type: string | null;
  institution_name: string | null;
  country: {
    id: string | null;
    name_fr: string | null;
    name_en: string | null;
    code: string | null;
    created_at: string | null;
    updated_at: string | null;
  } | null;
  commune: {
    id: number | null;
    name: string | null;
    arabic_name: string | null;
    post_code: string | null;
    wilaya_id: string | null;
    longitude: string | null;
    latitude: string | null;
    created_at: string | null;
    updated_at: string | null;
  } | null;
};

export type Company = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  legal_status: string;
  country: string;
  wilaya: string;
  city: string;
  address: string;
  phone_1: string;
  phone_2: string;
  phone_3: string;
  email: string;
  description: string;
  logo: string;
  user_id: string;
};

export type QRCode = {
  id: number;
  created_at: string;
  updated_at: string;
  value: string;
  path: string;
  file_name: string;
  user_id: string;
};

export type Permission = {
  created_at: string;
  display_name: string;
  guard_name: string;
  id: number;
  name: string;
  updated_at: string;
};

export type Ticket = {
  created_at: string;
  gifted_to_user_id: string;
  id: string;
  is_assigned: string;
  is_used: string;
  source: string;
  ticket_id: string;
  role_slug: string;
  type: {
    id: string;
    name: string;
    slug: string;
    price: string;
  };
  updated_at: string;
  user_id: string;
};

export type activity = {
  created_at: string;
  id: number;
  label_en: string;
  label_fr: string;
  name: string;
  updated_at: string;
};

export type university = {
  created_at: string;
  id: number;
  location: string;
  name: string;
  updated_at: string;
};

export type CompleteProfile = {
  fname: string;
  lname: string;
  occupation_id: number;
  activity_area_ids: number[];
  country: {
    label: string;
    value: string;
  };
  wilaya: {
    label: string;
    value: string;
  };
  commune: {
    label: string;
    value: string;
  };
  address: string;
  foreign_university: string;
  university_id: number;
  occupation?: string;
  phone: number;
  type: string;
  institution_name?: string;
  institution_type?: string;
  avatar: File;
};

export interface UserTable {
  id: string;
  fname: string;
  lname: string;
  email: string;
  email_verified_at: null | string;
  created_at: string;
  updated_at: string;
  ticket_count: 9;
}

export type Staff = {
  company_id: string;
  user_id: string;
  data: {
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
    roles: Role[];
  };
  roles: Role[];
};

type Role = {
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
};

export interface ParticipantProps {
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
    wilaya_id: string | null;
    commune_id: string | null;
    foreign_university: string | null;
    university_id: string | null;
    occupation: string | null;
    occupation_id: string;
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
