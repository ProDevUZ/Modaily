import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Панель управления",
  description: "Отдельная панель управления Modaily."
};

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
