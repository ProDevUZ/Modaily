import type { Locale } from "@/lib/i18n";
import type { StorefrontProduct } from "@/lib/storefront-products";

import { ProductCard } from "@/components/product-card";

type ProductGridProps = {
  locale: Locale;
  products: StorefrontProduct[];
};

export function ProductGrid({ locale, products }: ProductGridProps) {
  return (
    <div className="grid gap-x-5 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} locale={locale} product={product} />
      ))}
    </div>
  );
}
