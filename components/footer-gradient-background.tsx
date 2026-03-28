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
    <div
      className={`relative overflow-hidden bg-[linear-gradient(135deg,#7e1021_0%,#9c1128_34%,#b40f2d_56%,#8e1225_100%)] ${className}`}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          priority={false}
          className="object-cover object-center opacity-35 mix-blend-multiply saturate-[0.92]"
          aria-hidden="true"
        />
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(106,10,29,0.74)_0%,rgba(153,17,40,0.54)_36%,rgba(181,19,46,0.44)_58%,rgba(118,14,30,0.72)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_82%,rgba(49,8,18,0.52)_0%,rgba(49,8,18,0.28)_14%,transparent_36%),radial-gradient(circle_at_48%_22%,rgba(255,54,96,0.16)_0%,rgba(255,54,96,0.08)_18%,transparent_38%),radial-gradient(circle_at_46%_86%,rgba(255,35,82,0.22)_0%,rgba(255,35,82,0.12)_22%,transparent_48%),radial-gradient(circle_at_84%_52%,rgba(111,14,30,0.18)_0%,rgba(111,14,30,0.08)_20%,transparent_42%)]" />

      <div className="absolute -left-[8%] top-[16%] h-[18rem] w-[18rem] rounded-full bg-[#320812]/35 blur-[90px] sm:h-[24rem] sm:w-[24rem] sm:blur-[120px] lg:h-[30rem] lg:w-[30rem] lg:blur-[150px]" />
      <div className="absolute left-[26%] top-[6%] h-[14rem] w-[28rem] rounded-full bg-[#ff3460]/10 blur-[80px] sm:h-[18rem] sm:w-[34rem] sm:blur-[110px] lg:h-[22rem] lg:w-[42rem] lg:blur-[140px]" />
      <div className="absolute left-[18%] bottom-[-12%] h-[20rem] w-[26rem] rounded-full bg-[#ff2c59]/16 blur-[95px] sm:h-[26rem] sm:w-[36rem] sm:blur-[125px] lg:h-[34rem] lg:w-[48rem] lg:blur-[160px]" />
      <div className="absolute right-[-6%] top-[20%] h-[16rem] w-[16rem] rounded-full bg-[#5e0b19]/22 blur-[85px] sm:h-[22rem] sm:w-[22rem] sm:blur-[110px] lg:h-[28rem] lg:w-[28rem] lg:blur-[145px]" />
      <div className="absolute left-[8%] top-[28%] h-[14rem] w-[14rem] rounded-full bg-black/18 blur-[110px] sm:h-[20rem] sm:w-[20rem] lg:h-[26rem] lg:w-[26rem]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,transparent_28%,transparent_72%,rgba(0,0,0,0.04)_100%)]" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
