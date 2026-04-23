export const SKIN_TYPE_OPTIONS = [
  { value: "universal", labelRu: "Универсальная кожа", labelUz: "Universal teri", labelEn: "Universal skin" },
  { value: "normal", labelRu: "Нормальная кожа", labelUz: "Normal teri", labelEn: "Normal skin" },
  { value: "dry", labelRu: "Сухая кожа", labelUz: "Quruq teri", labelEn: "Dry skin" },
  { value: "combination", labelRu: "Комбинированная кожа", labelUz: "Kombinatsiyalangan teri", labelEn: "Combination skin" },
  { value: "oily", labelRu: "Жирная кожа", labelUz: "Yog'li teri", labelEn: "Oily skin" },
  { value: "sensitive", labelRu: "Чувствительная кожа", labelUz: "Sezgir teri", labelEn: "Sensitive skin" },
  { value: "problematic", labelRu: "Проблемная кожа", labelUz: "Muammoli teri", labelEn: "Problem skin" }
] as const;

export const SKIN_TYPE_VALUES = SKIN_TYPE_OPTIONS.map((option) => option.value);

export const SKIN_TYPE_LABELS_RU: Record<string, string> = Object.fromEntries(
  SKIN_TYPE_OPTIONS.map((option) => [option.value, option.labelRu])
);

export const SKIN_TYPE_LABELS_UZ: Record<string, string> = Object.fromEntries(
  SKIN_TYPE_OPTIONS.map((option) => [option.value, option.labelUz])
);

export const SKIN_TYPE_LABELS_EN: Record<string, string> = Object.fromEntries(
  SKIN_TYPE_OPTIONS.map((option) => [option.value, option.labelEn])
);
