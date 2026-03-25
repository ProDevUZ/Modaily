export const adminSections = [
  {
    key: "overview",
    href: "/admin",
    label: "Dashboard",
    summary: "Overview and daily activity"
  },
  {
    key: "products",
    href: "/admin/products",
    label: "Products",
    summary: "Catalog inventory and SKU content"
  },
  {
    key: "categories",
    href: "/admin/categories",
    label: "Categories",
    summary: "Taxonomy and catalog grouping"
  },
  {
    key: "orders",
    href: "/admin/orders",
    label: "Orders",
    summary: "Checkout and fulfillment flow"
  },
  {
    key: "users",
    href: "/admin/users",
    label: "Users",
    summary: "Customers and CRM records"
  },
  {
    key: "content",
    href: "/admin/content",
    label: "Content",
    summary: "Homepage CMS and editorial blocks"
  },
  {
    key: "analytics",
    href: "/admin/analytics",
    label: "Analytics",
    summary: "Performance and business reporting"
  },
  {
    key: "settings",
    href: "/admin/settings",
    label: "Settings",
    summary: "System and content configuration"
  },
  {
    key: "shop",
    href: "/admin/shop",
    label: "Shop",
    summary: "Storefront management shortcuts"
  }
] as const;

export type AdminSectionKey = (typeof adminSections)[number]["key"];
