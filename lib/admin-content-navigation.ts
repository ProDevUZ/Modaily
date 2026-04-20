export const adminContentSections = [
  {
    key: "hero",
    href: "/admin123/content/hero",
    label: "Хиро",
    description: "Главный экран витрины"
  },
  {
    key: "about",
    href: "/admin123/content/about",
    label: "О бренде",
    description: "Блок истории бренда"
  },
  {
    key: "promo",
    href: "/admin123/content/promo",
    label: "Промо",
    description: "Редакционные промо-карточки"
  },
  {
    key: "gallery",
    href: "/admin123/content/gallery/image",
    label: "Галерея",
    description: "Изображения и видео"
  },
  {
    key: "testimonials",
    href: "/admin123/content/testimonials",
    label: "Отзывы",
    description: "Блок отзывов на главной"
  },
  {
    key: "bestseller",
    href: "/admin123/content/bestseller",
    label: "Бестселлеры",
    description: "Выборка товаров для главной"
  }
] as const;

export type AdminContentSectionKey = (typeof adminContentSections)[number]["key"];

export function isAdminContentSectionKey(value: string): value is AdminContentSectionKey {
  return adminContentSections.some((section) => section.key === value);
}
