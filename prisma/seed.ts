import { PrismaClient } from "@prisma/client";

import { defaultHomeAbout, defaultHomeHero, defaultSiteSettings } from "../lib/content-defaults";
import { createSqliteAdapter } from "../lib/prisma-adapter";
import { products } from "../lib/products";

const prisma = new PrismaClient({
  adapter: createSqliteAdapter()
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function seedCatalog() {
  const [categoryCount, productCount] = await Promise.all([prisma.category.count(), prisma.product.count()]);

  if (categoryCount > 0 || productCount > 0) {
    return;
  }

  const categoryMap = new Map<string, string>();

  for (const product of products) {
    const slug = slugify(product.category.en);

    if (categoryMap.has(slug)) {
      continue;
    }

    const category = await prisma.category.create({
      data: {
        slug,
        nameUz: product.category.uz,
        nameRu: product.category.ru,
        nameEn: product.category.en,
        descriptionUz: `${product.category.uz} uchun Modaily assortimenti`,
        descriptionRu: `РђСЃСЃРѕСЂС‚РёРјРµРЅС‚ Modaily РґР»СЏ РєР°С‚РµРіРѕСЂРёРё ${product.category.ru}`,
        descriptionEn: `Modaily assortment for ${product.category.en}`
      }
    });

    categoryMap.set(slug, category.id);
  }

  for (const [index, product] of products.entries()) {
    const categoryId = categoryMap.get(slugify(product.category.en));

    if (!categoryId) {
      continue;
    }

    await prisma.product.create({
      data: {
        sku: `MDL-${String(index + 1).padStart(3, "0")}`,
        slug: product.slug,
        nameUz: product.translations.uz.name,
        nameRu: product.translations.ru.name,
        nameEn: product.translations.en.name,
        shortDescriptionUz: product.translations.uz.shortDescription,
        shortDescriptionRu: product.translations.ru.shortDescription,
        shortDescriptionEn: product.translations.en.shortDescription,
        descriptionUz: product.translations.uz.description,
        descriptionRu: product.translations.ru.description,
        descriptionEn: product.translations.en.description,
        size: product.size,
        price: product.price,
        stock: 25,
        active: true,
        isBestseller: index < 4,
        homeSortOrder: index < 4 ? index + 1 : 0,
        imageUrl: null,
        colorFrom: product.colors[0],
        colorTo: product.colors[1],
        categoryId,
        categoryLinks: {
          create: {
            categoryId,
            sortOrder: 0
          }
        }
      }
    });
  }
}

async function seedUsers() {
  const userCount = await prisma.user.count();

  if (userCount > 0) {
    return;
  }

  await prisma.user.createMany({
    data: [
      {
        fullName: "Sabina Karimova",
        email: "sabina@example.com",
        phone: "+998901112233",
        city: "Tashkent",
        notes: "Sensitive skin customer"
      },
      {
        fullName: "Madina Rasulova",
        email: "madina@example.com",
        phone: "+998935556677",
        city: "Samarkand",
        notes: "Interested in vitamin C and SPF"
      },
      {
        fullName: "Olga Petrova",
        email: "olga@example.com",
        phone: "+998998887766",
        city: "Tashkent",
        notes: "Repeat buyer"
      }
    ]
  });
}

async function seedContent() {
  const [siteSettingsCount, heroCount, aboutCount, promoCount, galleryCount, testimonialCount, bestsellerCount] = await Promise.all([
    prisma.siteSettings.count(),
    prisma.homeHero.count(),
    prisma.homeAboutSection.count(),
    prisma.homePromoCard.count(),
    prisma.galleryItem.count(),
    prisma.testimonial.count(),
    prisma.product.count({ where: { isBestseller: true } })
  ]);

  if (siteSettingsCount === 0) {
    await prisma.siteSettings.create({ data: defaultSiteSettings });
  }

  if (heroCount === 0) {
    await prisma.homeHero.create({ data: defaultHomeHero });
  }

  if (aboutCount === 0) {
    await prisma.homeAboutSection.create({ data: defaultHomeAbout });
  }

  if (promoCount === 0) {
    await prisma.homePromoCard.createMany({
      data: [
        {
          titleUz: "Kun oxirida teringizga bir necha daqiqa ajrating",
          titleRu: "В конце дня уделите себе несколько минут...",
          titleEn: "Take a few calm minutes at the end of the day",
          descriptionUz: "Editorial karta uchun demo kontent.",
          descriptionRu: "Тонер глубоко увлажняет кожу и поддерживает мягкость.",
          descriptionEn: "Sample editorial copy for the first promo card.",
          buttonLabelUz: "Batafsil",
          buttonLabelRu: "Узнать подробнее",
          buttonLabelEn: "Learn more",
          buttonLink: "/ru/catalog",
          imageUrl: "/images/Galary/Product1.png",
          sortOrder: 1,
          active: true
        },
        {
          titleUz: "Collagen cream bilan kundalik glow",
          titleRu: "SLIN LIFTING COLLAGEN CREAM",
          titleEn: "Collagen cream daily ritual",
          descriptionUz: "Ikkinchi editorial karta uchun demo kontent.",
          descriptionRu: "Помогает коже выглядеть более упругой и гладкой.",
          descriptionEn: "Sample editorial copy for the second promo card.",
          buttonLabelUz: "Batafsil",
          buttonLabelRu: "Узнать подробнее",
          buttonLabelEn: "Learn more",
          buttonLink: "/ru/catalog",
          imageUrl: "/images/Galary/Product2.png",
          sortOrder: 2,
          active: true
        }
      ]
    });
  }

  if (galleryCount === 0) {
    await prisma.galleryItem.createMany({
      data: [
        { type: "IMAGE", titleRu: "Gallery 1", imageUrl: "/images/Galary/1.png", sortOrder: 1, active: true },
        { type: "IMAGE", titleRu: "Gallery 2", imageUrl: "/images/Galary/2.png", sortOrder: 2, active: true },
        { type: "IMAGE", titleRu: "Gallery 3", imageUrl: "/images/Galary/3.png", sortOrder: 3, active: true },
        { type: "IMAGE", titleRu: "Gallery 4", imageUrl: "/images/Galary/4.png", sortOrder: 4, active: true }
      ]
    });
  }

  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          authorName: "Aziza",
          authorRoleRu: "Крем для рук Silk Touch Modaily",
          bodyUz: "Har kuni ishlatishga qulay, terida yengil turadi.",
          bodyRu: "Использую после очищающей пены MODAILY — мягко очищает и не сушит кожу.",
          bodyEn: "Comfortable for everyday use and feels light on the skin.",
          avatarUrl: "/images/home/avatar-1.jpg",
          rating: 5,
          sortOrder: 1,
          active: true
        },
        {
          authorName: "Kamola",
          authorRoleRu: "Крем для рук Silk Touch Modaily",
          bodyUz: "Qadoq dizayni ham, natija ham yoqdi.",
          bodyRu: "Очень понравился дизайн упаковки и качество продукта.",
          bodyEn: "I liked both the packaging design and the product quality.",
          avatarUrl: "/images/home/avatar-2.jpg",
          rating: 5,
          sortOrder: 2,
          active: true
        }
      ]
    });
  }

  if (bestsellerCount === 0) {
    const productRows = await prisma.product.findMany({
      orderBy: { createdAt: "asc" },
      take: 4
    });

    await Promise.all(
      productRows.map((product, index) =>
        prisma.product.update({
          where: { id: product.id },
          data: {
            isBestseller: true,
            homeSortOrder: index + 1
          }
        })
      )
    );
  }
}

async function main() {
  await seedCatalog();
  await seedUsers();
  await seedContent();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
