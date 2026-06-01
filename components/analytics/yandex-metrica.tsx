"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

const YANDEX_METRICA_COUNTER_ID = Number(process.env.NEXT_PUBLIC_YANDEX_METRICA_COUNTER_ID || "109562700");

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

function buildPageUrl(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export function YandexMetrica() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const currentUrl = buildPageUrl(pathname, searchParams);

    if (previousUrlRef.current === null) {
      previousUrlRef.current = currentUrl;
      return;
    }

    if (previousUrlRef.current === currentUrl) {
      return;
    }

    if (typeof window.ym === "function") {
      window.ym(YANDEX_METRICA_COUNTER_ID, "hit", currentUrl, {
        referer: previousUrlRef.current,
        title: document.title
      });
    }

    previousUrlRef.current = currentUrl;
  }, [pathname, searchParams]);

  return (
    <>
      <Script id="yandex-metrica" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {
              if (document.scripts[j].src === r) { return; }
            }
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${YANDEX_METRICA_COUNTER_ID}, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
          });
        `}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YANDEX_METRICA_COUNTER_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
