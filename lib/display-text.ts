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

export function normalizeDisplayText(value: string) {
  return decodeHtmlEntities(value).normalize("NFKC");
}

export function splitDisplayTextForGlyphFallback(value: string) {
  return value.split(/([+&])/u);
}
