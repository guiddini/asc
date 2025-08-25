export interface AuthModel {
  api_token: string;
  refreshToken?: string;
}

export interface UserAddressModel {
  addressLine: string;
  city: string;
  state: string;
  postCode: string;
}

export interface UserCommunicationModel {
  email: boolean;
  sms: boolean;
  phone: boolean;
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean;
  sendCopyToPersonalEmail?: boolean;
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean;
    youAreSentADirectMessage?: boolean;
    someoneAddsYouAsAsAConnection?: boolean;
    uponNewOrder?: boolean;
    newMembershipApproval?: boolean;
    memberRegistration?: boolean;
  };
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean;
    tipsOnGettingMoreOutOfKeen?: boolean;
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean;
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean;
    tipsOnStartBusinessProducts?: boolean;
  };
}

export interface UserSocialNetworksModel {
  linkedIn: string;
  facebook: string;
  twitter: string;
  instagram: string;
}

export interface UserModel {
  id: number;
  fname: string;
  lname: string;
  email: string;
  info: {
    id: number;
    created_at: string;
    updated_at: string;
    phone: string;
    address: string;
    country: string;
    user_id: string;
    ticket_count: string;
  };
  ticket: Ticket[];
  qrcode: {
    id: number;
    created_at: string;
    updated_at: string;
    value: string;
    path: string;
    file_name: string;
    user_id: string;
  };
  role: string[];
  permissions: any[]; // You might want to replace `any` with the actual type
  activityAreas: any[]; // You might want to replace `any` with the actual type
  occupation: null | string;
}

export type Ticket = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  assigned: string;
  is_used: string;
  user_id: string;
  source: string;
};

export type ApiResponse = {
  user: {
    user: UserModel;
    token: string;
  };
};
