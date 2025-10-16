// data/navigation-items.ts
import { NavigationItem } from "../types/navigation";

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Abous Us", href: "/a-propos" },
  {
    label: "Program",
    dropdown: [
      { label: "Agenda", href: "/programme#agenda" },
      { label: "Workshop", href: "/programme#ateliers" },
      { label: "Panels", href: "/programme#panels" },
      { label: "Speakers", href: "/speakers" },
    ],
  },
  { label: "Exhibitors", href: "/exposants" },

  {
    label: "Practical Info",
    dropdown: [
      { label: "Location", href: "/infos/lieu" },
      { label: "Access", href: "/infos/acces" },
      { label: "Accommodation", href: "/infos/hebergement" },
      { label: "Contact", href: "/contact" },
    ],
  },
  { label: "Blog", href: "/blogs" },
];
