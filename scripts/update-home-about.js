const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const data = {
  titleUz: "O MODAILY",
  titleRu: "О MODAILY",
  titleEn: "ABOUT MODAILY",
  descriptionUz:
    "Modaily — hayot sifatini yaxshilash maqsadida yaratilgan Britaniyaning kundalik parvarish brendi. Biz tashqi ko'rinishga g'amxo'rlik har bir inson uchun qulay va oson kundalik odatga aylanishi kerakligini isbotlashga intilamiz.",
  descriptionRu:
    "Modaily — это британский бренд ежедневного ухода, созданный с целью улучшения качества жизни людей. Мы стремимся доказать, что забота о своем внешнем виде должна стать удобной и легкой повседневной привычкой для каждого.",
  descriptionEn:
    "Modaily is a British everyday skincare brand created to improve quality of life. We believe self-care should become a simple, comfortable daily habit for everyone.",
  secondaryTitleUz: "MODAILY",
  secondaryTitleRu: "MODAILY",
  secondaryTitleEn: "MODAILY",
  secondaryDescriptionUz:
    "Modaily kosmetikasi olimlar va dermatologlar ishlanmalari asosida yaratiladi. Har bir formula teri tuzilishi, shahar muhiti va zamonaviy hayot ritmini inobatga olgan holda ishlab chiqiladi. Biz uchun mahsulot nafaqat chiroyli qadoqlangan, balki ilmiy asoslangan tarkib, isbotlangan xavfsizlik va haqiqiy natijaga ega bo'lishi kerak.",
  secondaryDescriptionRu:
    "Косметика Modaily создается на основе разработок ученых и дерматологов. Каждая формула разрабатывается с учетом структуры кожи, городской среды и ритма современной жизни. Для нас продукт должен быть не только красиво упакован, но и иметь научно обоснованный состав, проверенную безопасность и реальные результаты.",
  secondaryDescriptionEn:
    "Modaily skincare is created from the work of scientists and dermatologists. Every formula is developed with skin structure, urban environments and the pace of modern life in mind. For us, a product should be more than beautifully packaged; it must also have a scientifically grounded formula, proven safety and real results.",
  bottomDescriptionUz:
    "Brend falsafasi — hayotni soddalashtirish, teriga g'amxo'rlik qilish va o'zingizni sevish. Shu sabab Modaily minimalistik, tushunarli va o'zaro bog'liq mahsulotlar yaratadi: har bir iste'molchi uy sharoitida, ortiqcha murakkabliksiz, har kuni o'z terisiga professional darajada g'amxo'rlik qila oladi.",
  bottomDescriptionRu:
    "Философия бренда — «упрощай свою жизнь, заботься о коже, люби себя». Поэтому Modaily создает минималистичные, понятные и взаимосвязанные продукты: каждый потребитель может профессионально заботиться о своей коже в домашних условиях, без лишних сложностей, каждый день.",
  bottomDescriptionEn:
    "The brand philosophy is simple: simplify life, care for your skin and love yourself. That is why Modaily creates minimalist, easy-to-understand and connected products so every customer can care for their skin professionally at home, without unnecessary complexity, every day.",
  imageUrl: "/images/Galary/about1.png"
};

async function main() {
  const current = await prisma.homeAboutSection.findFirst({
    orderBy: { createdAt: "asc" }
  });

  const result = current
    ? await prisma.homeAboutSection.update({
        where: { id: current.id },
        data
      })
    : await prisma.homeAboutSection.create({ data });

  console.log(JSON.stringify({ id: result.id, imageUrl: result.imageUrl }));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
