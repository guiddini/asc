import { NavigationItem, MobileNavigationItem } from "../types/navigation";

export const navigationItems: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    dropdown: [
      { label: "Event & Previous Editions", href: "/about/event" },
      { label: "Program", href: "/about/program" },
      { label: "Speakers", href: "/about/speakers" },
      { label: "Exhibiting Startups", href: "/about/startups" },
    ],
  },
  {
    label: "Partners & Sponsors",
    dropdown: [
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
    dropdown: [
      { label: "Venue & Location", href: "/info/venue" },
      { label: "Access & Transportation", href: "/info/access" },
      { label: "Accommodation", href: "/info/accommodation" },
    ],
  },
  // {
  //   label: "Registration",
  //   dropdown: [
  //     { label: "VIP Registration", href: "/register/vip" },
  //     { label: "Visitor Registration", href: "/register/visitor" },
  //     { label: "Startup Registration", href: "/register/startup" },
  //     { label: "Media Registration", href: "/register/media" },
  //     { label: "Sponsor Registration", href: "/register/sponsor" },
  //   ],
  // },
  {
    label: "Blog",
    href: "/blog",
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
    href: "/blog",
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
