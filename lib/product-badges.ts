import type { Locale } from "@/lib/i18n";

export type StorefrontProductBadge = {
  kind: "discount" | "hit" | "new";
  label: string;
};

type BadgeSource = {
  price: number;
  discountAmount?: number | null;
  isHit?: boolean | null;
  isNew?: boolean | null;
};

const badgeLabels: Record<Locale, { hit: string; new: string }> = {
  uz: {
    hit: "XIT",
    new: "YANGI"
  },
  ru: {
    hit: "ХИТ",
    new: "НОВИНКА"
  },
  en: {
    hit: "HIT",
    new: "NEW"
  }
};

export function getDiscountPercent(price: number, discountAmount?: number | null) {
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(discountAmount) || !discountAmount || discountAmount <= 0) {
    return 0;
  }

  const percent = Math.round((discountAmount / price) * 100);
  return Math.min(100, Math.max(1, percent));
}

export function buildProductBadges(source: BadgeSource, locale: Locale): StorefrontProductBadge[] {
  const badges: StorefrontProductBadge[] = [];
  const discountPercent = getDiscountPercent(source.price, source.discountAmount);

  if (discountPercent > 0) {
    badges.push({
      kind: "discount",
      label: `${discountPercent}%`
    });
  }

  if (source.isHit) {
    badges.push({
      kind: "hit",
      label: badgeLabels[locale].hit
    });
  }

  if (source.isNew) {
    badges.push({
      kind: "new",
      label: badgeLabels[locale].new
    });
  }

  return badges;
}
