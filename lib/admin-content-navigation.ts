export const adminContentSections = [
  {
    key: "hero",
    href: "/admin/content/hero",
    label: "Хиро",
    description: "Главный первый блок"
  },
  {
    key: "about",
    href: "/admin/content/about",
    label: "О бренде",
    description: "Блок истории бренда"
  },
  {
    key: "promo",
    href: "/admin/content/promo",
    label: "Промо",
    description: "Редакционные промо-карточки"
  },
  {
    key: "gallery",
    href: "/admin/content/gallery/image",
    label: "Галерея",
    description: "Изображения и видео"
  },
  {
    key: "testimonials",
    href: "/admin/content/testimonials",
    label: "Отзывы",
    description: "Блок отзывов на главной"
  },
  {
    key: "settings",
    href: "/admin/content/settings",
    label: "Настройки",
    description: "Анонс, футер и служебный контент"
  },
  {
    key: "bestseller",
    href: "/admin/content/bestseller",
    label: "Бестселлеры",
    description: "Выборка товаров для главной"
  }
] as const;

export type AdminContentSectionKey = (typeof adminContentSections)[number]["key"];

export function isAdminContentSectionKey(value: string): value is AdminContentSectionKey {
  return adminContentSections.some((section) => section.key === value);
}
