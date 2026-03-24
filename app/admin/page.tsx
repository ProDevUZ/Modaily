import Link from "next/link";

import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { adminSections } from "@/lib/admin-navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [userCount, productCount, categoryCount, lowStockProducts, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.findMany({
      where: {
        stock: {
          lte: 10
        }
      },
      orderBy: {
        stock: "asc"
      },
      take: 5,
      include: {
        category: true
      }
    }),
    prisma.user.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    })
  ]);

  const stats = [
    {
      label: "Users",
      value: userCount,
      copy: "CRM va buyurtma oqimi uchun foydalanuvchi bazasi"
    },
    {
      label: "Products",
      value: productCount,
      copy: "Katalogdagi SKU va product card yozuvlari"
    },
    {
      label: "Categories",
      value: categoryCount,
      copy: "Mahsulotlarni guruhlash va storefront navigatsiyasi"
    }
  ];

  return (
    <AdminShell
      current="overview"
      title="Dashboard"
      description="Store operatsiyalari uchun bitta alohida boshqaruv markazi. Quyida umumiy statistika, tezkor kirish nuqtalari va etibor talab qiladigan yozuvlar korsatiladi."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {stats.map((item) => (
          <AdminStatCard key={item.label} label={item.label} value={item.value} copy={item.copy} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Quick actions</p>
              <h3 className="mt-3 font-display text-3xl text-white">Management modules</h3>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {adminSections
              .filter((section) => section.key !== "overview")
              .map((item) => (
                <AdminSectionCard key={item.key} title={item.label} href={item.href} copy={item.summary} />
              ))}
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Recent users</p>
          <h3 className="mt-3 font-display text-3xl text-white">Latest signups</h3>
          <div className="mt-5 space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="font-semibold text-white">{user.fullName}</p>
                <p className="mt-1 text-sm text-slate-300">{user.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Attention needed</p>
            <h3 className="mt-3 font-display text-3xl text-white">Low stock products</h3>
          </div>
          <Link
            href="/admin/products"
            className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
          >
            Open products
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lowStockProducts.map((product) => (
            <article key={product.id} className="rounded-[1.4rem] border border-white/10 bg-slate-950/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                {product.sku} | {product.category.nameEn}
              </p>
              <h4 className="mt-2 text-lg font-semibold text-white">{product.nameEn}</h4>
              <p className="mt-3 text-sm text-slate-300">Remaining stock: {product.stock}</p>
            </article>
          ))}
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-slate-300">All products have healthy stock levels.</p>
          ) : null}
        </div>
      </div>
    </AdminShell>
  );
}
