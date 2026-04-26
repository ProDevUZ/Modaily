export function normalizeDisplayText(value: string) {
  return value.replace(/[＋﹢⁺₊➕✚✛✜⊕⨁ᐩ᛭⨢⨣∔]/g, "+");
}
