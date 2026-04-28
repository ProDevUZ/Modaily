export function normalizeDisplayText(value: string) {
  return value.replace(/[＋﹢⁺₊➕✚✛✜⊕⨁ᐩ᛭⨢⨣∔]/g, "+");
}

export function splitDisplayTextForGlyphFallback(value: string) {
  return normalizeDisplayText(value).split(/([+&])/g);
}
