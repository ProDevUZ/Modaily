import type { Locale } from "@/lib/i18n";

export type SkinTypeOptionRecord = {
  id: string;
  value: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
};

export const defaultSkinTypeOptions = [
  {
    value: "universal",
    nameUz: "Universal teri",
    nameRu: "Универсальная кожа",
    nameEn: "Universal skin"
  },
  {
    value: "normal",
    nameUz: "Normal teri",
    nameRu: "Нормальная кожа",
    nameEn: "Normal skin"
  },
  {
    value: "dry",
    nameUz: "Quruq teri",
    nameRu: "Сухая кожа",
    nameEn: "Dry skin"
  },
  {
    value: "combination",
    nameUz: "Kombinatsiyalangan teri",
    nameRu: "Комбинированная кожа",
    nameEn: "Combination skin"
  },
  {
    value: "oily",
    nameUz: "Yog'li teri",
    nameRu: "Жирная кожа",
    nameEn: "Oily skin"
  },
  {
    value: "sensitive",
    nameUz: "Sezgir teri",
    nameRu: "Чувствительная кожа",
    nameEn: "Sensitive skin"
  },
  {
    value: "problematic",
    nameUz: "Muammoli teri",
    nameRu: "Проблемная кожа",
    nameEn: "Problem skin"
  }
] as const satisfies readonly Omit<SkinTypeOptionRecord, "id">[];

export function getSkinTypeLabel(option: SkinTypeOptionRecord, locale: Locale) {
  if (locale === "uz") {
    return option.nameUz || option.nameEn || option.nameRu;
  }

  if (locale === "ru") {
    return option.nameRu || option.nameEn || option.nameUz;
  }

  return option.nameEn || option.nameRu || option.nameUz;
}

export function buildSkinTypeLabelMap(
  options: SkinTypeOptionRecord[],
  locale: Locale
) {
  return new Map(options.map((option) => [option.value, getSkinTypeLabel(option, locale)]));
}
