import { type Locale } from "@/lib/i18n";

type ProductTranslation = {
  name: string;
  shortName: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  howToUse: string;
  textureNote: string;
};

type Product = {
  id: string;
  slug: string;
  category: Record<Locale, string>;
  size: string;
  price: number;
  colors: [string, string];
  translations: Record<Locale, ProductTranslation>;
};

export type LocalizedProduct = {
  id: string;
  slug: string;
  category: string;
  size: string;
  price: number;
  colors: [string, string];
  name: string;
  shortName: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  howToUse: string;
  textureNote: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
};

export const products: Product[] = [
  {
    id: "mdl-001",
    slug: "velvet-cleansing-balm",
    category: { uz: "Tozalash", ru: "Очищение", en: "Cleanser" },
    size: "100 ml",
    price: 28,
    colors: ["#d6a187", "#f7ebdf"],
    translations: {
      uz: {
        name: "Velvet Cleansing Balm",
        shortName: "Velvet Balm",
        shortDescription: "Makiyaj va SPF ni yumshoq eritadigan oziqlantiruvchi balm.",
        description: "Quruq va sezgir teri uchun mo'ljallangan, yog'li his qoldirmaydigan tozalovchi balm.",
        benefits: ["SPF va makiyajni eritadi", "Barrierni quritmaydi", "Terini silliq qoldiradi"],
        howToUse: "Quruq teriga surting, 30 soniya massaj qiling va iliq suv bilan emulsiyalab yuving.",
        textureNote: "Boy, eruvchan balm teksturasi milk-oil finish beradi."
      },
      ru: {
        name: "Velvet Cleansing Balm",
        shortName: "Velvet Balm",
        shortDescription: "Питательный бальзам, мягко растворяющий SPF и макияж.",
        description: "Очищающий бальзам для сухой и чувствительной кожи без ощущения тяжести.",
        benefits: ["Растворяет SPF и макияж", "Не пересушивает барьер", "Оставляет кожу гладкой"],
        howToUse: "Нанесите на сухую кожу, помассируйте 30 секунд и эмульгируйте тёплой водой.",
        textureNote: "Насыщенная тающая текстура превращается в мягкое молочко."
      },
      en: {
        name: "Velvet Cleansing Balm",
        shortName: "Velvet Balm",
        shortDescription: "A nourishing balm that melts makeup and SPF without stripping skin.",
        description: "A first-cleanse balm for dry and sensitive skin with a soft, cushiony finish.",
        benefits: ["Melts SPF and makeup", "Keeps the barrier comfortable", "Leaves skin smooth"],
        howToUse: "Massage onto dry skin for 30 seconds, emulsify with warm water and rinse.",
        textureNote: "Rich balm texture melts into a silky milk-oil finish."
      }
    }
  },
  {
    id: "mdl-002",
    slug: "cloud-milk-cleanser",
    category: { uz: "Tozalash", ru: "Очищение", en: "Cleanser" },
    size: "150 ml",
    price: 26,
    colors: ["#c6d2c4", "#f7f4ea"],
    translations: {
      uz: {
        name: "Cloud Milk Cleanser",
        shortName: "Cloud Milk",
        shortDescription: "Har kuni ishlatish uchun sokinlantiruvchi krem-cleanser.",
        description: "Teri mikrobiomini asrashga yordam beruvchi yumshoq milk-cleanser.",
        benefits: ["Sezgir teri uchun mos", "Qizarishni kamaytirishga yordam beradi", "Namlikni ushlab turadi"],
        howToUse: "Nam teriga ertalab va kechqurun surting, keyin suv bilan yuving.",
        textureNote: "Yengil sutli tekstura ko'pik bermaydi, ammo puxta tozalaydi."
      },
      ru: {
        name: "Cloud Milk Cleanser",
        shortName: "Cloud Milk",
        shortDescription: "Успокаивающий кремовый cleanser для ежедневного использования.",
        description: "Мягкое очищающее молочко, поддерживающее комфортный микробиом кожи.",
        benefits: ["Подходит чувствительной коже", "Смягчает ощущение покраснения", "Сохраняет влагу"],
        howToUse: "Нанесите на влажную кожу утром и вечером, затем смойте водой.",
        textureNote: "Лёгкая молочная текстура без активной пены, но с деликатным очищением."
      },
      en: {
        name: "Cloud Milk Cleanser",
        shortName: "Cloud Milk",
        shortDescription: "A calming cream cleanser for everyday barrier-friendly cleansing.",
        description: "A gentle milk cleanser designed to support comfort and microbiome balance.",
        benefits: ["Suitable for sensitive skin", "Helps calm visible redness", "Retains moisture"],
        howToUse: "Apply to damp skin morning and evening, then rinse with water.",
        textureNote: "A non-foaming milky texture that cleans thoroughly without friction."
      }
    }
  },
  {
    id: "mdl-003",
    slug: "oat-enzyme-powder",
    category: { uz: "Eksfoliatsiya", ru: "Эксфолиация", en: "Exfoliator" },
    size: "75 g",
    price: 31,
    colors: ["#d7c5a4", "#fbf0dd"],
    translations: {
      uz: {
        name: "Oat Enzyme Powder",
        shortName: "Oat Enzyme",
        shortDescription: "Yengil fermentli pudra tozalash va teksturani tekislash uchun.",
        description: "Oat va papaya fermentlari asosidagi haftalik yumshoq polish quruq teri uchun ham mos.",
        benefits: ["O'lik hujayralarni muloyim olib tashlaydi", "Teksturani tekislaydi", "Terini yorqin ko'rsatadi"],
        howToUse: "Kaftga ozroq pudra solib, suv bilan ko'pirtiring va 1 daqiqa massaj qiling.",
        textureNote: "Mayin powder-water tekstura kremsimon paste hosil qiladi."
      },
      ru: {
        name: "Oat Enzyme Powder",
        shortName: "Oat Enzyme",
        shortDescription: "Ферментная пудра для мягкого очищения и выравнивания текстуры.",
        description: "Еженедельный мягкий polish с овсом и папайей для тусклой и шероховатой кожи.",
        benefits: ["Удаляет ороговевшие клетки", "Выравнивает текстуру", "Добавляет сияние"],
        howToUse: "Насыпьте немного пудры в ладонь, вспеньте с водой и массируйте 1 минуту.",
        textureNote: "Мелкая пудра превращается в кремовую пасту."
      },
      en: {
        name: "Oat Enzyme Powder",
        shortName: "Oat Enzyme",
        shortDescription: "A low-friction enzyme powder for texture smoothing and soft radiance.",
        description: "A weekly exfoliating polish with oat and papaya enzymes for dull, uneven skin.",
        benefits: ["Lifts dead skin gently", "Refines rough texture", "Boosts brightness"],
        howToUse: "Shake a small amount into wet hands, foam lightly and massage for one minute.",
        textureNote: "A fine powder transforms into a creamy paste with water."
      }
    }
  },
  {
    id: "mdl-004",
    slug: "pore-reset-tonic",
    category: { uz: "Toner", ru: "Тоник", en: "Toner" },
    size: "150 ml",
    price: 24,
    colors: ["#9bb7b3", "#eef7f5"],
    translations: {
      uz: {
        name: "Pore Reset Tonic",
        shortName: "Pore Reset",
        shortDescription: "Niacinamide va willow bark bilan balanslovchi toner.",
        description: "Poralarni vizual toza ko'rsatish va yog' balansini yumshatish uchun kundalik tonic.",
        benefits: ["Poralar ko'rinishini kamaytiradi", "Yog'lanishni balanslaydi", "Keyingi serum uchun tayyorlaydi"],
        howToUse: "Tozalashdan keyin paxta disksiz, kaft bilan yengil bosib singdiring.",
        textureNote: "Suvdek engil tonic tez so'riladi va yopishqoq emas."
      },
      ru: {
        name: "Pore Reset Tonic",
        shortName: "Pore Reset",
        shortDescription: "Балансирующий тоник с niacinamide и willow bark.",
        description: "Ежедневный tonic для визуально более чистых пор и мягкого контроля себума.",
        benefits: ["Сужает видимость пор", "Балансирует жирность", "Готовит кожу к сыворотке"],
        howToUse: "После очищения нанесите ладонями мягкими прижимающими движениями.",
        textureNote: "Лёгкий как вода tonic быстро впитывается без липкости."
      },
      en: {
        name: "Pore Reset Tonic",
        shortName: "Pore Reset",
        shortDescription: "A balancing toner with niacinamide and willow bark for clearer-looking pores.",
        description: "An everyday tonic that refreshes oily zones and preps skin for the next steps.",
        benefits: ["Refines the look of pores", "Balances excess oil", "Preps skin for serum"],
        howToUse: "Press into clean skin with your hands after cleansing.",
        textureNote: "A water-light tonic that absorbs fast without tackiness."
      }
    }
  },
  {
    id: "mdl-005",
    slug: "rose-ferment-essence",
    category: { uz: "Essence", ru: "Эссенция", en: "Essence" },
    size: "120 ml",
    price: 33,
    colors: ["#d8a2aa", "#fff1f2"],
    translations: {
      uz: {
        name: "Rose Ferment Essence",
        shortName: "Rose Essence",
        shortDescription: "Glow va namlik uchun fermentlangan essence.",
        description: "Rose water, ferment va betaine bilan terini yumshatib, nurlanish beruvchi essence.",
        benefits: ["Glow beradi", "Namlik qatlamlaydi", "Terini silliqlashtiradi"],
        howToUse: "Tonerdan keyin 2-3 qatlam qilib kaft bilan bosib surting.",
        textureNote: "Suvli essence terida ipakdek nam finish qoldiradi."
      },
      ru: {
        name: "Rose Ferment Essence",
        shortName: "Rose Essence",
        shortDescription: "Ферментированная essence для сияния и увлажнения.",
        description: "Эссенция с rose water, ферментами и betaine для мягкости и ровного свечения.",
        benefits: ["Добавляет glow", "Наслаивает влагу", "Смягчает поверхность кожи"],
        howToUse: "После тоника нанесите 2-3 слоя ладонями мягкими нажатиями.",
        textureNote: "Водянистая essence оставляет шелковистый влажный финиш."
      },
      en: {
        name: "Rose Ferment Essence",
        shortName: "Rose Essence",
        shortDescription: "A ferment-rich essence for layered hydration and soft glow.",
        description: "An essence with rose water, betaine and ferments to plump and smooth tired skin.",
        benefits: ["Adds glow", "Builds hydration", "Softens skin texture"],
        howToUse: "Pat in two to three layers after toner.",
        textureNote: "A watery essence that leaves a silky hydrated finish."
      }
    }
  },
  {
    id: "mdl-006",
    slug: "niacinamide-daily-serum",
    category: { uz: "Serum", ru: "Сыворотка", en: "Serum" },
    size: "30 ml",
    price: 29,
    colors: ["#8eadb6", "#edf7fb"],
    translations: {
      uz: {
        name: "Niacinamide Daily Serum",
        shortName: "Niacinamide",
        shortDescription: "Har kunlik pora-balancing serum.",
        description: "5% niacinamide va zinc PCA bilan teri rangini bir maromga keltiruvchi serum.",
        benefits: ["Teri tonini tekislaydi", "Yog'lanishni nazorat qiladi", "Poralarni silliq ko'rsatadi"],
        howToUse: "Essencedan keyin 2-3 tomchi surting, krem bilan yoping.",
        textureNote: "Suvsimon-gel tekstura qatlamlash uchun juda qulay."
      },
      ru: {
        name: "Niacinamide Daily Serum",
        shortName: "Niacinamide",
        shortDescription: "Ежедневная balancing serum для более ровной кожи.",
        description: "Сыворотка с 5% niacinamide и zinc PCA для более чистого и ровного тона.",
        benefits: ["Выравнивает тон", "Контролирует жирность", "Сглаживает вид пор"],
        howToUse: "Нанесите 2-3 капли после эссенции и закройте кремом.",
        textureNote: "Лёгкая water-gel текстура удобна для наслаивания."
      },
      en: {
        name: "Niacinamide Daily Serum",
        shortName: "Niacinamide",
        shortDescription: "A balancing daily serum for tone clarity and pore refinement.",
        description: "A 5% niacinamide and zinc PCA serum that helps support a clearer, more even-looking complexion.",
        benefits: ["Visibly evens tone", "Balances excess oil", "Refines pore appearance"],
        howToUse: "Apply two to three drops after essence and follow with cream.",
        textureNote: "A light water-gel serum that layers comfortably."
      }
    }
  },
  {
    id: "mdl-007",
    slug: "cica-repair-serum",
    category: { uz: "Serum", ru: "Сыворотка", en: "Serum" },
    size: "30 ml",
    price: 34,
    colors: ["#9fb69f", "#eef6eb"],
    translations: {
      uz: {
        name: "Cica Repair Serum",
        shortName: "Cica Repair",
        shortDescription: "Sezuvchan teri uchun tiklovchi barrier serum.",
        description: "Centella, panthenol va madecassoside bilan stressga uchragan terini tinchlantiradi.",
        benefits: ["Qizarishni yumshatadi", "Barrierni qo'llab-quvvatlaydi", "Noqulaylikni kamaytiradi"],
        howToUse: "Toner yoki essence dan keyin 2 pomp surting.",
        textureNote: "Yarim-gel, yarim-essence tekstura teriga salqin his beradi."
      },
      ru: {
        name: "Cica Repair Serum",
        shortName: "Cica Repair",
        shortDescription: "Восстанавливающая barrier serum для чувствительной кожи.",
        description: "Centella, panthenol и madecassoside успокаивают перегруженную кожу.",
        benefits: ["Смягчает покраснение", "Поддерживает барьер", "Уменьшает дискомфорт"],
        howToUse: "Наносите 2 помпы после тоника или эссенции.",
        textureNote: "Полугелевая текстура даёт прохладное комфортное ощущение."
      },
      en: {
        name: "Cica Repair Serum",
        shortName: "Cica Repair",
        shortDescription: "A recovery serum for stressed, reactive skin barriers.",
        description: "Centella, panthenol and madecassoside work together to soothe and comfort overwhelmed skin.",
        benefits: ["Calms visible redness", "Supports the barrier", "Reduces discomfort"],
        howToUse: "Apply two pumps after toner or essence.",
        textureNote: "A cool semi-gel texture with a comforting finish."
      }
    }
  },
  {
    id: "mdl-008",
    slug: "vitamin-c-glow-serum",
    category: { uz: "Serum", ru: "Сыворотка", en: "Serum" },
    size: "30 ml",
    price: 36,
    colors: ["#f2b46c", "#fff3d9"],
    translations: {
      uz: {
        name: "Vitamin C Glow Serum",
        shortName: "Vitamin C",
        shortDescription: "Ertalabki nurlanish uchun antioxidant serum.",
        description: "Stabil vitamin C derivative va yuzu extract bilan teri rangini yorqinlashtiradi.",
        benefits: ["Glow beradi", "Xiralikni kamaytiradi", "Antioxidant himoya beradi"],
        howToUse: "Ertalab toner yoki essence dan keyin 2-3 tomchi surting, SPF bilan tugating.",
        textureNote: "Yengil silky serum terida tez yo'qoladi."
      },
      ru: {
        name: "Vitamin C Glow Serum",
        shortName: "Vitamin C",
        shortDescription: "Антиоксидантная serum для утреннего сияния.",
        description: "Стабильный vitamin C derivative и экстракт yuzu помогают коже выглядеть ярче.",
        benefits: ["Добавляет glow", "Снижает тусклость", "Даёт антиоксидантную защиту"],
        howToUse: "Утром наносите 2-3 капли после тоника или эссенции и завершайте SPF.",
        textureNote: "Лёгкая silky serum быстро впитывается."
      },
      en: {
        name: "Vitamin C Glow Serum",
        shortName: "Vitamin C",
        shortDescription: "An antioxidant brightening serum for a fresher morning complexion.",
        description: "A stable vitamin C derivative with yuzu extract to revive dull, uneven-looking skin.",
        benefits: ["Boosts glow", "Fights dullness", "Adds antioxidant support"],
        howToUse: "Use two to three drops in the morning and finish with SPF.",
        textureNote: "A silky lightweight serum that disappears quickly into skin."
      }
    }
  },
  {
    id: "mdl-009",
    slug: "peptide-eye-cream",
    category: { uz: "Ko'z atrofi", ru: "Для глаз", en: "Eye care" },
    size: "20 ml",
    price: 27,
    colors: ["#cab1c5", "#f7eef6"],
    translations: {
      uz: {
        name: "Peptide Eye Cream",
        shortName: "Eye Cream",
        shortDescription: "Ko'z atrofi uchun yumshoq peptide cream.",
        description: "Mayda chiziqlar va quruqlikni kamaytirishga qaratilgan peptide va caffeine kompleksi.",
        benefits: ["Quruqlikni kamaytiradi", "Ko'z atrofiga silliqlik beradi", "Ertalabgi charchoq ko'rinishini yumshatadi"],
        howToUse: "No'xat donasidek miqdorni ko'z osti va tashqi burchaklarga yengil tapping bilan surting.",
        textureNote: "Kremsimon, ammo og'ir bo'lmagan tekstura concealer ostida ham qulay."
      },
      ru: {
        name: "Peptide Eye Cream",
        shortName: "Eye Cream",
        shortDescription: "Мягкий peptide cream для зоны вокруг глаз.",
        description: "Комплекс пептидов и caffeine помогает смягчить сухость и признаки усталости.",
        benefits: ["Снижает сухость", "Сглаживает кожу вокруг глаз", "Смягчает уставший вид"],
        howToUse: "Наносите количество размером с горошину мягкими похлопывающими движениями.",
        textureNote: "Кремовая, но не тяжёлая текстура комфортна и под консилер."
      },
      en: {
        name: "Peptide Eye Cream",
        shortName: "Eye Cream",
        shortDescription: "A soft peptide eye cream for smoother, more rested-looking contours.",
        description: "Peptides and caffeine help reduce dryness and soften the look of fatigue around the eyes.",
        benefits: ["Reduces dryness", "Smooths the eye area", "Softens tired-looking contours"],
        howToUse: "Tap a pea-sized amount around the orbital bone morning and evening.",
        textureNote: "Creamy yet light, and comfortable under makeup."
      }
    }
  },
  {
    id: "mdl-010",
    slug: "ceramide-barrier-cream",
    category: { uz: "Krem", ru: "Крем", en: "Moisturizer" },
    size: "50 ml",
    price: 35,
    colors: ["#c9b8a3", "#faf3ea"],
    translations: {
      uz: {
        name: "Ceramide Barrier Cream",
        shortName: "Ceramide Cream",
        shortDescription: "Kun-u tun uchun mustahkamlovchi namlovchi krem.",
        description: "Ceramide NP, squalane va shea bilan teri to'sig'ini mustahkamlovchi universal face cream.",
        benefits: ["Uzoq namlik beradi", "Barrierni quvvatlaydi", "Quruq joylarni yumshatadi"],
        howToUse: "Serumdan keyin yuz va bo'yinga teng surtib chiqing.",
        textureNote: "O'rta zichlikdagi cushion cream to'yimli, lekin yopishqoq emas."
      },
      ru: {
        name: "Ceramide Barrier Cream",
        shortName: "Ceramide Cream",
        shortDescription: "Укрепляющий увлажняющий крем на день и ночь.",
        description: "Универсальный face cream с ceramide NP, squalane и shea для поддержки защитного барьера.",
        benefits: ["Даёт длительное увлажнение", "Поддерживает барьер", "Смягчает сухие участки"],
        howToUse: "Равномерно нанесите на лицо и шею после сыворотки.",
        textureNote: "Средне-плотный cushion cream питательный, но без липкости."
      },
      en: {
        name: "Ceramide Barrier Cream",
        shortName: "Ceramide Cream",
        shortDescription: "A strengthening moisturizer for day and night barrier support.",
        description: "A universal face cream with ceramide NP, squalane and shea butter for comfortable hydration.",
        benefits: ["Delivers long-lasting moisture", "Supports the skin barrier", "Softens dry areas"],
        howToUse: "Smooth evenly over face and neck after serum.",
        textureNote: "A cushiony medium-density cream with a nourishing, non-sticky finish."
      }
    }
  },
  {
    id: "mdl-011",
    slug: "overnight-renew-mask",
    category: { uz: "Maska", ru: "Маска", en: "Mask" },
    size: "65 ml",
    price: 39,
    colors: ["#7f8eae", "#edf1fa"],
    translations: {
      uz: {
        name: "Overnight Renew Mask",
        shortName: "Renew Mask",
        shortDescription: "Tun davomida namlik va silliqlik beruvchi sleeping mask.",
        description: "Peptide, ectoin va hyaluronic kompleks bilan ertalab yumshoq ko'rinish beruvchi maska.",
        benefits: ["Ertalab glow beradi", "Tun davomida namlik saqlaydi", "Teksturani silliqlaydi"],
        howToUse: "Kechasi oxirgi qadam sifatida yupqa qatlamda surting va ertalab yuving.",
        textureNote: "Gel-cream sleeping mask yostiqqa yopishmaydi."
      },
      ru: {
        name: "Overnight Renew Mask",
        shortName: "Renew Mask",
        shortDescription: "Sleeping mask для ночного увлажнения и гладкости.",
        description: "Маска с peptide, ectoin и hyaluronic комплексом для более мягкой кожи утром.",
        benefits: ["Даёт glow утром", "Удерживает влагу ночью", "Сглаживает текстуру"],
        howToUse: "Наносите тонким слоем как последний этап вечернего ухода.",
        textureNote: "Gel-cream texture не липнет к подушке."
      },
      en: {
        name: "Overnight Renew Mask",
        shortName: "Renew Mask",
        shortDescription: "A sleeping mask for overnight hydration, bounce and smoothness.",
        description: "A peptide, ectoin and hyaluronic overnight treatment that leaves skin cushioned by morning.",
        benefits: ["Adds morning glow", "Locks in moisture overnight", "Smooths rough texture"],
        howToUse: "Apply a thin layer as the final evening step and rinse in the morning.",
        textureNote: "A gel-cream sleeping mask that stays comfortable through the night."
      }
    }
  },
  {
    id: "mdl-012",
    slug: "mineral-spf50-fluid",
    category: { uz: "SPF", ru: "SPF", en: "SPF" },
    size: "50 ml",
    price: 32,
    colors: ["#d0c4a2", "#fff7e7"],
    translations: {
      uz: {
        name: "Mineral SPF50 Fluid",
        shortName: "SPF50 Fluid",
        shortDescription: "Kundalik himoya uchun yengil mineral SPF.",
        description: "Keng spektrli mineral filtrlar bilan shahar hayoti uchun mo'ljallangan no-heavy sunscreen.",
        benefits: ["SPF50 himoya", "Yengil finish", "Makiyaj ostida qulay"],
        howToUse: "Routine oxirida 2 barmoq qoidasi bo'yicha yuz va bo'yinga surting.",
        textureNote: "Fluid-lotion tekstura tez tarqaladi va oq qatlamni minimallashtiradi."
      },
      ru: {
        name: "Mineral SPF50 Fluid",
        shortName: "SPF50 Fluid",
        shortDescription: "Лёгкий минеральный SPF для ежедневной защиты.",
        description: "Широкий спектр защиты с комфортной fluid текстурой для города и офиса.",
        benefits: ["Защита SPF50", "Лёгкий финиш", "Комфортен под макияж"],
        howToUse: "Нанесите по правилу двух пальцев на лицо и шею как последний шаг ухода.",
        textureNote: "Fluid-lotion texture быстро распределяется и минимизирует белый след."
      },
      en: {
        name: "Mineral SPF50 Fluid",
        shortName: "SPF50 Fluid",
        shortDescription: "A lightweight mineral sunscreen for daily broad-spectrum protection.",
        description: "A city-friendly SPF50 fluid with a comfortable finish designed for everyday wear.",
        benefits: ["SPF50 protection", "Lightweight finish", "Comfortable under makeup"],
        howToUse: "Apply two finger lengths to face and neck as the final morning step.",
        textureNote: "A fluid-lotion texture that spreads quickly with minimal cast."
      }
    }
  },
  {
    id: "mdl-013",
    slug: "lipid-body-lotion",
    category: { uz: "Body care", ru: "Body care", en: "Body care" },
    size: "250 ml",
    price: 30,
    colors: ["#b99d8d", "#f8eee6"],
    translations: {
      uz: {
        name: "Lipid Body Lotion",
        shortName: "Body Lotion",
        shortDescription: "Tana uchun tez singadigan lipid-rich lotion.",
        description: "Dushdan keyin quruq joylarni yumshatish uchun ceramide va oat oil bilan boyitilgan lotion.",
        benefits: ["Quruqlikni kamaytiradi", "Tez singadi", "Teri elastikligini qo'llab-quvvatlaydi"],
        howToUse: "Dushdan keyin nam tana terisiga surtib chiqing.",
        textureNote: "Silky lotion tez singadi va kiyimga yopishmaydi."
      },
      ru: {
        name: "Lipid Body Lotion",
        shortName: "Body Lotion",
        shortDescription: "Быстро впитывающийся lipid-rich lotion для тела.",
        description: "Лосьон с ceramide и oat oil для смягчения сухости после душа.",
        benefits: ["Снижает сухость", "Быстро впитывается", "Поддерживает эластичность"],
        howToUse: "Наносите на слегка влажную кожу тела после душа.",
        textureNote: "Silky lotion быстро впитывается и не липнет к одежде."
      },
      en: {
        name: "Lipid Body Lotion",
        shortName: "Body Lotion",
        shortDescription: "A fast-absorbing body lotion enriched with lipids and oat oils.",
        description: "A comfort-focused body lotion with ceramides and oat oil for post-shower softness.",
        benefits: ["Relieves dryness", "Absorbs quickly", "Supports elasticity"],
        howToUse: "Smooth onto slightly damp body skin after showering.",
        textureNote: "A silky lotion that sinks in fast without sticking to clothes."
      }
    }
  },
  {
    id: "mdl-014",
    slug: "hand-repair-cream",
    category: { uz: "Hand care", ru: "Hand care", en: "Hand care" },
    size: "50 ml",
    price: 18,
    colors: ["#d2bfa9", "#faf5ed"],
    translations: {
      uz: {
        name: "Hand Repair Cream",
        shortName: "Hand Cream",
        shortDescription: "Tez yumshatadigan, non-greasy qo'l kremi.",
        description: "Ceramide, glycerin va bisabolol bilan yuvishdan keyin qo'llarni tiklashga yordam beradi.",
        benefits: ["Quruq qo'llarni yumshatadi", "Tez singadi", "Kun davomida qulay"],
        howToUse: "Kerak bo'lganda qo'llarga surtib, ayniqsa yuvishdan keyin yangilang.",
        textureNote: "Qalinroq, ammo tez singadigan cream-balm teksturasi."
      },
      ru: {
        name: "Hand Repair Cream",
        shortName: "Hand Cream",
        shortDescription: "Быстро смягчающий non-greasy крем для рук.",
        description: "Ceramide, glycerin и bisabolol помогают восстановить комфорт после частого мытья рук.",
        benefits: ["Смягчает сухие руки", "Быстро впитывается", "Комфортен в течение дня"],
        howToUse: "Наносите по мере необходимости, особенно после мытья рук.",
        textureNote: "Плотный, но быстро впитывающийся cream-balm."
      },
      en: {
        name: "Hand Repair Cream",
        shortName: "Hand Cream",
        shortDescription: "A fast-comfort hand cream with a non-greasy protective finish.",
        description: "Ceramides, glycerin and bisabolol help restore comfort after repeated hand washing.",
        benefits: ["Softens dry hands", "Absorbs quickly", "Feels comfortable all day"],
        howToUse: "Apply whenever needed, especially after washing hands.",
        textureNote: "A richer cream-balm texture that still absorbs fast."
      }
    }
  },
  {
    id: "mdl-015",
    slug: "weekly-acid-peel",
    category: { uz: "Eksfoliatsiya", ru: "Эксфолиация", en: "Treatment" },
    size: "30 ml",
    price: 37,
    colors: ["#af7f8f", "#f8ebf1"],
    translations: {
      uz: {
        name: "Weekly Acid Peel",
        shortName: "Acid Peel",
        shortDescription: "Haftalik glow uchun AHA/PHA treatment.",
        description: "Mild acid kompleks pigmentatsiya va notekis teksturani yumshoq target qiladi.",
        benefits: ["Glow kuchaytiradi", "Teksturani tekislaydi", "Teri rangini yangilaydi"],
        howToUse: "Haftasiga 1-2 marta toza teriga kechqurun 10 daqiqa qoldirib, yuvib tashlang.",
        textureNote: "Yupqa gel treatment terida yengil tingling berishi mumkin."
      },
      ru: {
        name: "Weekly Acid Peel",
        shortName: "Acid Peel",
        shortDescription: "AHA/PHA treatment для еженедельного glow.",
        description: "Мягкий кислотный комплекс помогает работать с тусклостью и неровной текстурой.",
        benefits: ["Усиливает glow", "Выравнивает текстуру", "Освежает тон"],
        howToUse: "Используйте 1-2 раза в неделю вечером на 10 минут и смойте.",
        textureNote: "Тонкий gel treatment может давать лёгкое покалывание."
      },
      en: {
        name: "Weekly Acid Peel",
        shortName: "Acid Peel",
        shortDescription: "A weekly AHA/PHA peel for smoother texture and renewed glow.",
        description: "A mild acid complex that targets dullness, uneven texture and a tired-looking surface.",
        benefits: ["Boosts glow", "Smooths texture", "Refreshes tone"],
        howToUse: "Use once or twice weekly at night for ten minutes, then rinse.",
        textureNote: "A thin gel treatment that may create a light tingling sensation."
      }
    }
  }
];

export function getLocalizedProducts(locale: Locale): LocalizedProduct[] {
  return products.map((product) => {
    const translation = product.translations[locale];

    return {
      id: product.id,
      slug: product.slug,
      category: product.category[locale],
      size: product.size,
      price: product.price,
      colors: product.colors,
      name: translation.name,
      shortName: translation.shortName,
      shortDescription: translation.shortDescription,
      description: translation.description,
      benefits: translation.benefits,
      howToUse: translation.howToUse,
      textureNote: translation.textureNote,
      metaTitle: translation.name,
      metaDescription: translation.shortDescription,
      h1: translation.name
    };
  });
}

export function getLocalizedProduct(locale: Locale, slug: string) {
  return getLocalizedProducts(locale).find((product) => product.slug === slug);
}
