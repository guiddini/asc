export interface NavigationItem {
  label: string;
  href?: string;
  dropdown?: {
    label: string;
    href: string;
  }[];
}

export interface MobileNavigationItem {
  label: string;
  href?: string;
  items?: {
    label: string;
    href: string;
  }[];
}
