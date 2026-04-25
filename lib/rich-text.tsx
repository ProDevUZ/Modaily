import { Fragment, type ReactNode } from "react";

type RichTextBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "unordered-list" | "ordered-list";
      items: string[];
    };

type RenderRichTextOptions = {
  containerClassName?: string;
  blockClassName?: string;
  listClassName?: string;
  listItemClassName?: string;
};

function renderInlineText(value: string, keyPrefix: string): ReactNode[] {
  const inlineTokenPattern = /(\*\*[^*\n]+\*\*|__[^_\n]+__|\*[^*\n]+\*|_[^_\n]+_)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = inlineTokenPattern.exec(value);

  while (match) {
    if (match.index > lastIndex) {
      parts.push(value.slice(lastIndex, match.index));
    }

    const token = match[0];
    const content = token.slice(2, -2);
    const isBold = token.startsWith("**") || token.startsWith("__");

    parts.push(
      isBold ? (
        <strong key={`${keyPrefix}-${match.index}`}>{renderInlineText(content, `${keyPrefix}-${match.index}-bold`)}</strong>
      ) : (
        <em key={`${keyPrefix}-${match.index}`}>{renderInlineText(token.slice(1, -1), `${keyPrefix}-${match.index}-italic`)}</em>
      )
    );

    lastIndex = match.index + token.length;
    match = inlineTokenPattern.exec(value);
  }

  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return parts;
}

function parseRichTextBlocks(value: string): RichTextBlock[] {
  const lines = value.replace(/\r\n?/g, "\n").split("\n");
  const blocks: RichTextBlock[] = [];
  let paragraphLines: string[] = [];
  let listType: "unordered-list" | "ordered-list" | null = null;
  let listItems: string[] = [];

  function flushParagraph() {
    if (!paragraphLines.length) {
      return;
    }

    blocks.push({
      type: "paragraph",
      text: paragraphLines.join("\n")
    });
    paragraphLines = [];
  }

  function flushList() {
    if (!listType || !listItems.length) {
      listType = null;
      listItems = [];
      return;
    }

    blocks.push({
      type: listType,
      items: [...listItems]
    });
    listType = null;
    listItems = [];
  }

  for (const line of lines) {
    const unorderedMatch = line.match(/^\s*[-*]\s+(.*)$/);
    const orderedMatch = line.match(/^\s*\d+\.\s+(.*)$/);

    if (unorderedMatch || orderedMatch) {
      flushParagraph();
      const nextType: "unordered-list" | "ordered-list" = unorderedMatch ? "unordered-list" : "ordered-list";

      if (listType && listType !== nextType) {
        flushList();
      }

      listType = nextType;
      listItems.push((unorderedMatch || orderedMatch)?.[1] || "");
      continue;
    }

    if (line === "") {
      flushParagraph();
      flushList();
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

export function hasRichTextContent(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

export function renderRichText(value: string | null | undefined, options: RenderRichTextOptions = {}) {
  if (!hasRichTextContent(value)) {
    return null;
  }

  const blocks = parseRichTextBlocks(value || "");
  const blockClassName = options.blockClassName || "whitespace-pre-wrap";
  const listClassName = options.listClassName || "space-y-2 pl-5";
  const listItemClassName = options.listItemClassName || "whitespace-pre-wrap";

  return (
    <div className={options.containerClassName || "space-y-4"}>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={`paragraph-${index}`} className={blockClassName}>
              {renderInlineText(block.text, `paragraph-${index}`)}
            </p>
          );
        }

        const ListTag = block.type === "ordered-list" ? "ol" : "ul";

        return (
          <ListTag
            key={`list-${index}`}
            className={`${listClassName} ${block.type === "ordered-list" ? "list-decimal" : "list-disc"}`.trim()}
          >
            {block.items.map((item, itemIndex) => (
              <li key={`list-${index}-item-${itemIndex}`} className={listItemClassName}>
                {renderInlineText(item, `list-${index}-item-${itemIndex}`)}
              </li>
            ))}
          </ListTag>
        );
      })}
    </div>
  );
}
