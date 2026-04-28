const CYRILLIC_TO_LATIN_MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  ғ: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  қ: "q",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ў: "o",
  ф: "f",
  х: "h",
  ҳ: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sh",
  ъ: "",
  ы: "i",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya"
};

export function normalizeSearchText(value: string) {
  const normalized = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

  const transliterated = Array.from(normalized)
    .map((character) => CYRILLIC_TO_LATIN_MAP[character] ?? character)
    .join("");

  return transliterated.replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

export function matchesSearchQuery(values: Array<string | null | undefined>, query: string) {
  const rawQuery = query.trim().toLowerCase();

  if (!rawQuery) {
    return true;
  }

  const combinedRaw = values.filter(Boolean).join(" ").toLowerCase();

  if (combinedRaw.includes(rawQuery)) {
    return true;
  }

  const normalizedQuery = normalizeSearchText(rawQuery);

  if (!normalizedQuery) {
    return false;
  }

  return normalizeSearchText(combinedRaw).includes(normalizedQuery);
}
