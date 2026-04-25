"use client";

import { useEffect, useRef } from "react";

type RichTextTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaLabel?: string;
  placeholder?: string;
  required?: boolean;
};

type PendingSelection = {
  start: number;
  end: number;
} | null;

function ToolbarButton({
  label,
  onClick,
  children
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#dbe3f0] bg-white text-slate-600 transition hover:bg-[#f5f8ff] hover:text-slate-900"
    >
      {children}
    </button>
  );
}

function BoldIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h5a3 3 0 0 1 0 6H6z" />
      <path d="M6 10h6a3 3 0 1 1 0 6H6z" />
    </svg>
  );
}

function ItalicIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4h4" />
      <path d="M4 16h4" />
      <path d="M11 4 9 16" />
    </svg>
  );
}

function BulletListIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="4.5" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="15" r="1" fill="currentColor" stroke="none" />
      <path d="M8 5h8" />
      <path d="M8 10h8" />
      <path d="M8 15h8" />
    </svg>
  );
}

function OrderedListIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.8 4.5h1.4v4" />
      <path d="M3.6 11.5h1.6a.9.9 0 0 1 0 1.8H3.6l1.8 2.2h-1.8" />
      <path d="M8 5h8" />
      <path d="M8 10h8" />
      <path d="M8 15h8" />
    </svg>
  );
}

function LineBreakIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5v5a3 3 0 0 0 3 3h7" />
      <path d="m11 9 3 4 3-4" />
    </svg>
  );
}

export function RichTextTextarea({
  value,
  onChange,
  className = "",
  ariaLabel,
  placeholder,
  required = false
}: RichTextTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pendingSelectionRef = useRef<PendingSelection>(null);

  useEffect(() => {
    if (!pendingSelectionRef.current || !textareaRef.current) {
      return;
    }

    const { start, end } = pendingSelectionRef.current;
    pendingSelectionRef.current = null;

    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(start, end);
    textareaRef.current.dispatchEvent(new Event("input", { bubbles: true }));
  }, [value]);

  function updateSelection(nextValue: string, nextSelection: PendingSelection) {
    pendingSelectionRef.current = nextSelection;
    onChange(nextValue);
  }

  function withSelection(
    formatter: (selectedText: string, selectionStart: number, selectionEnd: number) => {
      nextValue: string;
      nextSelection: PendingSelection;
    } | null
  ) {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    if (selectionStart === selectionEnd) {
      return;
    }

    const selectedText = value.slice(selectionStart, selectionEnd);
    const result = formatter(selectedText, selectionStart, selectionEnd);

    if (!result) {
      return;
    }

    updateSelection(result.nextValue, result.nextSelection);
  }

  function applyWrapper(prefix: string, suffix: string) {
    withSelection((selectedText, selectionStart, selectionEnd) => ({
      nextValue: `${value.slice(0, selectionStart)}${prefix}${selectedText}${suffix}${value.slice(selectionEnd)}`,
      nextSelection: {
        start: selectionStart + prefix.length,
        end: selectionEnd + prefix.length
      }
    }));
  }

  function applyList(kind: "unordered" | "ordered") {
    withSelection((selectedText, selectionStart, selectionEnd) => {
      const lines = selectedText.split("\n");
      const formatted = lines
        .map((line, index) => {
          if (!line.trim()) {
            return line;
          }

          return kind === "unordered" ? `- ${line}` : `${index + 1}. ${line}`;
        })
        .join("\n");

      return {
        nextValue: `${value.slice(0, selectionStart)}${formatted}${value.slice(selectionEnd)}`,
        nextSelection: {
          start: selectionStart,
          end: selectionStart + formatted.length
        }
      };
    });
  }

  function applyLineBreak() {
    withSelection((selectedText, selectionStart, selectionEnd) => {
      const formatted = `${selectedText}\n`;

      return {
        nextValue: `${value.slice(0, selectionStart)}${formatted}${value.slice(selectionEnd)}`,
        nextSelection: {
          start: selectionStart,
          end: selectionStart + formatted.length
        }
      };
    });
  }

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-2 rounded-[1rem] border border-[#e4e9f1] bg-[#fbfcff] p-2">
        <ToolbarButton label="Bold" onClick={() => applyWrapper("**", "**")}>
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => applyWrapper("*", "*")}>
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton label="Bulleted list" onClick={() => applyList("unordered")}>
          <BulletListIcon />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" onClick={() => applyList("ordered")}>
          <OrderedListIcon />
        </ToolbarButton>
        <ToolbarButton label="Line break" onClick={applyLineBreak}>
          <LineBreakIcon />
        </ToolbarButton>
      </div>

      <textarea
        ref={textareaRef}
        className={className}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
