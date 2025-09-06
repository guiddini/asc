import { NavigationItem, MobileNavigationItem } from "../types/navigation";

export const navigationItems: NavigationItem[] = [
  {
    label: "Accueil",
    href: "/",
  },
  {
    label: "À propos",
    dropdown: [
      { label: "Événement & Éditions précédentes", href: "/about/event" },
      { label: "Programme", href: "/about/program" },
      { label: "Intervenants", href: "/about/speakers" },
      { label: "Startups exposantes", href: "/about/startups" },
    ],
  },
  {
    label: "Partenaires & Sponsors",
    dropdown: [
      { label: "Formules de sponsoring", href: "/partners/packages" },
      { label: "Espaces d’exposition", href: "/partners/spaces" },
      { label: "Startup Factory", href: "/partners/startup-factory" },
      { label: "Zone Tech", href: "/partners/tech-zone" },
      { label: "Zone Gaming", href: "/partners/gaming-zone" },
      { label: "Salle immersive", href: "/partners/immersion-room" },
      { label: "Espace Média", href: "/partners/media-lounge" },
    ],
  },
  {
    label: "Infos pratiques",
    dropdown: [
      { label: "Lieu & Localisation", href: "/info/venue" },
      { label: "Accès & Transport", href: "/info/access" },
      { label: "Hébergement", href: "/info/accommodation" },
    ],
  },
  // {
  //   label: "Inscriptions",
  //   dropdown: [
  //     { label: "Inscription VIP", href: "/register/vip" },
  //     { label: "Inscription Visiteur", href: "/register/visitor" },
  //     { label: "Inscription Startup", href: "/register/startup" },
  //     { label: "Inscription Média", href: "/register/media" },
  //     { label: "Inscription Sponsor", href: "/register/sponsor" },
  //   ],
  // },
  {
    label: "Blog",
    href: "/blogs",
  },
  {
    label: "Presse",
    href: "/press",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];


export const mobileNavItems: MobileNavigationItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    items: [
      { label: "Event & Previous Editions", href: "/about/event" },
      { label: "Program", href: "/about/program" },
      { label: "Speakers", href: "/about/speakers" },
      { label: "Exhibiting Startups", href: "/about/startups" },
    ],
  },
  {
    label: "Partners & Sponsors",
    items: [
      { label: "Sponsorship Packages", href: "/partners/packages" },
      { label: "Exhibition Spaces", href: "/partners/spaces" },
      { label: "Startup Factory", href: "/partners/startup-factory" },
      { label: "Tech Zone", href: "/partners/tech-zone" },
      { label: "Gaming Zone", href: "/partners/gaming-zone" },
      { label: "Immersion Room", href: "/partners/immersion-room" },
      { label: "Media Lounge", href: "/partners/media-lounge" },
    ],
  },
  {
    label: "Practical Info",
    items: [
      { label: "Venue & Location", href: "/info/venue" },
      { label: "Access & Transportation", href: "/info/access" },
      { label: "Accommodation", href: "/info/accommodation" },
    ],
  },
  // {
  //   label: "Registration",
  //   items: [
  //     { label: "VIP Registration", href: "/register/vip" },
  //     { label: "Visitor Registration", href: "/register/visitor" },
  //     { label: "Startup Registration", href: "/register/startup" },
  //     { label: "Media Registration", href: "/register/media" },
  //     { label: "Sponsor Registration", href: "/register/sponsor" },
  //   ],
  // },
  {
    label: "Blog",
    href: "/blogs",
  },
  {
    label: "Press",
    href: "/press",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];
