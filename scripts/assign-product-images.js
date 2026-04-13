const { createPrismaClient } = require("./create-prisma-client");

const prisma = createPrismaClient();

const coverImage = "/images/Galary/Product2.png";

const galleryPool = [
  "/images/Galary/1.png",
  "/images/Galary/2.png",
  "/images/Galary/3.png",
  "/images/Galary/4.png",
  "/images/Galary/5.png",
  "/images/Galary/6.png",
  "/images/Galary/7.png",
  "/images/Galary/8.png",
  "/images/Galary/Product1.png",
  "/images/Galary/Product2.png",
  "/images/Galary/Product3.png",
  "/images/Galary/Product4.png",
  "/images/Galary/Product5.png"
];

function hashString(value) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function pickGallery(slug) {
  const offset = hashString(`${slug}-gallery`) % galleryPool.length;
  const rotated = galleryPool.slice(offset).concat(galleryPool.slice(0, offset));
  return rotated.slice(0, 6).map((imageUrl, index) => ({
    imageUrl,
    sortOrder: index + 1
  }));
}

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  for (const product of products) {
    const galleryImages = pickGallery(product.slug);

    await prisma.product.update({
      where: { id: product.id },
      data: {
        imageUrl: coverImage
      }
    });

    await prisma.productGalleryImage.deleteMany({
      where: { productId: product.id }
    });

    await prisma.productGalleryImage.createMany({
      data: galleryImages.map((image) => ({
        productId: product.id,
        imageUrl: image.imageUrl,
        sortOrder: image.sortOrder
      }))
    });
  }

  const galleryCount = await prisma.productGalleryImage.count();

  console.log(
    JSON.stringify(
      {
        productsUpdated: products.length,
        galleryImagesCreated: galleryCount
      },
      null,
      2
    )
  );
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
