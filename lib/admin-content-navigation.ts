export const adminContentSections = [
  {
    key: "hero",
    href: "/admin/content/hero",
    label: "Hero",
    description: "Homepage hero block"
  },
  {
    key: "about",
    href: "/admin/content/about",
    label: "About",
    description: "Brand story section"
  },
  {
    key: "promo",
    href: "/admin/content/promo",
    label: "Promo",
    description: "Editorial promo cards"
  },
  {
    key: "gallery",
    href: "/admin/content/gallery/image",
    label: "Gallery",
    description: "Image and video gallery"
  },
  {
    key: "testimonials",
    href: "/admin/content/testimonials",
    label: "Testimonials",
    description: "Homepage reviews section"
  },
  {
    key: "settings",
    href: "/admin/content/settings",
    label: "Settings",
    description: "Announcement and footer content"
  },
  {
    key: "bestseller",
    href: "/admin/content/bestseller",
    label: "Bestseller",
    description: "Homepage bestseller selection"
  }
] as const;

export type AdminContentSectionKey = (typeof adminContentSections)[number]["key"];

export function isAdminContentSectionKey(value: string): value is AdminContentSectionKey {
  return adminContentSections.some((section) => section.key === value);
}
