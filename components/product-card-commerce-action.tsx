"use client";

import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Locale } from "@/lib/i18n";
import type { StorefrontProduct } from "@/lib/storefront-products";

type ProductCardCommerceActionProps = {
  locale: Locale;
  product: StorefrontProduct;
  label: string;
  className: string;
};

export function ProductCardCommerceAction({ locale, product, label, className }: ProductCardCommerceActionProps) {
  return <AddToCartButton locale={locale} product={product} label={label} className={className} />;
}
