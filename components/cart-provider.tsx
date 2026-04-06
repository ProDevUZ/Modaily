"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { Currency, Locale } from "@/lib/i18n";

export type CartItem = {
  id: string;
  slug: string;
  locale: Locale;
  name: string;
  price: number;
  quantity: number;
  color: string;
};

type CartContextValue = {
  items: CartItem[];
  subtotal: number;
  count: number;
  currency: Currency;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "modaily-cart";

type CartProviderProps = {
  children: React.ReactNode;
  locale: Locale;
  currency: Currency;
};

export function CartProvider({ children, currency }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setItems(JSON.parse(saved) as CartItem[]);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value: CartContextValue = {
    items,
    subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
    count: items.reduce((total, item) => total + item.quantity, 0),
    currency,
    addItem: (item, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((entry) => entry.slug === item.slug);

        if (existing) {
          return current.map((entry) =>
            entry.slug === item.slug ? { ...entry, quantity: entry.quantity + quantity } : entry
          );
        }

        return [...current, { ...item, quantity }];
      });
    },
    removeItem: (slug) => {
      setItems((current) => current.filter((item) => item.slug !== slug));
    },
    updateQuantity: (slug, quantity) => {
      if (quantity <= 0) {
        setItems((current) => current.filter((item) => item.slug !== slug));
        return;
      }

      setItems((current) => current.map((item) => (item.slug === slug ? { ...item, quantity } : item)));
    }
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
