import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import {
  buildSkinTypeLabelMap,
  defaultSkinTypeOptions,
  getSkinTypeLabel,
  type SkinTypeOptionRecord
} from "@/lib/skin-types";

async function seedDefaultSkinTypeOptions() {
  const count = await prisma.skinTypeOption.count();

  if (count > 0) {
    return;
  }

  await prisma.skinTypeOption.createMany({
    data: defaultSkinTypeOptions.map((option) => ({
      value: option.value,
      nameUz: option.nameUz,
      nameRu: option.nameRu,
      nameEn: option.nameEn
    }))
  });
}

export async function getSkinTypeOptions(): Promise<SkinTypeOptionRecord[]> {
  await seedDefaultSkinTypeOptions();

  return prisma.skinTypeOption.findMany({
    orderBy: [{ createdAt: "asc" }, { nameRu: "asc" }]
  });
}

export async function getLocalizedSkinTypeOptions(locale: Locale) {
  const options = await getSkinTypeOptions();
  const labelMap = buildSkinTypeLabelMap(options, locale);

  return options.map((option) => ({
    value: option.value,
    label: labelMap.get(option.value) || getSkinTypeLabel(option, locale)
  }));
}
