// data/navigation-items.ts
import { NavigationItem } from "../types/navigation";

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Abous Us", href: "/a-propos" },
  {
    label: "Program",
    dropdown: [
      { label: "Agenda", href: "/programme#agenda" },
      { label: "The program", href: "/public-program" },
      { label: "Keynote", href: "/programme#keynotes" },
      { label: "Workshop", href: "/programme#ateliers" },
      { label: "Panels", href: "/programme#panels" },
      { label: "Speakers", href: "/speakers" },
      {
        label: "Thematic Spaces",
        dropdown: [
          { label: "Startup Factory", href: "/espaces/startup-factory" },
          { label: "Tech Zone", href: "/espaces/tech-zone" },
          { label: "Gaming Zone", href: "/espaces/gaming-zone" },
          { label: "Salle immersive", href: "/espaces/salle-immersive" },
          { label: "Media Lounge", href: "/espaces/media-lounge" },
        ],
      },
    ],
  },
  { label: "Exhibitors", href: "/exposants" },
  {
    label: "Partners & Sponsors",
    dropdown: [{ label: "Packs + Visibility", href: "/partenaires/packs" }],
  },
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
