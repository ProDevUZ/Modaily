import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { adminSections } from "@/lib/admin-navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const chartPoints = [
  { month: "Янв", value: 12 },
  { month: "Фев", value: 19 },
  { month: "Мар", value: 15 },
  { month: "Апр", value: 25 },
  { month: "Май", value: 22 },
  { month: "Июн", value: 30 },
  { month: "Июл", value: 28 }
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
  const [userCount, productCount, categoryCount, testimonialCount, galleryCount, promoCount, catalogValue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.testimonial.count(),
    prisma.galleryItem.count(),
    prisma.homePromoCard.count(),
    prisma.product.aggregate({
      _sum: {
        price: true
      }
    })
  ]);

  const stats = [
    {
      label: "Стоимость каталога",
      value: `${(catalogValue._sum.price || 0).toLocaleString()} сум`,
      copy: "Суммарная стоимость всех товарных записей",
      change: "+8.2%",
      tone: "yellow" as const
    },
    {
      label: "Товары",
      value: productCount.toLocaleString(),
      copy: "Все товарные позиции в каталоге",
      change: `+${productCount}`,
      tone: "blue" as const
    },
    {
      label: "Галерея",
      value: galleryCount.toLocaleString(),
      copy: "Медиаэлементы для витрины и главной страницы",
      change: `+${galleryCount}`,
      tone: "purple" as const
    },
    {
      label: "Категории",
      value: categoryCount.toLocaleString(),
      copy: "Группы каталога для витрины",
      change: "+3",
      tone: "green" as const
    }
  ];

  return (
    <AdminShell current="overview" title="Дашборд" description="Ключевые показатели и быстрые переходы по панели Modaily.">
      <div className="grid gap-5 xl:grid-cols-4">
        {stats.map((item) => (
          <AdminStatCard
            key={item.label}
            label={item.label}
            value={item.value}
            copy={item.copy}
            change={item.change}
            tone={item.tone}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <section className="admin-panel p-6">
          <h2 className="text-3xl font-semibold text-slate-950">Обзор динамики</h2>
          <p className="mt-2 text-base text-slate-500">Визуализация активности за последние 7 месяцев</p>

          <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-[#edf1f7] bg-[#fbfcff] p-4">
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
                stroke="#5777ff"
                strokeWidth="0.45"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
              />
              {chartPoints.map((point, index) => {
                const x = (index / (chartPoints.length - 1)) * 100;
                const y = 100 - (point.value / 30) * 100;

                return <circle key={point.month} cx={x} cy={y} r="1.4" fill="#5777ff" />;
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
            <h2 className="text-3xl font-semibold text-slate-950">Разделы</h2>
            <p className="mt-2 text-base text-slate-500">Основные разделы панели управления Modaily.</p>
            <div className="mt-6 grid gap-4">
              {adminSections
                .filter((section) => section.key !== "overview")
                .map((item) => (
                  <AdminSectionCard key={item.key} title={item.label} href={item.href} copy={item.summary} />
                ))}
            </div>
          </div>

          <div className="admin-panel p-6">
            <h2 className="text-3xl font-semibold text-slate-950">Статус структуры</h2>
            <p className="mt-2 text-base text-slate-500">Текущее состояние панели, каталога и контентных модулей.</p>
            <div className="mt-6 space-y-4">
              {[
                "Дашборд и верхняя навигация",
                "Управление товарами и категориями",
                `Контент-блоки: ${promoCount} промо, ${galleryCount} медиа, ${testimonialCount} отзывов`,
                `Текущая база клиентов: ${userCount} записей`
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#f8fafc] px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#5777ff]" />
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
