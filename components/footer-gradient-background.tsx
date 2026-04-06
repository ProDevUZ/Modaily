import type { ReactNode } from "react";
import Image from "next/image";

type FooterGradientBackgroundProps = {
  children?: ReactNode;
  className?: string;
  imageSrc?: string;
};

export function FooterGradientBackground({
  children,
  className = "",
  imageSrc
}: FooterGradientBackgroundProps) {
  return (
    <div className={`relative overflow-hidden bg-[#8e1225] ${className}`}>
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          priority={false}
          className="object-cover object-center"
          aria-hidden="true"
        />
      ) : null}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
