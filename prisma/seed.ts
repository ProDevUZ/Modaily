import { PrismaClient } from "@prisma/client";

import { products } from "../lib/products";

const prisma = new PrismaClient();

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const [userCount, categoryCount, productCount] = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.product.count()
  ]);

  if (userCount > 0 || categoryCount > 0 || productCount > 0) {
    console.log("Database already contains data. Skipping seed.");
    return;
  }

  const categoryMap = new Map<string, string>();

  for (const product of products) {
    const slug = slugify(product.category.en);

    if (!categoryMap.has(slug)) {
      const category = await prisma.category.create({
        data: {
          slug,
          nameUz: product.category.uz,
          nameRu: product.category.ru,
          nameEn: product.category.en,
          descriptionUz: `${product.category.uz} uchun Modaily assortimenti`,
          descriptionRu: `Ассортимент Modaily для категории ${product.category.ru}`,
          descriptionEn: `Modaily assortment for ${product.category.en}`
        }
      });

      categoryMap.set(slug, category.id);
    }
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
        colorFrom: product.colors[0],
        colorTo: product.colors[1],
        categoryId
      }
    });
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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
