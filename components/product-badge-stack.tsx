import type { StorefrontProductBadge } from "@/lib/product-badges";

type ProductBadgeStackProps = {
  badges: StorefrontProductBadge[];
  className?: string;
};

const badgeClassMap: Record<StorefrontProductBadge["kind"], string> = {
  discount: "bg-[#ff2a93] text-white",
  hit: "bg-[#fff100] text-black",
  new: "bg-[#E8FBF6] text-[#0F766E]"
};

export function ProductBadgeStack({ badges, className = "" }: ProductBadgeStackProps) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={`absolute left-0 top-0 z-10 flex flex-wrap items-start gap-[2px] ${className}`.trim()}>
      {badges.map((badge) => (
        <span
          key={`${badge.kind}-${badge.label}`}
          className={`inline-flex min-h-[34px] items-center justify-center px-2.5 text-[12px] font-semibold uppercase tracking-[0.03em] ${badgeClassMap[badge.kind]}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
