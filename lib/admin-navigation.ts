export const adminSections = [
  {
    key: "overview",
    href: "/admin",
    label: "Dashboard",
    summary: "Admin panel overview and operational status"
  },
  {
    key: "users",
    href: "/admin/users",
    label: "Users",
    summary: "Customer and lead records"
  },
  {
    key: "products",
    href: "/admin/products",
    label: "Products",
    summary: "SKU, stock, price, and multilingual content"
  },
  {
    key: "categories",
    href: "/admin/categories",
    label: "Categories",
    summary: "Catalog taxonomy and grouping"
  }
] as const;

export type AdminSectionKey = (typeof adminSections)[number]["key"];
