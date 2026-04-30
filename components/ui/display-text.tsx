import { normalizeDisplayText, splitDisplayTextForGlyphFallback } from "@/lib/display-text";

type DisplayTextProps = {
  value: string;
  normalize?: boolean;
};

export function DisplayText({ value, normalize = true }: DisplayTextProps) {
  const displayValue = normalize ? normalizeDisplayText(value) : value;

  return splitDisplayTextForGlyphFallback(displayValue).map((part, index) =>
    part === "+" || part === "&" ? (
      <span key={`${part}-${index}`} className="[font-family:var(--font-body),Arial,sans-serif] font-normal tracking-normal">
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
}
