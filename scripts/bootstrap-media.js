const { createPrismaClient } = require("./create-prisma-client");

const prisma = createPrismaClient();

const promoFallbacks = [
  "/images/Galary/Product1.png",
  "/images/Galary/Product2.png"
];

const galleryFallbacks = [
  "/images/Galary/1.png",
  "/images/Galary/2.png",
  "/images/Galary/3.png",
  "/images/Galary/4.png",
  "/images/Galary/5.png",
  "/images/Galary/6.png",
  "/images/Galary/7.png",
  "/images/Galary/8.png"
];

function isLegacyGalleryPath(value) {
  return !value || value.startsWith("/images/home/gallery-");
}

function isLegacyPromoPath(value) {
  return !value || value.startsWith("/images/home/promo-");
}

function isInvalidVideoUrl(value) {
  return !value || value.includes("example.com");
}

async function fixHeroAndAbout() {
  const hero = await prisma.homeHero.findFirst({ orderBy: { createdAt: "asc" } });
  if (hero && hero.imageUrl !== "/images/home/mainpage.jpg") {
    await prisma.homeHero.update({
      where: { id: hero.id },
      data: { imageUrl: "/images/home/mainpage.jpg" }
    });
  }

  const about = await prisma.homeAboutSection.findFirst({ orderBy: { createdAt: "asc" } });
  if (about && about.imageUrl !== "/images/Galary/about1.png") {
    await prisma.homeAboutSection.update({
      where: { id: about.id },
      data: { imageUrl: "/images/Galary/about1.png" }
    });
  }
}

async function fixPromoCards() {
  const cards = await prisma.homePromoCard.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  await Promise.all(
    cards.map((card, index) => {
      if (!isLegacyPromoPath(card.imageUrl || "")) {
        return Promise.resolve();
      }

      return prisma.homePromoCard.update({
        where: { id: card.id },
        data: {
          imageUrl: promoFallbacks[index % promoFallbacks.length]
        }
      });
    })
  );
}

async function fixGalleryItems() {
  const imageItems = await prisma.galleryItem.findMany({
    where: { type: "IMAGE" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });

  await Promise.all(
    imageItems.map((item, index) => {
      if (!isLegacyGalleryPath(item.imageUrl || "")) {
        return Promise.resolve();
      }

      return prisma.galleryItem.update({
        where: { id: item.id },
        data: {
          imageUrl: galleryFallbacks[index % galleryFallbacks.length]
        }
      });
    })
  );

  const videoItems = await prisma.galleryItem.findMany({
    where: { type: "VIDEO" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });

  await Promise.all(
    videoItems.map((item) => {
      if (!isInvalidVideoUrl(item.videoUrl || "")) {
        return Promise.resolve();
      }

      return prisma.galleryItem.update({
        where: { id: item.id },
        data: {
          active: false
        }
      });
    })
  );
}

async function main() {
  await fixHeroAndAbout();
  await fixPromoCards();
  await fixGalleryItems();
  console.log("Bootstrap media sync completed.");
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
