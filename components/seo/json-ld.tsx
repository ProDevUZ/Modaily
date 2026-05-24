import { compactJsonLd, toJsonLdScriptValue, type JsonLdInput } from "@/lib/structured-data";

type JsonLdProps = {
  data: JsonLdInput | JsonLdInput[];
};

export function JsonLd({ data }: JsonLdProps) {
  const compacted = compactJsonLd(data);

  if (!compacted) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toJsonLdScriptValue(compacted) }}
    />
  );
}
