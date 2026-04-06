"use client";

import { useState } from "react";

import { useCart } from "@/components/cart-provider";
import type { Locale } from "@/lib/i18n";
import type { StorefrontProduct } from "@/lib/storefront-products";

type AddToCartButtonProps = {
  locale: Locale;
  product: StorefrontProduct;
  label: string;
  quantity?: number;
  className?: string;
};

export function AddToCartButton({ locale, product, label, quantity = 1, className }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className={className || "cta-primary min-w-[180px]"}
      onClick={() => {
        addItem({
          id: product.id,
          slug: product.slug,
          locale,
          name: product.name,
          price: product.price,
          color: product.colors[0]
        }, quantity);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? "Added" : label}
    </button>
  );
}
