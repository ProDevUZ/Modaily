import type { Locale } from "@/lib/i18n";

export type BlogPageCopy = {
  listing: {
    title: string;
    allPosts: string;
    sortLabel: string;
    sortNewest: string;
    sortOldest: string;
    viewThree: string;
    viewTwo: string;
    viewOne: string;
    featuredLabel: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  detail: {
    publishedLabel: string;
    categoryLabel: string;
    featuredLabel: string;
    linkedProductLabel: string;
    openProduct: string;
    backToBlog: string;
  };
  meta: {
    listingTitle: string;
    listingDescription: string;
  };
};

const copy: Record<Locale, BlogPageCopy> = {
  uz: {
    listing: {
      title: "Blog",
      allPosts: "Barcha postlar",
      sortLabel: "Saralash",
      sortNewest: "Avval yangilari",
      sortOldest: "Avval eskilari",
      viewThree: "Uch ustun",
      viewTwo: "Ikki ustun",
      viewOne: "Bir ustun",
      featuredLabel: "Tavsiya etiladi",
      emptyTitle: "Postlar hozircha yo'q",
      emptyDescription: "Blog uchun birinchi materiallar tez orada shu yerda ko'rinadi."
    },
    detail: {
      publishedLabel: "Sana",
      categoryLabel: "Kategoriya",
      featuredLabel: "Tavsiya etiladi",
      linkedProductLabel: "Bog'langan mahsulot",
      openProduct: "Mahsulotni ochish",
      backToBlog: "Blogga qaytish"
    },
    meta: {
      listingTitle: "Blog | Modaily",
      listingDescription: "Modaily yangiliklari, maqolalari va skincare bo'yicha foydali materiallar."
    }
  },
  ru: {
    listing: {
      title: "Блог",
      allPosts: "Все блоги",
      sortLabel: "Сортировать по",
      sortNewest: "Сначала новые",
      sortOldest: "Сначала старые",
      viewThree: "Три колонки",
      viewTwo: "Две колонки",
      viewOne: "Одна колонка",
      featuredLabel: "Featured post",
      emptyTitle: "Постов пока нет",
      emptyDescription: "Первые материалы для блога появятся здесь, как только редакция их опубликует."
    },
    detail: {
      publishedLabel: "Дата",
      categoryLabel: "Категория",
      featuredLabel: "Featured",
      linkedProductLabel: "Связанный товар",
      openProduct: "Открыть товар",
      backToBlog: "Назад в блог"
    },
    meta: {
      listingTitle: "Блог | Modaily",
      listingDescription: "Новости бренда, статьи и редакционные материалы Modaily."
    }
  },
  en: {
    listing: {
      title: "Blog",
      allPosts: "All posts",
      sortLabel: "Sort by",
      sortNewest: "Newest first",
      sortOldest: "Oldest first",
      viewThree: "Three columns",
      viewTwo: "Two columns",
      viewOne: "One column",
      featuredLabel: "Featured post",
      emptyTitle: "No posts yet",
      emptyDescription: "The first editorials and updates will appear here once they are published."
    },
    detail: {
      publishedLabel: "Published",
      categoryLabel: "Category",
      featuredLabel: "Featured",
      linkedProductLabel: "Linked product",
      openProduct: "Open product",
      backToBlog: "Back to blog"
    },
    meta: {
      listingTitle: "Blog | Modaily",
      listingDescription: "Brand updates, editorials and skincare reads from Modaily."
    }
  }
};

export function getBlogPageCopy(locale: Locale) {
  return copy[locale];
}
