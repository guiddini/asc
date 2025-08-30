import { NavigationItem, MobileNavigationItem } from "../types/navigation";

export const navigationItems: NavigationItem[] = [
  {
    label: "Attendees",
    dropdown: [
      { label: "Registration", href: "/attendees/register" },
      { label: "Travel Info", href: "/attendees/travel" },
      { label: "Schedule", href: "/attendees/schedule" },
      { label: "Networking", href: "/attendees/networking" },
    ],
  },
  {
    label: "Partners",
    dropdown: [
      { label: "Become a Partner", href: "/partners/join" },
      { label: "Partner Benefits", href: "/partners/benefits" },
      { label: "Current Partners", href: "/partners/current" },
      { label: "Contact", href: "/partners/contact" },
    ],
  },
  {
    label: "Startups",
    dropdown: [
      { label: "Apply to Pitch", href: "/startups/apply" },
      { label: "Startup Program", href: "/startups/program" },
      { label: "Success Stories", href: "/startups/stories" },
      { label: "Resources", href: "/startups/resources" },
    ],
  },
  {
    label: "Investors",
    href: "/investors",
  },
  {
    label: "Blogs",
    href: "/blogs",
  },
  {
    label: "Media",
    dropdown: [
      { label: "Press Kit", href: "/media/press-kit" },
      { label: "Media Coverage", href: "/media/coverage" },
      { label: "Interviews", href: "/media/interviews" },
      { label: "Contact Media Team", href: "/media/contact" },
    ],
  },
  {
    label: "More",
    dropdown: [
      { label: "About", href: "/about" },
      { label: "Speakers", href: "/speakers" },
      { label: "Venue", href: "/venue" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const mobileNavItems: MobileNavigationItem[] = [
  {
    label: "Attendees",
    items: [
      { label: "Registration", href: "/attendees/register" },
      { label: "Travel Info", href: "/attendees/travel" },
      { label: "Schedule", href: "/attendees/schedule" },
      { label: "Networking", href: "/attendees/networking" },
    ],
  },
  {
    label: "Partners",
    items: [
      { label: "Become a Partner", href: "/partners/join" },
      { label: "Partner Benefits", href: "/partners/benefits" },
      { label: "Current Partners", href: "/partners/current" },
      { label: "Contact", href: "/partners/contact" },
    ],
  },
  {
    label: "Startups",
    items: [
      { label: "Apply to Pitch", href: "/startups/apply" },
      { label: "Startup Program", href: "/startups/program" },
      { label: "Success Stories", href: "/startups/stories" },
      { label: "Resources", href: "/startups/resources" },
    ],
  },
  {
    label: "Investors",
    href: "/investors",
  },
  {
    label: "Media",
    items: [
      { label: "Press Kit", href: "/media/press-kit" },
      { label: "Media Coverage", href: "/media/coverage" },
      { label: "Interviews", href: "/media/interviews" },
      { label: "Contact Media Team", href: "/media/contact" },
    ],
  },
  {
    label: "More",
    items: [
      { label: "About", href: "/about" },
      { label: "Speakers", href: "/speakers" },
      { label: "Venue", href: "/venue" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
