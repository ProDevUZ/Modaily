import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Separate admin control panel for Modaily management."
};

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
