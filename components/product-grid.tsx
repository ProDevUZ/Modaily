import type { Locale } from "@/lib/i18n";
import type { LocalizedProduct } from "@/lib/products";

import { ProductCard } from "@/components/product-card";

type ProductGridProps = {
  locale: Locale;
  products: LocalizedProduct[];
};

export function ProductGrid({ locale, products }: ProductGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.slug} locale={locale} product={product} />
      ))}
    </div>
  );
}
