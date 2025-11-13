// data/navigation-items.ts
import { NavigationItem } from "../types/navigation";

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Program",
    dropdown: [
      { label: "Program", href: "/program" },
      { label: "Workshop", href: "/program?type=workshop" },
      { label: "Conference", href: "/program?type=conference" },
      { label: "Speakers", href: "/speakers" },
    ],
  },
  { label: "Exhibitors", href: "/companies" },

  {
    label: "Practical Info",
    dropdown: [
      { label: "Location", href: "/info/location" },
      { label: "Access", href: "/info/access" },
      { label: "Accommodation", href: "/info/accommodation" },
      { label: "Contact", href: "/contact" },
    ],
  },
  // { label: "Blog", href: "/blogs" },
];
