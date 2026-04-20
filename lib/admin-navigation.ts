export const adminSections = [
  {
    key: "overview",
    href: "/admin123",
    label: "Дашборд",
    summary: "Обзор панели и основных показателей"
  },
  {
    key: "products",
    href: "/admin123/products",
    label: "Товары",
    summary: "Каталог, SKU и карточки товаров"
  },
  {
    key: "categories",
    href: "/admin123/categories",
    label: "Категории",
    summary: "Структура и группировка каталога"
  },
  {
    key: "users",
    href: "/admin123/users",
    label: "Пользователи",
    summary: "Клиентские записи и контактные данные"
  },
  {
    key: "messages",
    href: "/admin123/messages",
    label: "Сообщения",
    summary: "Заявки и обращения с формы контактов"
  },
  {
    key: "content",
    href: "/admin123/content",
    label: "Контент",
    summary: "Контент главной страницы и медиаблоков"
  },
  {
    key: "blog",
    href: "/admin123/blog",
    label: "Блог",
    summary: "Новости, статьи и редакционные публикации"
  },
  {
    key: "settings",
    href: "/admin123/settings",
    label: "Настройки",
    summary: "Глобальные параметры витрины"
  },
  {
    key: "shop",
    href: "/admin123/shop",
    label: "Магазин",
    summary: "Адреса, карты и часы работы"
  }
] as const;

export type AdminSectionKey = (typeof adminSections)[number]["key"];
