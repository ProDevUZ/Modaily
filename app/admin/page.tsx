import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { adminSections } from "@/lib/admin-navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const chartPoints = [
  { month: "Jan", value: 12 },
  { month: "Feb", value: 19 },
  { month: "Mar", value: 15 },
  { month: "Apr", value: 25 },
  { month: "May", value: 22 },
  { month: "Jun", value: 30 },
  { month: "Jul", value: 28 }
];

function buildChartPath() {
  const max = 30;
  const width = 100;
  const height = 100;

  return chartPoints
    .map((point, index) => {
      const x = (index / (chartPoints.length - 1)) * width;
      const y = height - (point.value / max) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export default async function AdminOverviewPage() {
  const [userCount, productCount, categoryCount] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.category.count()
  ]);

  const catalogValue = await prisma.product.aggregate({
    _sum: {
      price: true
    }
  });

  const stats = [
    {
      label: "Catalog Value",
      value: `$${(catalogValue._sum.price || 0).toLocaleString()}`,
      copy: "Current total price value across product records",
      change: "+8.2%"
    },
    {
      label: "Products",
      value: productCount.toLocaleString(),
      copy: "Published and draft SKU records in the catalog",
      change: `+${productCount}`
    },
    {
      label: "Users",
      value: userCount.toLocaleString(),
      copy: "Customers and leads captured in the admin backend",
      change: "+15.3%"
    },
    {
      label: "Categories",
      value: categoryCount.toLocaleString(),
      copy: "Taxonomy groups available for storefront navigation",
      change: "+3"
    }
  ];

  return (
    <AdminShell
      current="overview"
      title="Dashboard"
      description="Welcome back! Here's what's happening today."
    >
      <div className="grid gap-5 xl:grid-cols-4">
        {stats.map((item) => (
          <AdminStatCard
            key={item.label}
            label={item.label}
            value={item.value}
            copy={item.copy}
            change={item.change}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <section className="admin-panel p-6">
          <h2 className="text-3xl font-semibold text-slate-950">Revenue Overview</h2>
          <p className="mt-2 text-base text-slate-500">Monthly revenue for the past 7 months</p>

          <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-[#fcfcfd] p-4">
            <svg viewBox="0 0 100 100" className="h-[320px] w-full">
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray="1.5 2.5"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {chartPoints.map((point, index) => {
                const x = (index / (chartPoints.length - 1)) * 100;
                return (
                  <line
                    key={point.month}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="100"
                    stroke="#eef2f7"
                    strokeDasharray="1.5 2.5"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
              <path
                d={buildChartPath()}
                fill="none"
                stroke="#0a0720"
                strokeWidth="0.45"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
              />
              {chartPoints.map((point, index) => {
                const x = (index / (chartPoints.length - 1)) * 100;
                const y = 100 - (point.value / 30) * 100;

                return <circle key={point.month} cx={x} cy={y} r="1.4" fill="#0a0720" />;
              })}
            </svg>

            <div className="mt-2 grid grid-cols-7 text-center text-sm text-slate-400">
              {chartPoints.map((point) => (
                <span key={point.month}>{point.month}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="admin-panel p-6">
            <h2 className="text-3xl font-semibold text-slate-950">Modules</h2>
            <p className="mt-2 text-base text-slate-500">Core management sections for Modaily admin.</p>
            <div className="mt-6 grid gap-4">
              {adminSections
                .filter((section) => section.key !== "overview")
                .map((item) => (
                  <AdminSectionCard key={item.key} title={item.label} href={item.href} copy={item.summary} />
                ))}
            </div>
          </div>

          <div className="admin-panel p-6">
            <h2 className="text-3xl font-semibold text-slate-950">Structure status</h2>
            <p className="mt-2 text-base text-slate-500">Admin shell, CRUD pages, placeholder modules and routing are ready.</p>
            <div className="mt-6 space-y-4">
              {[
                "Dashboard layout and top navigation",
                "Products, Categories, Users CRUD",
                "Orders, Analytics, Settings, Shop placeholders"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
