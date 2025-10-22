// data/navigation-items.ts
import { NavigationItem } from "../types/navigation";

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Program",
    dropdown: [
      { label: "Agenda", href: "/program#agenda" },
      { label: "Workshop", href: "/program#workshops" },
      { label: "Panels", href: "/program#panels" },
      { label: "Speakers", href: "/speakers" },
    ],
  },
  { label: "Exhibitors", href: "/exhibitors" },

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
