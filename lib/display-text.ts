const HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  ast: "*",
  colon: ":",
  comma: ",",
  commat: "@",
  dollar: "$",
  equals: "=",
  excl: "!",
  gt: ">",
  lcub: "{",
  lpar: "(",
  lsqb: "[",
  lt: "<",
  nbsp: " ",
  num: "#",
  percnt: "%",
  period: ".",
  plus: "+",
  quest: "?",
  quot: "\"",
  rcub: "}",
  rpar: ")",
  rsqb: "]",
  semi: ";",
  sol: "/"
};

function toCodePointCharacter(codePoint: number, fallback: string) {
  return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
    ? String.fromCodePoint(codePoint)
    : fallback;
}

function decodeHtmlEntity(entity: string) {
  if (entity.startsWith("#x") || entity.startsWith("#X")) {
    const codePoint = Number.parseInt(entity.slice(2), 16);
    return toCodePointCharacter(codePoint, `&${entity};`);
  }

  if (entity.startsWith("#")) {
    const codePoint = Number.parseInt(entity.slice(1), 10);
    return toCodePointCharacter(codePoint, `&${entity};`);
  }

  return HTML_ENTITIES[entity.toLowerCase()] || `&${entity};`;
}

function decodeHtmlEntities(value: string) {
  return value.replace(/&(#\d+|#x[\da-f]+|[a-z][a-z\d]+);/gi, (_match, entity: string) => decodeHtmlEntity(entity));
}

const WINDOWS_1251_SPECIAL_CHARS =
  "\u0402\u0403\u201A\u0453\u201E\u2026\u2020\u2021\u20AC\u2030\u0409\u2039\u040A\u040C\u040B\u040F" +
  "\u0452\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\u2122\u0459\u203A\u045A\u045C\u045B\u045F" +
  "\u00A0\u040E\u045E\u0408\u00A4\u0490\u00A6\u00A7\u0401\u00A9\u0404\u00AB\u00AC\u00AD\u00AE\u0407" +
  "\u00B0\u00B1\u0406\u0456\u0491\u00B5\u00B6\u00B7\u0451\u2116\u0454\u00BB\u0458\u0405\u0455\u0457";

const windows1251BytesByChar = new Map<string, number>(
  [
    ...Array.from(WINDOWS_1251_SPECIAL_CHARS, (char, index) => [char, index + 0x80] as const),
    ...Array.from({ length: 64 }, (_, index) => [String.fromCharCode(0x0410 + index), index + 0xc0] as const)
  ]
);

const likelyMojibakePattern = /(?:[РС][\u0400-\u04ff])|(?:в[Ђ-џ])|(?:В[«»])/;
const mojibakeMarkerPattern = /[РС][\u0400-\u04ff]|в[Ђ-џ]|В[«»]|�/g;

function countMojibakeMarkers(value: string) {
  return value.match(mojibakeMarkerPattern)?.length ?? 0;
}

function toWindows1251Bytes(value: string) {
  const bytes: number[] = [];

  for (const char of value) {
    const codePoint = char.codePointAt(0);

    if (typeof codePoint === "number" && codePoint <= 0x7f) {
      bytes.push(codePoint);
      continue;
    }

    const byte = windows1251BytesByChar.get(char);

    if (typeof byte !== "number") {
      return null;
    }

    bytes.push(byte);
  }

  return bytes;
}

function repairWindows1251Mojibake(value: string) {
  if (!likelyMojibakePattern.test(value)) {
    return value;
  }

  const bytes = toWindows1251Bytes(value);

  if (!bytes) {
    return value;
  }

  try {
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(bytes));

    return countMojibakeMarkers(decoded) < countMojibakeMarkers(value) ? decoded : value;
  } catch {
    return value;
  }
}

export function normalizeDisplayText(value: string) {
  return repairWindows1251Mojibake(decodeHtmlEntities(value)).normalize("NFKC");
}

export function splitDisplayTextForGlyphFallback(value: string) {
  return value.split(/([+&])/u);
}
