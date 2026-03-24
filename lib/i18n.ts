export const locales = ["uz", "ru", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: `/${Locale}` = "/uz";

export const localeNames: Record<Locale, string> = {
  uz: "UZ",
  ru: "RU",
  en: "EN"
};

export type Currency = {
  code: string;
  symbol: string;
};

type DictionaryShape = {
  nav: {
    home: string;
    catalog: string;
    cart: string;
    admin: string;
  };
  actions: {
    addToCart: string;
  };
  currency: Currency;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    cardLabel: string;
    stats: { value: string; label: string }[];
  };
  home: {
    featured: {
      eyebrow: string;
      title: string;
      description: string;
      cta: string;
    };
    highlights: {
      label: string;
      title: string;
      description: string;
    }[];
  };
  catalog: {
    eyebrow: string;
    h1: string;
    description: string;
  };
  productPage: {
    size: string;
    origin: string;
    originValue: string;
    price: string;
    readyToShip: string;
    checkoutHint: string;
    benefits: string;
    howToUse: string;
  };
  cart: {
    eyebrow: string;
    h1: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyCta: string;
    remove: string;
    summaryEyebrow: string;
    summaryTitle: string;
    itemsLabel: string;
    deliveryLabel: string;
    deliveryValue: string;
    totalLabel: string;
    checkoutCta: string;
    checkoutHint: string;
  };
  footer: {
    copy: string;
  };
  meta: {
    home: {
      title: string;
      description: string;
    };
    catalog: {
      title: string;
      description: string;
    };
    cart: {
      title: string;
      description: string;
    };
  };
};

