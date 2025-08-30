export interface Talk {
  title: string;
  time: string;
  room: string;
}

export interface SocialLinks {
  github?: string;
  facebook?: string;
}

export interface Speaker {
  name: string;
  slug: string;
  title: string;
  affiliation: string;
  avatar: string;
  bio: string;
  topic: string;
  email: string;
  linkedin: string;
  twitter: string;
  country: string;
  phone: string;
  website: string;
  social: SocialLinks;
  talks: Talk[];
  awards: string[];
  languages: string[];
}
