const CYRILLIC_MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya"
};

export function slugifyText(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

  const transliterated = Array.from(normalized)
    .map((character) => {
      if (CYRILLIC_MAP[character]) {
        return CYRILLIC_MAP[character];
      }

      if (character === "ў") {
        return "o";
      }

      if (character === "қ") {
        return "q";
      }

      if (character === "ғ") {
        return "g";
      }

      if (character === "ҳ") {
        return "h";
      }

      if (character === "'" || character === "’" || character === "`") {
        return "";
      }

      return character;
    })
    .join("");

  return transliterated
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
