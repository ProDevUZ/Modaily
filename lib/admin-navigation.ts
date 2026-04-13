export const adminSections = [
  {
    key: "overview",
    href: "/admin",
    label: "Дашборд",
    summary: "Обзор панели и основных показателей"
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
    summary: "Структура и группировка каталога"
  },
  {
    key: "content",
    href: "/admin/content",
    label: "Контент",
    summary: "Контент главной страницы и медиаблоков"
  },
  {
    key: "settings",
    href: "/admin/settings",
    label: "Настройки",
    summary: "Глобальные параметры витрины"
  },
  {
    key: "shop",
    href: "/admin/shop",
    label: "Магазин",
    summary: "Быстрый переход на витрину"
  }
] as const;

export type AdminSectionKey = (typeof adminSections)[number]["key"];
