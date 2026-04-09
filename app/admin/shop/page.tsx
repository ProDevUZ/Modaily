import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";

export default function AdminShopPage() {
  return (
    <AdminPlaceholderPage
      current="shop"
      title="Магазин"
      description="Этот модуль зарезервирован под отдельное управление витриной, подборками и merchandising-блоками."
      points={[
        "Главная витрина и featured-подборки",
        "Промо-баннеры и сезонные кампании",
        "Коллекции и специальные посадочные страницы"
      ]}
    />
  );
}
