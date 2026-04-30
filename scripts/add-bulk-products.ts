import { PrismaClient } from "@prisma/client";

import { createSqliteAdapter } from "../lib/prisma-adapter";
import { products as baseProducts } from "../lib/products";

const prisma = new PrismaClient({
  adapter: createSqliteAdapter()
});

type SkinType = "dry" | "combination" | "oily" | "sensitive";
type CategorySlug = "serum" | "penka" | "moisturizer" | "toner";

type LocaleText = { uz: string; ru: string; en: string };

type Blueprint = {
  key: string;
  categorySlug: CategorySlug;
  skinType: SkinType;
  size: string;
  price: number;
  stock: number;
  colors: [string, string];
  ingredientLead: LocaleText;
  benefit: LocaleText;
  use: LocaleText;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const categoryMeta: Record<CategorySlug, { nameUz: string; nameRu: string; nameEn: string }> = {
  serum: { nameUz: "Sivorotka", nameRu: "Сыворотка", nameEn: "Serum" },
  penka: { nameUz: "Penka", nameRu: "Пенка", nameEn: "Foam Cleanser" },
  moisturizer: { nameUz: "Krem", nameRu: "Крем", nameEn: "Cream" },
  toner: { nameUz: "Toner", nameRu: "Тонер", nameEn: "Toner" }
};

const titleMeta: Record<string, { uz: string; ru: string; en: string; shortUz: string; shortRu: string; shortEn: string }> = {};
const blueprints: Blueprint[] = [];

function addMeta(
  key: string,
  title: { uz: string; ru: string; en: string },
  shortText: { uz: string; ru: string; en: string }
) {
  titleMeta[key] = {
    uz: title.uz,
    ru: title.ru,
    en: title.en,
    shortUz: shortText.uz,
    shortRu: shortText.ru,
    shortEn: shortText.en
  };
}

function addBlueprint(blueprint: Blueprint) {
  blueprints.push(blueprint);
}

function makeDescription(shortText: LocaleText, ingredientLead: LocaleText, benefit: LocaleText): LocaleText {
  return {
    uz: `${shortText.uz} ${ingredientLead.uz} bilan formula teriga qulay parvarish beradi va ${benefit.uz}.`,
    ru: `${shortText.ru} Формула с ${ingredientLead.ru.toLowerCase()} помогает коже и ${benefit.ru}.`,
    en: `${shortText.en} A formula with ${ingredientLead.en.toLowerCase()} helps skin and ${benefit.en}.`
  };
}

function makeIngredients(ingredientLead: LocaleText): LocaleText {
  return {
    uz: ingredientLead.uz,
    ru: ingredientLead.ru,
    en: ingredientLead.en
  };
}

addMeta("dewComfort", { uz: "Dew Comfort Serum", ru: "Dew Comfort Serum", en: "Dew Comfort Serum" }, { uz: "Quruq teri uchun namlovchi kundalik sivorotka.", ru: "Ежедневная увлажняющая сыворотка для сухой кожи.", en: "A daily hydrating serum for dry skin." });
addMeta("ceramideSilk", { uz: "Ceramide Silk Serum", ru: "Ceramide Silk Serum", en: "Ceramide Silk Serum" }, { uz: "Barrierani qo'llab-quvvatlovchi ipakdek sivorotka.", ru: "Шелковистая сыворотка для поддержки кожного барьера.", en: "A silky barrier-support serum." });
addMeta("cloudBarrier", { uz: "Cloud Barrier Cream", ru: "Cloud Barrier Cream", en: "Cloud Barrier Cream" }, { uz: "Quruq teri uchun qulay teksturali krem.", ru: "Комфортный крем для сухой кожи.", en: "A comfort cream for dry skin." });
addMeta("velvetRecovery", { uz: "Velvet Recovery Cream", ru: "Velvet Recovery Cream", en: "Velvet Recovery Cream" }, { uz: "Tungi tiklanish uchun boy krem.", ru: "Питательный крем для ночного восстановления.", en: "A rich cream for overnight recovery." });
addMeta("roseMilk", { uz: "Rose Milk Toner", ru: "Rose Milk Toner", en: "Rose Milk Toner" }, { uz: "Quruq teri uchun nam beruvchi toner.", ru: "Увлажняющий тонер для сухой кожи.", en: "A hydrating toner for dry skin." });
addMeta("betaComfort", { uz: "Beta Comfort Toner", ru: "Beta Comfort Toner", en: "Beta Comfort Toner" }, { uz: "Tinchlantiruvchi va namlovchi toner.", ru: "Успокаивающий и увлажняющий тонер.", en: "A soothing hydrating toner." });
addMeta("oatCloud", { uz: "Oat Cloud Foam", ru: "Oat Cloud Foam", en: "Oat Cloud Foam" }, { uz: "Quruq teri uchun yumshoq penka.", ru: "Мягкая пенка для сухой кожи.", en: "A gentle foam for dry skin." });
addMeta("creamyBarrier", { uz: "Creamy Barrier Foam", ru: "Creamy Barrier Foam", en: "Creamy Barrier Foam" }, { uz: "Barrierani asrovchi kremsimon penka.", ru: "Кремовая пенка для поддержки барьера.", en: "A creamy barrier-support foam." });
addMeta("squalaneDew", { uz: "Squalane Dew Serum", ru: "Squalane Dew Serum", en: "Squalane Dew Serum" }, { uz: "Skvalanli glow beruvchi serum.", ru: "Сыворотка со скваланом для мягкого сияния.", en: "A squalane serum for soft glow." });
addMeta("balanceDrop", { uz: "Balance Drop Serum", ru: "Balance Drop Serum", en: "Balance Drop Serum" }, { uz: "Kombi teri uchun balanslovchi sivorotka.", ru: "Балансирующая сыворотка для комбинированной кожи.", en: "A balancing serum for combination skin." });
addMeta("matchaReset", { uz: "Matcha Reset Serum", ru: "Matcha Reset Serum", en: "Matcha Reset Serum" }, { uz: "Kombi teri uchun fresh effektli serum.", ru: "Освежающая сыворотка для комбинированной кожи.", en: "A refreshing serum for combination skin." });
addMeta("dailyBalance", { uz: "Daily Balance Cream", ru: "Daily Balance Cream", en: "Daily Balance Cream" }, { uz: "Kombi teri uchun yengil kundalik krem.", ru: "Лёгкий крем для комбинированной кожи.", en: "A lightweight daily cream for combination skin." });
addMeta("freshControl", { uz: "Fresh Control Cream", ru: "Fresh Control Cream", en: "Fresh Control Cream" }, { uz: "Yengil va tez singuvchi krem.", ru: "Быстро впитывающийся крем для баланса кожи.", en: "A fast-absorbing balancing cream." });
addMeta("poreBalance", { uz: "Pore Balance Toner", ru: "Pore Balance Toner", en: "Pore Balance Toner" }, { uz: "Kombi teri uchun pora-balancing toner.", ru: "Балансирующий тонер для пор и комбинированной кожи.", en: "A pore-balancing toner for combination skin." });
addMeta("teaClear", { uz: "Tea Clear Toner", ru: "Tea Clear Toner", en: "Tea Clear Toner" }, { uz: "Yengil fresh toner.", ru: "Свежий лёгкий тонер.", en: "A fresh lightweight toner." });
addMeta("freshFoam", { uz: "Fresh Foam Wash", ru: "Fresh Foam Wash", en: "Fresh Foam Wash" }, { uz: "Kombi teri uchun kundalik penka.", ru: "Ежедневная пенка для комбинированной кожи.", en: "An everyday foam for combination skin." });
addMeta("dailyReset", { uz: "Daily Reset Foam", ru: "Daily Reset Foam", en: "Daily Reset Foam" }, { uz: "Balanslovchi kundalik penka.", ru: "Балансирующая пенка на каждый день.", en: "A daily balancing foam." });
addMeta("zincClarity", { uz: "Zinc Clarity Serum", ru: "Zinc Clarity Serum", en: "Zinc Clarity Serum" }, { uz: "Yog'li teri uchun aniqlik beruvchi sivorotka.", ru: "Сыворотка для более чистого вида жирной кожи.", en: "A clarifying serum for oily skin." });
addMeta("ahaBlemish", { uz: "AHA Blemish Serum", ru: "AHA Blemish Serum", en: "AHA Blemish Serum" }, { uz: "Notekis tekstura uchun aktiv serum.", ru: "Активная сыворотка для неровной текстуры.", en: "An active serum for uneven texture." });
addMeta("oilCut", { uz: "Oil Cut Cream-Gel", ru: "Oil Cut Cream-Gel", en: "Oil Cut Cream-Gel" }, { uz: "Yog'li teri uchun gel-krem.", ru: "Гель-крем для жирной кожи.", en: "A gel-cream for oily skin." });
addMeta("matteRelief", { uz: "Matte Relief Cream", ru: "Matte Relief Cream", en: "Matte Relief Cream" }, { uz: "Yog'li teri uchun matlashtiruvchi krem.", ru: "Матирующий крем для жирной кожи.", en: "A mattifying cream for oily skin." });
addMeta("sebumZero", { uz: "Sebum Zero Toner", ru: "Sebum Zero Toner", en: "Sebum Zero Toner" }, { uz: "Yog'li teri uchun fresh toner.", ru: "Освежающий тонер для жирной кожи.", en: "A fresh toner for oily skin." });
addMeta("poreSweep", { uz: "Pore Sweep Toner", ru: "Pore Sweep Toner", en: "Pore Sweep Toner" }, { uz: "Pora ko'rinishi uchun toner.", ru: "Тонер для более гладкого вида пор.", en: "A toner for smoother-looking pores." });
addMeta("acneClear", { uz: "Acne Clear Foam", ru: "Acne Clear Foam", en: "Acne Clear Foam" }, { uz: "Yog'li teri uchun toza finishli penka.", ru: "Пенка с чистым финишем для жирной кожи.", en: "A clean-finish foam for oily skin." });
addMeta("deepWash", { uz: "Deep Wash Foam", ru: "Deep Wash Foam", en: "Deep Wash Foam" }, { uz: "Chuqurroq tozalash uchun penka.", ru: "Пенка для более глубокого очищения.", en: "A foam for deeper cleansing." });
addMeta("cicaCalm", { uz: "Cica Calm Serum", ru: "Cica Calm Serum", en: "Cica Calm Serum" }, { uz: "Sezuvchan teri uchun tinchlantiruvchi serum.", ru: "Успокаивающая сыворотка для чувствительной кожи.", en: "A calming serum for sensitive skin." });
addMeta("panthenolMist", { uz: "Panthenol Mist Serum", ru: "Panthenol Mist Serum", en: "Panthenol Mist Serum" }, { uz: "Sezuvchan teriga yengil qulaylik beruvchi serum.", ru: "Лёгкая сыворотка-комфорт для чувствительной кожи.", en: "A lightweight comfort serum for sensitive skin." });
addMeta("rednessRelief", { uz: "Redness Relief Cream", ru: "Redness Relief Cream", en: "Redness Relief Cream" }, { uz: "Sezuvchan teri uchun sokinlashtiruvchi krem.", ru: "Успокаивающий крем для чувствительной кожи.", en: "A soothing cream for sensitive skin." });
addMeta("barrierRescue", { uz: "Barrier Rescue Cream", ru: "Barrier Rescue Cream", en: "Barrier Rescue Cream" }, { uz: "Barrierani qulaylashtiruvchi krem.", ru: "Крем для комфорта и поддержки барьера.", en: "A comfort cream for barrier support." });
addMeta("calmWater", { uz: "Calm Water Toner", ru: "Calm Water Toner", en: "Calm Water Toner" }, { uz: "Sezuvchan teri uchun yengil toner.", ru: "Лёгкий тонер для чувствительной кожи.", en: "A lightweight toner for sensitive skin." });
addMeta("blueTansy", { uz: "Blue Tansy Toner", ru: "Blue Tansy Toner", en: "Blue Tansy Toner" }, { uz: "Sezuvchan teri uchun floral toner.", ru: "Флоральный тонер для чувствительной кожи.", en: "A floral toner for sensitive skin." });
addMeta("softSkin", { uz: "Soft Skin Foam", ru: "Soft Skin Foam", en: "Soft Skin Foam" }, { uz: "Sezuvchan teri uchun yumshoq penka.", ru: "Мягкая пенка для чувствительной кожи.", en: "A soft foam for sensitive skin." });
addMeta("gentleCica", { uz: "Gentle Cica Foam", ru: "Gentle Cica Foam", en: "Gentle Cica Foam" }, { uz: "Cica bilan tinchlantiruvchi penka.", ru: "Успокаивающая пенка с центеллой.", en: "A soothing cica foam." });

addBlueprint({ key: "dewComfort", categorySlug: "serum", skinType: "dry", size: "30 ml", price: 129000, stock: 36, colors: ["#f5e1dc", "#fff8f5"], ingredientLead: { uz: "Gialuron kislotasi va panthenol", ru: "Гиалуроновая кислота и пантенол", en: "Hyaluronic acid and panthenol" }, benefit: { uz: "namlikni qatlamlaydi va tortishishni kamaytiradi", ru: "наслаивает влагу и уменьшает стянутость", en: "layers hydration and reduces tightness" }, use: { uz: "Tonerdan keyin 2-3 tomchi surting.", ru: "Нанесите 2–3 капли после тонера.", en: "Apply 2-3 drops after toner." } });
addBlueprint({ key: "ceramideSilk", categorySlug: "serum", skinType: "dry", size: "30 ml", price: 149000, stock: 34, colors: ["#f2d6d0", "#fff5f3"], ingredientLead: { uz: "Keramid kompleksi va skvalan", ru: "Комплекс керамидов и сквалан", en: "Ceramide complex and squalane" }, benefit: { uz: "barrierani qo'llab-quvvatlaydi va yumshoqlik beradi", ru: "поддерживает барьер и смягчает кожу", en: "supports the barrier and improves softness" }, use: { uz: "Ertalab va kechqurun ishlating.", ru: "Используйте утром и вечером.", en: "Use morning and evening." } });
addBlueprint({ key: "cloudBarrier", categorySlug: "moisturizer", skinType: "dry", size: "50 ml", price: 165000, stock: 28, colors: ["#efe1d6", "#fff8f2"], ingredientLead: { uz: "Shea yog'i va keramidlar", ru: "Масло ши и керамиды", en: "Shea butter and ceramides" }, benefit: { uz: "qobiqchani kamaytiradi va terini silliqlaydi", ru: "уменьшает шелушение и разглаживает кожу", en: "reduces flaking and smooths the skin" }, use: { uz: "Sivorotkadan keyin surting.", ru: "Наносите после сыворотки.", en: "Apply after serum." } });
addBlueprint({ key: "velvetRecovery", categorySlug: "moisturizer", skinType: "dry", size: "50 ml", price: 179000, stock: 27, colors: ["#ecd4cc", "#fff6f4"], ingredientLead: { uz: "Skvalan va vitamin E", ru: "Сквалан и витамин E", en: "Squalane and vitamin E" }, benefit: { uz: "tungi tiklanishga yordam beradi", ru: "поддерживает ночное восстановление", en: "supports overnight recovery" }, use: { uz: "Kechqurun oxirgi bosqichda surting.", ru: "Наносите вечером как финальный этап.", en: "Use as the final evening step." } });
addBlueprint({ key: "roseMilk", categorySlug: "toner", skinType: "dry", size: "150 ml", price: 69000, stock: 42, colors: ["#f4ddd8", "#fff9f7"], ingredientLead: { uz: "Atirgul suvi va betaine", ru: "Розовая вода и бетаин", en: "Rose water and betaine" }, benefit: { uz: "tortishishni kamaytiradi va glow beradi", ru: "уменьшает стянутость и добавляет сияние", en: "relieves tightness and adds glow" }, use: { uz: "Tozalashdan keyin kaft bilan surting.", ru: "Наносите ладонями после очищения.", en: "Press in with your hands after cleansing." } });
addBlueprint({ key: "betaComfort", categorySlug: "toner", skinType: "dry", size: "150 ml", price: 79000, stock: 39, colors: ["#ede0d5", "#fffaf6"], ingredientLead: { uz: "Beta-glukan va panthenol", ru: "Бета-глюкан и пантенол", en: "Beta-glucan and panthenol" }, benefit: { uz: "qizarishni yumshatadi va qulaylik beradi", ru: "смягчает покраснение и повышает комфорт", en: "softens redness and improves comfort" }, use: { uz: "Paxtasiz ishlating.", ru: "Используйте без ватного диска.", en: "Use without a cotton pad." } });
addBlueprint({ key: "oatCloud", categorySlug: "penka", skinType: "dry", size: "150 ml", price: 49000, stock: 51, colors: ["#f2e2d7", "#fff9f3"], ingredientLead: { uz: "Oat ekstrakti va allantoin", ru: "Экстракт овса и аллантоин", en: "Oat extract and allantoin" }, benefit: { uz: "muloyim tozalaydi va yumshoqlikni saqlaydi", ru: "деликатно очищает и сохраняет мягкость кожи", en: "cleanses gently and preserves softness" }, use: { uz: "Nam yuzga 1-2 pomp ishlating.", ru: "Используйте 1–2 нажатия на влажной коже.", en: "Use 1-2 pumps on damp skin." } });
addBlueprint({ key: "creamyBarrier", categorySlug: "penka", skinType: "dry", size: "150 ml", price: 59000, stock: 46, colors: ["#efe1d8", "#fff7f2"], ingredientLead: { uz: "Panthenol va keramidlar", ru: "Пантенол и керамиды", en: "Panthenol and ceramides" }, benefit: { uz: "tozalaydi va qattiq tortishmaydi", ru: "очищает и не даёт сильной стянутости", en: "cleanses without leaving skin tight" }, use: { uz: "Ertalab va kechqurun ishlatish mumkin.", ru: "Подходит для утреннего и вечернего использования.", en: "Suitable for morning and evening use." } });
addBlueprint({ key: "squalaneDew", categorySlug: "serum", skinType: "dry", size: "30 ml", price: 159000, stock: 31, colors: ["#efd9d1", "#fff6f4"], ingredientLead: { uz: "Skvalan va niatsinamid", ru: "Сквалан и ниацинамид", en: "Squalane and niacinamide" }, benefit: { uz: "teriga nozik glow beradi", ru: "добавляет коже деликатное сияние", en: "adds a subtle glow to the skin" }, use: { uz: "Kremdan oldin 2 tomchi surting.", ru: "Нанесите 2 капли перед кремом.", en: "Apply 2 drops before cream." } });
addBlueprint({ key: "balanceDrop", categorySlug: "serum", skinType: "combination", size: "30 ml", price: 119000, stock: 35, colors: ["#d7e8e4", "#f6fffc"], ingredientLead: { uz: "Niatsinamid va green tea", ru: "Ниацинамид и зелёный чай", en: "Niacinamide and green tea" }, benefit: { uz: "balans va namlikni birga ushlab turadi", ru: "одновременно поддерживает баланс и увлажнение", en: "supports balance and hydration together" }, use: { uz: "Tonerdan keyin 2 tomchi ishlating.", ru: "Используйте 2 капли после тонера.", en: "Use 2 drops after toner." } });
addBlueprint({ key: "matchaReset", categorySlug: "serum", skinType: "combination", size: "30 ml", price: 139000, stock: 29, colors: ["#d9e7da", "#f8fff9"], ingredientLead: { uz: "Matcha va zinc PCA", ru: "Матча и zinc PCA", en: "Matcha and zinc PCA" }, benefit: { uz: "T-zonani balanslab, yonoqlarni qulay qoldiradi", ru: "балансирует Т-зону и сохраняет комфорт щёк", en: "balances the T-zone while keeping cheeks comfortable" }, use: { uz: "Kuniga 1-2 marta surting.", ru: "Наносите 1–2 раза в день.", en: "Apply once or twice a day." } });
addBlueprint({ key: "dailyBalance", categorySlug: "moisturizer", skinType: "combination", size: "50 ml", price: 149000, stock: 30, colors: ["#edf1ea", "#ffffff"], ingredientLead: { uz: "Aloe va niatsinamid", ru: "Алоэ и ниацинамид", en: "Aloe and niacinamide" }, benefit: { uz: "yog'li zonalarni og'irlashtirmaydi", ru: "не перегружает жирные зоны", en: "does not overload oily zones" }, use: { uz: "Yupqa qatlam bilan surting.", ru: "Наносите тонким слоем.", en: "Apply in a thin layer." } });
addBlueprint({ key: "freshControl", categorySlug: "moisturizer", skinType: "combination", size: "50 ml", price: 159000, stock: 26, colors: ["#e4efe8", "#fbfffc"], ingredientLead: { uz: "Green tea va panthenol", ru: "Зелёный чай и пантенол", en: "Green tea and panthenol" }, benefit: { uz: "ortiqcha yaltirashni kamaytiradi", ru: "уменьшает лишний блеск", en: "reduces excess shine" }, use: { uz: "Makiyajdan oldin ham ishlatsa bo'ladi.", ru: "Можно использовать перед макияжем.", en: "Can be used before makeup." } });
addBlueprint({ key: "poreBalance", categorySlug: "toner", skinType: "combination", size: "150 ml", price: 65000, stock: 37, colors: ["#ebf4ef", "#ffffff"], ingredientLead: { uz: "Willow bark va niatsinamid", ru: "Willow bark и ниацинамид", en: "Willow bark and niacinamide" }, benefit: { uz: "T-zonani yangilab, yuzani silliq qoldiradi", ru: "освежает Т-зону и делает поверхность более гладкой", en: "refreshes the T-zone and smooths the surface" }, use: { uz: "Tozalashdan keyin ishlating.", ru: "Используйте после очищения.", en: "Use after cleansing." } });
addBlueprint({ key: "teaClear", categorySlug: "toner", skinType: "combination", size: "150 ml", price: 72000, stock: 35, colors: ["#dfece0", "#fbfffb"], ingredientLead: { uz: "Green tea va aloe", ru: "Зелёный чай и алоэ", en: "Green tea and aloe" }, benefit: { uz: "teri ko'rinishini fresh va balansli qiladi", ru: "делает кожу более свежей и сбалансированной", en: "helps skin look fresh and balanced" }, use: { uz: "Bir necha tomchini yuzga bosib singdiring.", ru: "Вбейте несколько капель в кожу.", en: "Pat a few drops into the skin." } });
addBlueprint({ key: "freshFoam", categorySlug: "penka", skinType: "combination", size: "150 ml", price: 45000, stock: 53, colors: ["#edf4ef", "#ffffff"], ingredientLead: { uz: "Aloe va glycerin", ru: "Алоэ и глицерин", en: "Aloe and glycerin" }, benefit: { uz: "T-zona uchun fresh, yonoqlar uchun qulay", ru: "свежесть для Т-зоны и комфорт для щёк", en: "fresh for the T-zone and comfortable for the cheeks" }, use: { uz: "20 soniya massaj qiling.", ru: "Массируйте 20 секунд.", en: "Massage for 20 seconds." } });
addBlueprint({ key: "dailyReset", categorySlug: "penka", skinType: "combination", size: "150 ml", price: 52000, stock: 44, colors: ["#e9f1ea", "#fcfffd"], ingredientLead: { uz: "Green tea va allantoin", ru: "Зелёный чай и аллантоин", en: "Green tea and allantoin" }, benefit: { uz: "toza finish va qulay ko'pik beradi", ru: "даёт чистый финиш и комфортную пену", en: "delivers a clean finish with comfortable foam" }, use: { uz: "Kuniga 2 marta ishlatish mumkin.", ru: "Можно использовать 2 раза в день.", en: "Can be used twice a day." } });
addBlueprint({ key: "zincClarity", categorySlug: "serum", skinType: "oily", size: "30 ml", price: 99000, stock: 40, colors: ["#d9ecf2", "#f8fdff"], ingredientLead: { uz: "Zinc PCA va niatsinamid", ru: "Zinc PCA и ниацинамид", en: "Zinc PCA and niacinamide" }, benefit: { uz: "yaltirashni kamaytirib, poralarni silliq ko'rsatadi", ru: "уменьшает блеск и делает поры более гладкими", en: "reduces shine and refines pore appearance" }, use: { uz: "2 tomchi yuzga surting.", ru: "Нанесите 2 капли на лицо.", en: "Apply 2 drops to the face." } });
addBlueprint({ key: "ahaBlemish", categorySlug: "serum", skinType: "oily", size: "30 ml", price: 145000, stock: 24, colors: ["#d6e6ef", "#f7fbff"], ingredientLead: { uz: "Lactic acid va panthenol", ru: "Молочная кислота и пантенол", en: "Lactic acid and panthenol" }, benefit: { uz: "teksturani yangilaydi va tiniq ko'rinishni qo'llab-quvvatlaydi", ru: "обновляет текстуру и поддерживает более чистый вид", en: "refreshes texture and supports a clearer look" }, use: { uz: "Haftada 3-4 marta kechqurun ishlating.", ru: "Используйте вечером 3–4 раза в неделю.", en: "Use in the evening 3-4 times a week." } });
addBlueprint({ key: "oilCut", categorySlug: "moisturizer", skinType: "oily", size: "50 ml", price: 135000, stock: 32, colors: ["#e1eff4", "#fbfeff"], ingredientLead: { uz: "Niatsinamid va aloe", ru: "Ниацинамид и алоэ", en: "Niacinamide and aloe" }, benefit: { uz: "mat finish bilan yengil namlik beradi", ru: "даёт матовый финиш и лёгкое увлажнение", en: "delivers light hydration with a matte finish" }, use: { uz: "SPF oldidan surting.", ru: "Наносите перед SPF.", en: "Apply before SPF." } });
addBlueprint({ key: "matteRelief", categorySlug: "moisturizer", skinType: "oily", size: "50 ml", price: 149000, stock: 27, colors: ["#dce9f0", "#f8fdff"], ingredientLead: { uz: "Silica va panthenol", ru: "Silica и пантенол", en: "Silica and panthenol" }, benefit: { uz: "makiyaj ostida ham yengil turadi", ru: "остаётся лёгким даже под макияжем", en: "stays lightweight even under makeup" }, use: { uz: "Kunduzgi parvarishda ishlating.", ru: "Используйте в дневном уходе.", en: "Use in the daytime routine." } });
addBlueprint({ key: "sebumZero", categorySlug: "toner", skinType: "oily", size: "150 ml", price: 59000, stock: 47, colors: ["#dceaf3", "#f9feff"], ingredientLead: { uz: "Willow bark va zinc PCA", ru: "Willow bark и zinc PCA", en: "Willow bark and zinc PCA" }, benefit: { uz: "yog'li hududlarni fresh qiladi", ru: "освежает жирные участки кожи", en: "refreshes oilier areas of the skin" }, use: { uz: "Paxtasiz ishlating.", ru: "Используйте без ватного диска.", en: "Use without a cotton pad." } });
addBlueprint({ key: "poreSweep", categorySlug: "toner", skinType: "oily", size: "150 ml", price: 69000, stock: 41, colors: ["#d8e7f2", "#f6fbff"], ingredientLead: { uz: "Salicylic derivative va aloe", ru: "Производное салициловой кислоты и алоэ", en: "Salicylic derivative and aloe" }, benefit: { uz: "yuzani toza va serumga tayyor qiladi", ru: "делает поверхность чище и готовит к сыворотке", en: "leaves the surface cleaner and ready for serum" }, use: { uz: "Faqat tozalagandan keyin ishlating.", ru: "Используйте только после очищения.", en: "Use only after cleansing." } });
addBlueprint({ key: "acneClear", categorySlug: "penka", skinType: "oily", size: "150 ml", price: 39000, stock: 60, colors: ["#deecf4", "#fbfdff"], ingredientLead: { uz: "Tea tree va zinc PCA", ru: "Tea tree и zinc PCA", en: "Tea tree and zinc PCA" }, benefit: { uz: "yuzni toza va yengil his qildiradi", ru: "оставляет лицо свежим и лёгким", en: "leaves the face fresh and light" }, use: { uz: "Yog'li T-zonaga alohida e'tibor bering.", ru: "Уделите внимание жирной Т-зоне.", en: "Pay extra attention to the oily T-zone." } });
addBlueprint({ key: "deepWash", categorySlug: "penka", skinType: "oily", size: "150 ml", price: 55000, stock: 49, colors: ["#d9e8f1", "#f7fcff"], ingredientLead: { uz: "Niatsinamid va willow bark", ru: "Ниацинамид и willow bark", en: "Niacinamide and willow bark" }, benefit: { uz: "ortiqcha yaltirashni kamaytirishga yordam beradi", ru: "помогает уменьшить лишний блеск", en: "helps reduce excess shine" }, use: { uz: "Kuniga 1-2 marta ishlating.", ru: "Используйте 1–2 раза в день.", en: "Use 1-2 times a day." } });
addBlueprint({ key: "cicaCalm", categorySlug: "serum", skinType: "sensitive", size: "30 ml", price: 119000, stock: 33, colors: ["#e6efe9", "#fcfffd"], ingredientLead: { uz: "Cica va panthenol", ru: "Центелла и пантенол", en: "Cica and panthenol" }, benefit: { uz: "qizarishni kamaytirib, qulaylik beradi", ru: "уменьшает покраснение и повышает комфорт", en: "reduces redness and improves comfort" }, use: { uz: "Tozalashdan keyin 2-3 tomchi ishlating.", ru: "Используйте 2–3 капли после очищения.", en: "Use 2-3 drops after cleansing." } });
addBlueprint({ key: "panthenolMist", categorySlug: "serum", skinType: "sensitive", size: "30 ml", price: 135000, stock: 30, colors: ["#e9f0ee", "#ffffff"], ingredientLead: { uz: "Panthenol va allantoin", ru: "Пантенол и аллантоин", en: "Panthenol and allantoin" }, benefit: { uz: "noqulaylikni kamaytirishga yordam beradi", ru: "помогает уменьшить дискомфорт кожи", en: "helps reduce skin discomfort" }, use: { uz: "Yuz va bo'yinga teng surting.", ru: "Равномерно распределите по лицу и шее.", en: "Spread evenly across face and neck." } });
addBlueprint({ key: "rednessRelief", categorySlug: "moisturizer", skinType: "sensitive", size: "50 ml", price: 155000, stock: 28, colors: ["#eef2ef", "#ffffff"], ingredientLead: { uz: "Bisabolol va cica", ru: "Бисаболол и центелла", en: "Bisabolol and cica" }, benefit: { uz: "qizarishga moyil hududlarni qulaylashtiradi", ru: "успокаивает зоны, склонные к покраснению", en: "comforts redness-prone areas" }, use: { uz: "Ertalab va kechqurun surting.", ru: "Наносите утром и вечером.", en: "Apply morning and evening." } });
addBlueprint({ key: "barrierRescue", categorySlug: "moisturizer", skinType: "sensitive", size: "50 ml", price: 175000, stock: 25, colors: ["#eff4f1", "#ffffff"], ingredientLead: { uz: "Keramidlar va colloidal oat", ru: "Керамиды и коллоидный овёс", en: "Ceramides and colloidal oat" }, benefit: { uz: "himoya hissi berib, yumshoq finish qoldiradi", ru: "даёт чувство защиты и мягкий финиш", en: "gives a protected feel with a soft finish" }, use: { uz: "Parvarishning oxirgi bosqichi sifatida surting.", ru: "Используйте как завершающий этап ухода.", en: "Use as the final skincare step." } });
addBlueprint({ key: "calmWater", categorySlug: "toner", skinType: "sensitive", size: "150 ml", price: 59000, stock: 43, colors: ["#eef5f0", "#ffffff"], ingredientLead: { uz: "Cica va betaine", ru: "Центелла и бетаин", en: "Cica and betaine" }, benefit: { uz: "terini nam va qulay his qildiradi", ru: "делает кожу увлажнённой и комфортной", en: "leaves skin hydrated and comfortable" }, use: { uz: "Tozalangan teriga kaft bilan surting.", ru: "Нанесите на очищенную кожу ладонями.", en: "Apply to clean skin with your hands." } });
addBlueprint({ key: "blueTansy", categorySlug: "toner", skinType: "sensitive", size: "150 ml", price: 79000, stock: 36, colors: ["#e8f1ef", "#fdfefe"], ingredientLead: { uz: "Blue tansy va aloe", ru: "Blue tansy и алоэ", en: "Blue tansy and aloe" }, benefit: { uz: "kundalik qulaylik va yumshoq finish beradi", ru: "даёт ежедневный комфорт и мягкий финиш", en: "delivers daily comfort and a soft finish" }, use: { uz: "Yuzga bosib singdiring.", ru: "Вбейте тонер в кожу.", en: "Press the toner into the skin." } });
addBlueprint({ key: "softSkin", categorySlug: "penka", skinType: "sensitive", size: "150 ml", price: 42000, stock: 52, colors: ["#eef4f0", "#ffffff"], ingredientLead: { uz: "Allantoin va glycerin", ru: "Аллантоин и глицерин", en: "Allantoin and glycerin" }, benefit: { uz: "yengil ko'pik va qulay tozalash beradi", ru: "даёт лёгкую пену и комфортное очищение", en: "provides light foam and comfortable cleansing" }, use: { uz: "Nam teriga 1 pomp ishlating.", ru: "Используйте 1 нажатие на влажной коже.", en: "Use 1 pump on damp skin." } });
addBlueprint({ key: "gentleCica", categorySlug: "penka", skinType: "sensitive", size: "150 ml", price: 57000, stock: 45, colors: ["#edf4ef", "#ffffff"], ingredientLead: { uz: "Cica va beta-glukan", ru: "Центелла и бета-глюкан", en: "Cica and beta-glucan" }, benefit: { uz: "tozalaydi, tinchlantiradi va tortishishni kamaytiradi", ru: "очищает, успокаивает и уменьшает стянутость", en: "cleanses, calms and reduces tightness" }, use: { uz: "Ertalab va kechqurun ishlating.", ru: "Используйте утром и вечером.", en: "Use morning and evening." } });

async function ensureCategory(slug: CategorySlug) {
  const meta = categoryMeta[slug];
  return prisma.category.upsert({
    where: { slug },
    update: { nameUz: meta.nameUz, nameRu: meta.nameRu, nameEn: meta.nameEn },
    create: {
      slug,
      nameUz: meta.nameUz,
      nameRu: meta.nameRu,
      nameEn: meta.nameEn,
      descriptionUz: `${meta.nameUz} uchun Modaily assortimenti`,
      descriptionRu: `Ассортимент Modaily для категории ${meta.nameRu}`,
      descriptionEn: `Modaily assortment for ${meta.nameEn}`
    }
  });
}

async function syncBaseCatalog() {
  const categoryMap = new Map<string, string>();

  for (const product of baseProducts) {
    const categorySlug = slugify(product.category.en);

    if (!categoryMap.has(categorySlug)) {
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: { nameUz: product.category.uz, nameRu: product.category.ru, nameEn: product.category.en },
        create: {
          slug: categorySlug,
          nameUz: product.category.uz,
          nameRu: product.category.ru,
          nameEn: product.category.en,
          descriptionUz: `${product.category.uz} uchun Modaily assortimenti`,
          descriptionRu: `Ассортимент Modaily для категории ${product.category.ru}`,
          descriptionEn: `Modaily assortment for ${product.category.en}`
        }
      });

      categoryMap.set(categorySlug, category.id);
    }

    const numericId = Number(product.id.replace("mdl-", ""));
    const categoryId = categoryMap.get(categorySlug)!;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        nameUz: product.translations.uz.name,
        nameRu: product.translations.ru.name,
        nameEn: product.translations.en.name,
        shortDescriptionUz: product.translations.uz.shortDescription,
        shortDescriptionRu: product.translations.ru.shortDescription,
        shortDescriptionEn: product.translations.en.shortDescription,
        descriptionUz: product.translations.uz.description,
        descriptionRu: product.translations.ru.description,
        descriptionEn: product.translations.en.description,
        featureUz: product.translations.uz.benefits.join(", "),
        featureRu: product.translations.ru.benefits.join(", "),
        featureEn: product.translations.en.benefits.join(", "),
        ingredientsUz: product.translations.uz.textureNote,
        ingredientsRu: product.translations.ru.textureNote,
        ingredientsEn: product.translations.en.textureNote,
        usageUz: product.translations.uz.howToUse,
        usageRu: product.translations.ru.howToUse,
        usageEn: product.translations.en.howToUse,
        size: product.size,
        price: product.price * 1000,
        stock: 25,
        active: true,
        isBestseller: numericId <= 4,
        homeSortOrder: numericId <= 4 ? numericId : 0,
        colorFrom: product.colors[0],
        colorTo: product.colors[1],
        categoryId,
        categoryLinks: {
          deleteMany: {},
          create: {
            categoryId,
            sortOrder: 0
          }
        }
      },
      create: {
        sku: `MDL-${String(numericId).padStart(3, "0")}`,
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
        featureUz: product.translations.uz.benefits.join(", "),
        featureRu: product.translations.ru.benefits.join(", "),
        featureEn: product.translations.en.benefits.join(", "),
        ingredientsUz: product.translations.uz.textureNote,
        ingredientsRu: product.translations.ru.textureNote,
        ingredientsEn: product.translations.en.textureNote,
        usageUz: product.translations.uz.howToUse,
        usageRu: product.translations.ru.howToUse,
        usageEn: product.translations.en.howToUse,
        size: product.size,
        price: product.price * 1000,
        stock: 25,
        active: true,
        isBestseller: numericId <= 4,
        homeSortOrder: numericId <= 4 ? numericId : 0,
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

async function syncNewProducts() {
  const categoryIdBySlug = new Map<CategorySlug, string>();

  for (const slug of Object.keys(categoryMeta) as CategorySlug[]) {
    const category = await ensureCategory(slug);
    categoryIdBySlug.set(slug, category.id);
  }

  for (const [index, blueprint] of blueprints.entries()) {
    const title = titleMeta[blueprint.key];
    const shortText = { uz: title.shortUz, ru: title.shortRu, en: title.shortEn };
    const description = makeDescription(shortText, blueprint.ingredientLead, blueprint.benefit);
    const ingredients = makeIngredients(blueprint.ingredientLead);
    const slug = slugify(title.en);
    const categoryId = categoryIdBySlug.get(blueprint.categorySlug)!;

    await prisma.product.upsert({
      where: { slug },
      update: {
        sku: `MDL-${String(index + 201).padStart(3, "0")}`,
        nameUz: title.uz,
        nameRu: title.ru,
        nameEn: title.en,
        shortDescriptionUz: shortText.uz,
        shortDescriptionRu: shortText.ru,
        shortDescriptionEn: shortText.en,
        descriptionUz: description.uz,
        descriptionRu: description.ru,
        descriptionEn: description.en,
        featureUz: blueprint.benefit.uz,
        featureRu: blueprint.benefit.ru,
        featureEn: blueprint.benefit.en,
        ingredientsUz: ingredients.uz,
        ingredientsRu: ingredients.ru,
        ingredientsEn: ingredients.en,
        usageUz: blueprint.use.uz,
        usageRu: blueprint.use.ru,
        usageEn: blueprint.use.en,
        skinTypes: blueprint.skinType,
        size: blueprint.size,
        price: blueprint.price,
        stock: blueprint.stock,
        active: true,
        isBestseller: false,
        homeSortOrder: 0,
        colorFrom: blueprint.colors[0],
        colorTo: blueprint.colors[1],
        categoryId,
        categoryLinks: {
          deleteMany: {},
          create: {
            categoryId,
            sortOrder: 0
          }
        }
      },
      create: {
        sku: `MDL-${String(index + 201).padStart(3, "0")}`,
        slug,
        nameUz: title.uz,
        nameRu: title.ru,
        nameEn: title.en,
        shortDescriptionUz: shortText.uz,
        shortDescriptionRu: shortText.ru,
        shortDescriptionEn: shortText.en,
        descriptionUz: description.uz,
        descriptionRu: description.ru,
        descriptionEn: description.en,
        featureUz: blueprint.benefit.uz,
        featureRu: blueprint.benefit.ru,
        featureEn: blueprint.benefit.en,
        ingredientsUz: ingredients.uz,
        ingredientsRu: ingredients.ru,
        ingredientsEn: ingredients.en,
        usageUz: blueprint.use.uz,
        usageRu: blueprint.use.ru,
        usageEn: blueprint.use.en,
        skinTypes: blueprint.skinType,
        size: blueprint.size,
        price: blueprint.price,
        stock: blueprint.stock,
        active: true,
        isBestseller: false,
        homeSortOrder: 0,
        imageUrl: null,
        colorFrom: blueprint.colors[0],
        colorTo: blueprint.colors[1],
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

async function main() {
  await syncBaseCatalog();
  await syncNewProducts();

  const totalProducts = await prisma.product.count();
  const skinTypeCounts = await prisma.product.groupBy({
    by: ["skinTypes"],
    where: { skinTypes: { not: null } },
    _count: { _all: true }
  });

  console.log(JSON.stringify({ totalProducts, addedProducts: blueprints.length, skinTypeCounts }, null, 2));
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
