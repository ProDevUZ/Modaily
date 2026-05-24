import { getImageProps } from "next/image";

type HomeHeroImageProps = {
  desktopSrc?: string | null;
  mobileSrc?: string | null;
  fallbackSrc: string;
  alt: string;
};

function validSrc(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed && !trimmed.includes("example.com") ? trimmed : "";
}

export function HomeHeroImage({
  desktopSrc,
  mobileSrc,
  fallbackSrc,
  alt
}: HomeHeroImageProps) {
  const desktopImageSrc = validSrc(desktopSrc) || fallbackSrc;
  const mobileImageSrc = validSrc(mobileSrc) || desktopImageSrc;
  const common = {
    alt,
    sizes: "100vw",
    quality: 90,
    priority: true
  };
  const {
    props: { srcSet: desktopSrcSet }
  } = getImageProps({
    ...common,
    src: desktopImageSrc,
    width: 1440,
    height: 555
  });
  const {
    props: { srcSet: mobileSrcSet, ...imageProps }
  } = getImageProps({
    ...common,
    src: mobileImageSrc,
    width: 750,
    height: 1148
  });

  return (
    <picture className="col-start-1 row-start-1 block h-full w-full">
      <source media="(min-width: 1024px)" srcSet={desktopSrcSet} sizes="100vw" />
      <source media="(max-width: 1023px)" srcSet={mobileSrcSet} sizes="100vw" />
      <img
        {...imageProps}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="h-full w-full object-cover object-[right_top] lg:object-center"
      />
    </picture>
  );
}
