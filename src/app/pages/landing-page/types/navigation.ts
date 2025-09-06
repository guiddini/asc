export interface NavigationItem {
  label: string;
  href?: string;
  dropdown?: NavigationItem[];
}

export interface MobileNavigationItem {
  label: string;
  href?: string;
  items?: MobileNavigationItem[];
}
