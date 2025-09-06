// data/navigation-items.ts
import { NavigationItem } from "../types/navigation";

export const navigationItems: NavigationItem[] = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  {
    label: "Programme",
    dropdown: [
      { label: "Agenda", href: "/programme#agenda" },
      { label: "Keynotes", href: "/programme#keynotes" },
      { label: "Ateliers", href: "/programme#ateliers" },
      { label: "Panels", href: "/programme#panels" },
      { label: "Speakers", href: "/speakers" },
      {
        label: "Espaces thématiques",
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
  { label: "Exposants", href: "/exposants" },
  {
    label: "Partenaires & Sponsors",
    dropdown: [{ label: "Packs + visibilité", href: "/partenaires/packs" }],
  },
  {
    label: "Infos pratiques",
    dropdown: [
      { label: "Lieu", href: "/infos/lieu" },
      { label: "Accès", href: "/infos/acces" },
      { label: "Hébergement", href: "/infos/hebergement" },
      { label: "Contact", href: "/contact" },
    ],
  },
  { label: "Blog", href: "/blogs" },
];
