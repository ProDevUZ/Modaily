import type { Locale } from "@/lib/i18n";

export type ProductPageCopy = {
  breadcrumbs: {
    home: string;
    catalog: string;
  };
  badges: {
    novelty: string;
    reviews: string;
  };
  labels: {
    size: string;
    sku: string;
    category: string;
    description: string;
    details: string;
    packaging: string;
    features: string;
    usage: string;
    reviews: string;
    reviewsHeading: string;
    leaveReview: string;
    yourName: string;
    yourComment: string;
    rating: string;
    recommended: string;
    oneClick: string;
  };
  actions: {
    submitReview: string;
    addToCart: string;
    loadMore: string;
  };
  placeholders: {
    noReviews: string;
    reviewSuccess: string;
    shareThoughts: string;
  };
};

const copy: Record<Locale, ProductPageCopy> = {
  uz: {
    breadcrumbs: {
      home: "Bosh sahifa",
      catalog: "Katalog"
    },
    badges: {
      novelty: "Yangi",
      reviews: "ta fikr"
    },
    labels: {
      size: "Hajm",
      sku: "SKU",
      category: "Kategoriya",
      description: "Tavsif",
      details: "Detali",
      packaging: "Qadoq",
      features: "Asosiy funksiyalar",
      usage: "Qo'llash usuli",
      reviews: "Reyting",
      reviewsHeading: "fikr",
      leaveReview: "Comment qoldirish",
      yourName: "Ismingiz",
      yourComment: "Fikringiz",
      rating: "Reyting",
      recommended: "Sizga yoqishi mumkin",
      oneClick: "1 klikda xarid"
    },
    actions: {
      submitReview: "Yuborish",
      addToCart: "Savatchaga qo'shish",
      loadMore: "Ko'proq yuklash"
    },
    placeholders: {
      noReviews: "Hozircha product uchun fikr qoldirilmagan.",
      reviewSuccess: "Fikringiz qabul qilindi.",
      shareThoughts: "Fikringizni ulashing"
    }
  },
  ru: {
    breadcrumbs: {
      home: "Главная страница",
      catalog: "Каталог"
    },
    badges: {
      novelty: "Новинка",
      reviews: "отзывов"
    },
    labels: {
      size: "Размер",
      sku: "SKU",
      category: "Категория",
      description: "Описания",
      details: "Детали",
      packaging: "Упаковка",
      features: "Основные функции",
      usage: "Способ применения",
      reviews: "Рейтинг",
      reviewsHeading: "Отзывов",
      leaveReview: "Оставить комментарий",
      yourName: "Ваше имя",
      yourComment: "Ваш комментарий",
      rating: "Рейтинг",
      recommended: "ВОЗМОЖНО ВАМ ПОНРАВИТСЯ",
      oneClick: "Купить в один клик"
    },
    actions: {
      submitReview: "Отправить",
      addToCart: "Добавить в корзину",
      loadMore: "Загрузить больше"
    },
    placeholders: {
      noReviews: "Пока нет отзывов по этому товару.",
      reviewSuccess: "Ваш отзыв отправлен.",
      shareThoughts: "Поделитесь своими мыслями"
    }
  },
  en: {
    breadcrumbs: {
      home: "Homepage",
      catalog: "Catalog"
    },
    badges: {
      novelty: "New",
      reviews: "reviews"
    },
    labels: {
      size: "Size",
      sku: "SKU",
      category: "Category",
      description: "Description",
      details: "Details",
      packaging: "Packaging",
      features: "Key features",
      usage: "How to use",
      reviews: "Rating",
      reviewsHeading: "Reviews",
      leaveReview: "Leave a comment",
      yourName: "Your name",
      yourComment: "Your comment",
      rating: "Rating",
      recommended: "YOU MAY ALSO LIKE",
      oneClick: "Buy in one click"
    },
    actions: {
      submitReview: "Submit",
      addToCart: "Add to cart",
      loadMore: "Load more"
    },
    placeholders: {
      noReviews: "No reviews have been posted for this product yet.",
      reviewSuccess: "Your review has been submitted.",
      shareThoughts: "Share your thoughts"
    }
  }
};

export function getProductPageCopy(locale: Locale) {
  return copy[locale];
}