const dictionaries: Record<Locale, DictionaryShape> = {
  uz: {
    nav: {
      home: "Bosh sahifa",
      catalog: "Katalog",
      cart: "Savat",
      admin: "Admin"
    },
    actions: {
      addToCart: "Savatga qo'shish"
    },
    currency: {
      code: "USD",
      symbol: "$"
    },
    hero: {
      eyebrow: "Formulated in UK",
      title: "Ayollar uchun kundalik teri parvarishini premium ritualga aylantiradigan skincare katalogi.",
      description:
        "Modaily Yevropada ishlab chiqilgan, zamonaviy ingredientlarga ega va mobil qurilmalarda tez ishlaydigan skincare storefront. Boshlanishida 15 SKU bilan, keyin esa 25-30 mahsulotga kengayish uchun tayyor struktura.",
      primaryCta: "Katalogni ko'rish",
      secondaryCta: "Top mahsulot",
      cardLabel: "Featured formula",
      stats: [
        { value: "15 SKU", label: "Start assortimenti" },
        { value: "3 Til", label: "UZ / RU / EN" },
        { value: "100%", label: "Mobil optimallashtirish" }
      ]
    },
    home: {
      featured: {
        eyebrow: "Best sellers",
        title: "Tez start uchun tayyor bestseller assortiment",
        description:
          "Katalog sahifalari, mahsulot kartalari va product detail sahifalari SEO uchun title, description va optimallashtirilgan sarlavhalar bilan tayyorlangan.",
        cta: "Barcha mahsulotlar"
      },
      highlights: [
        {
          label: "01",
          title: "Barrier-first skincare",
          description: "Quruqlik, sezuvchanlik va notekis teksturaga qarshi kundalik foydalanish uchun formulalar."
        },
        {
          label: "02",
          title: "Mobile commerce",
          description: "Har bir blok mobil foydalanuvchi uchun yengil, tez va barmoq bilan qulay navigatsiya asosida yozildi."
        },
        {
          label: "03",
          title: "SEO-ready pages",
          description: "Har bir locale va mahsulot sahifasi uchun meta ma'lumotlar va sitemap struktura berildi."
        }
      ]
    },
    catalog: {
      eyebrow: "Skincare lineup",
      h1: "Ayollar uchun yuz terisini parvarish qiluvchi kosmetika",
      description:
        "Tozalash, namlash, himoya va glow uchun tanlangan UK-formulated skincare mahsulotlari. Har bir SKU o'suvchi assortiment uchun kengaytiriladigan data model bilan saqlanadi."
    },
    productPage: {
      size: "Hajm",
      origin: "Ishlab chiqilgan joy",
      originValue: "United Kingdom",
      price: "Narx",
      readyToShip: "Toshkent bo'ylab yetkazib berish va click-to-pay flow uchun tayyor",
      checkoutHint: "1 klik bilan savatga qo'shing va checkout oqimini davom ettiring",
      benefits: "Asosiy foydalar",
      howToUse: "Qanday ishlatiladi"
    },
    cart: {
      eyebrow: "Your bag",
      h1: "Savat va buyurtma xulosasi",
      description: "Mijoz shu yerda mahsulot sonini boshqaradi va keyingi bosqichda to'lov integratsiyasiga o'tadi.",
      emptyTitle: "Savat hozircha bo'sh",
      emptyDescription: "Katalogdan mos skincare mahsulotini tanlab, savatga qo'shing.",
      emptyCta: "Katalogga o'tish",
      remove: "O'chirish",
      summaryEyebrow: "Checkout",
      summaryTitle: "Buyurtma xulosasi",
      itemsLabel: "Pozitsiyalar",
      deliveryLabel: "Yetkazib berish",
      deliveryValue: "Hisob-kitobda",
      totalLabel: "Jami",
      checkoutCta: "To'lovga o'tish",
      checkoutHint: "Bu joy Click, Payme yoki Stripe integratsiyasi uchun tayyor checkout entry sifatida ishlatiladi."
    },
    footer: {
      copy: "Modaily.com uchun storefront bazasi: ko'p til, responsiv katalog, mahsulot SEO va e-commerce oqimini boshlash uchun tayyor frontend."
    },
    meta: {
      home: {
        title: "Modaily skincare store",
        description: "Modaily uchun ko'p tilli, mobilga mos skincare storefront va product showcase."
      },
      catalog: {
        title: "Skincare katalog",
        description: "Ayollar uchun UK-formulated skincare mahsulotlar katalogi."
      },
      cart: {
        title: "Savat",
        description: "Modaily buyurtma va checkout sahifasi."
      }
    }
  },
  ru: {
    nav: {
      home: "Главная",
      catalog: "Каталог",
      cart: "Корзина",
      admin: "Админ"
    },
    actions: {
      addToCart: "Добавить в корзину"
    },
    currency: {
      code: "USD",
      symbol: "$"
    },
    hero: {
      eyebrow: "Formulated in UK",
      title: "Уходовая косметика для женщин с премиальной подачей и удобным мобильным заказом.",
      description:
        "Modaily это multilingual skincare storefront с европейским позиционированием, каталогом из 15 SKU на старте и готовой структурой для расширения до 25-30 продуктов.",
      primaryCta: "Смотреть каталог",
      secondaryCta: "Фокус-продукт",
      cardLabel: "Featured formula",
      stats: [
        { value: "15 SKU", label: "Стартовая линейка" },
        { value: "3 Языка", label: "UZ / RU / EN" },
        { value: "100%", label: "Mobile-first" }
      ]
    },
    home: {
      featured: {
        eyebrow: "Best sellers",
        title: "Готовая витрина для запуска продаж skincare",
        description:
          "Главная, каталог, карточки товара и корзина собраны как foundation для полноценного e-commerce с SEO на каждой странице.",
        cta: "Все продукты"
      },
      highlights: [
        {
          label: "01",
          title: "Barrier-first skincare",
          description: "Формулы для восстановления, увлажнения и ежедневного комфорта чувствительной кожи."
        },
        {
          label: "02",
          title: "Mobile commerce",
          description: "Блоки собраны под быстрый просмотр, добавление в корзину и оформление заказа с телефона."
        },
        {
          label: "03",
          title: "SEO-ready pages",
          description: "Для страниц и товаров предусмотрены title, description, h1, sitemap и локализованные URL."
        }
      ]
    },
    catalog: {
      eyebrow: "Skincare lineup",
      h1: "Уходовая косметика для лица для женщин",
      description:
        "Очищение, сыворотки, кремы и SPF с акцентом на европейское качество и удобный рост ассортимента в одном каталоге."
    },
    productPage: {
      size: "Объём",
      origin: "Разработано",
      originValue: "Великобритания",
      price: "Цена",
      readyToShip: "Готово для локальной доставки и быстрого checkout flow",
      checkoutHint: "Добавьте товар в корзину и продолжайте путь к оплате",
      benefits: "Ключевые преимущества",
      howToUse: "Как использовать"
    },
    cart: {
      eyebrow: "Your bag",
      h1: "Корзина и итог заказа",
      description: "Здесь пользователь управляет количеством товаров и переходит к будущей интеграции оплаты.",
      emptyTitle: "Корзина пока пустая",
      emptyDescription: "Выберите подходящий skincare продукт из каталога и добавьте его в корзину.",
      emptyCta: "Перейти в каталог",
      remove: "Удалить",
      summaryEyebrow: "Checkout",
      summaryTitle: "Итог заказа",
      itemsLabel: "Позиции",
      deliveryLabel: "Доставка",
      deliveryValue: "На расчёте",
      totalLabel: "Итого",
      checkoutCta: "Перейти к оплате",
      checkoutHint: "Этот блок подготовлен как вход в checkout для Click, Payme или Stripe."
    },
    footer: {
      copy: "Фундамент storefront для Modaily.com: мультиязычность, адаптивный каталог, SEO карточек товаров и стартовая e-commerce логика."
    },
    meta: {
      home: {
        title: "Modaily уходовая косметика",
        description: "Мультиязычный storefront Modaily для продажи skincare товаров."
      },
      catalog: {
        title: "Каталог skincare",
        description: "Каталог уходовой косметики Modaily с локализованными страницами."
      },
      cart: {
        title: "Корзина",
        description: "Страница заказа и checkout для Modaily."
      }
    }
  },
  en: {
    nav: {
      home: "Home",
      catalog: "Catalog",
      cart: "Cart",
      admin: "Admin"
    },
    actions: {
      addToCart: "Add to cart"
    },
    currency: {
      code: "USD",
      symbol: "$"
    },
    hero: {
      eyebrow: "Formulated in UK",
      title: "Skincare commerce for women with an editorial catalog and a mobile-first shopping flow.",
      description:
        "Modaily is a multilingual storefront for European-positioned skincare, launching with 15 SKUs and structured to scale toward a wider routine-led assortment.",
      primaryCta: "Browse catalog",
      secondaryCta: "View hero product",
      cardLabel: "Featured formula",
      stats: [
        { value: "15 SKU", label: "Launch assortment" },
        { value: "3 Lang", label: "UZ / RU / EN" },
        { value: "100%", label: "Responsive layout" }
      ]
    },
    home: {
      featured: {
        eyebrow: "Best sellers",
        title: "A launch-ready skincare assortment with strong category storytelling",
        description:
          "The storefront includes localized landing pages, product detail pages, cart flows and SEO metadata prepared for organic growth.",
        cta: "See all products"
      },
      highlights: [
        {
          label: "01",
          title: "Barrier-first skincare",
          description: "Daily formulas focused on hydration, glow, recovery and comfort for modern routines."
        },
        {
          label: "02",
          title: "Mobile commerce",
          description: "Every section is designed to scan fast, convert well and remain easy to extend into a full checkout system."
        },
        {
          label: "03",
          title: "SEO-ready pages",
          description: "Each route ships with localized titles, descriptions, h1 structure and sitemap coverage."
        }
      ]
    },
    catalog: {
      eyebrow: "Skincare lineup",
      h1: "Women’s facial skincare catalog",
      description:
        "A curated lineup of cleansers, serums, creams and SPF products formulated in the UK and presented for multilingual commerce."
    },
    productPage: {
      size: "Size",
      origin: "Formulated in",
      originValue: "United Kingdom",
      price: "Price",
      readyToShip: "Prepared for local delivery and a fast payment handoff",
      checkoutHint: "Add to cart in one click and continue to checkout",
      benefits: "Key benefits",
      howToUse: "How to use"
    },
    cart: {
      eyebrow: "Your bag",
      h1: "Cart and order summary",
      description: "Customers manage product quantities here before moving into a payment integration flow.",
      emptyTitle: "Your cart is empty",
      emptyDescription: "Pick the right skincare essential from the catalog and add it to your bag.",
      emptyCta: "Go to catalog",
      remove: "Remove",
      summaryEyebrow: "Checkout",
      summaryTitle: "Order summary",
      itemsLabel: "Line items",
      deliveryLabel: "Delivery",
      deliveryValue: "Calculated later",
      totalLabel: "Total",
      checkoutCta: "Proceed to payment",
      checkoutHint: "This call-to-action is ready to become the checkout handoff for Click, Payme or Stripe."
    },
    footer: {
      copy: "Storefront foundation for Modaily.com with multilingual routing, responsive catalog pages, product SEO and a starter commerce flow."
    },
    meta: {
      home: {
        title: "Modaily skincare commerce",
        description: "Multilingual skincare storefront for Modaily with mobile-first UX and SEO-ready product pages."
      },
      catalog: {
        title: "Skincare catalog",
        description: "Localized Modaily skincare catalog for women with UK-formulated products."
      },
      cart: {
        title: "Cart",
        description: "Order summary and checkout entry page for Modaily."
      }
    }
  }
};

export type Dictionary = DictionaryShape;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
