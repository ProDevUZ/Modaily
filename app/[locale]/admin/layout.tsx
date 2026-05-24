import type { Metadata } from "next";

import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Admin",
  robots: noIndexRobots
};

export default function LocalizedAdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
