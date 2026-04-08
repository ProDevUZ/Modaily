export const adminSections = [
  {
    key: "overview",
    href: "/admin",
    label: "Дашборд",
    summary: "Обзор и ежедневная активность"
  },
  {
    key: "products",
    href: "/admin/products",
    label: "Товары",
    summary: "Каталог, SKU и карточки товаров"
  },
  {
    key: "categories",
    href: "/admin/categories",
    label: "Категории",
    summary: "Таксономия и группировка каталога"
  },
  {
    key: "content",
    href: "/admin/content",
    label: "Контент",
    summary: "CMS главной страницы и редакционные блоки"
  },
  {
    key: "settings",
    href: "/admin/settings",
    label: "Настройки",
    summary: "Глобальные настройки витрины"
  },
  {
    key: "shop",
    href: "/admin/shop",
    label: "Магазин",
    summary: "Быстрые переходы по витрине"
  }
] as const;

export type AdminSectionKey = (typeof adminSections)[number]["key"];
