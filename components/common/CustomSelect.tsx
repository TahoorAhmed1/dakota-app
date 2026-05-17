"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

type Option = { value: string | number; label: React.ReactNode };

interface Props {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  className?: string;
  placeholder?: string;
  name?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  className = "",
  placeholder,
  name,
}: Props) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const hiddenRef = useRef<HTMLSelectElement>(null);

  const selectedOption = options.find((o) => String(o.value) === String(value));
  const displayLabel = selectedOption?.label ?? placeholder ?? "Select…";
  const hasValue = !!selectedOption;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (open && highlighted >= 0 && listRef.current) {
      const item = listRef.current.children[highlighted] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted, open]);

  const fireChange = useCallback(
    (opt: Option) => {
      if (!hiddenRef.current) return;
      // Mutate native select value, then dispatch change event React listens to
      const nativeInput = hiddenRef.current;
      const nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLSelectElement.prototype,
        "value"
      )?.set;
      nativeSetter?.call(nativeInput, String(opt.value));
      nativeInput.dispatchEvent(new Event("change", { bubbles: true }));
    },
    []
  );

  const selectOption = useCallback(
    (opt: Option) => {
      fireChange(opt);
      setOpen(false);
      setHighlighted(-1);
    },
    [fireChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
        setHighlighted(options.findIndex((o) => String(o.value) === String(value)));
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (highlighted >= 0) selectOption(options[highlighted]);
        break;
      case "Escape":
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`cs-root relative w-full ${className}`}>
      {/* Hidden native select keeps React's onChange working */}
      <select
        ref={hiddenRef}
        name={name}
        value={value}
        onChange={onChange}
        aria-hidden="true"
        tabIndex={-1}
        className="sr-only"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {typeof o.label === "string" ? o.label : String(o.value)}
          </option>
        ))}
      </select>

      {/* Trigger button */}
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) {
            setHighlighted(options.findIndex((o) => String(o.value) === String(value)));
          }
        }}
        onKeyDown={handleKeyDown}
        className={[
          "cs-trigger",
          "group",
          "relative flex h-12 w-full items-center gap-3",
          "rounded-xl border px-4 pr-12",
          "text-[14px] font-semibold text-left",
          "transition-all duration-200 outline-none",
          "select-none cursor-pointer",
          open
            ? "border-[#f26f2d] bg-[#fff8f4] shadow-[0_0_0_3px_rgba(242,111,45,0.15)]"
            : "border-[#ddd0c4] bg-white hover:border-[#f26f2d] hover:shadow-[0_2px_8px_rgba(242,111,45,0.12)]",
          hasValue ? "text-[#2b1a0f]" : "text-[#9e8878]",
        ].join(" ")}
      >
   

        {/* Label */}
        <span className="flex-1 truncate pl-1">{displayLabel}</span>

        {/* Chevron */}
        <span
          className={[
            "absolute right-3 top-1/2 -translate-y-1/2",
            "flex h-7 w-7 items-center justify-center rounded-lg",
            "transition-all duration-200",
            open
              ? "bg-[#f26f2d] rotate-180"
              : "bg-[#f5ede7] group-hover:bg-[#fde4d4]",
          ].join(" ")}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 5L7 9L11 5"
              stroke={open ? "#fff" : "#f26f2d"}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className={[
            "cs-panel",
            "absolute left-0 top-[calc(100%+6px)] z-50 w-full",
            "rounded-xl border border-[#e8d8cc]",
            "bg-white shadow-[0_8px_32px_rgba(76,44,17,0.14)]",
            "overflow-hidden",
            "animate-cs-in",
          ].join(" ")}
        >
          {/* Top decorative strip */}
          <div className="h-[3px] bg-gradient-to-r from-[#f26f2d] via-[#e8a87c] to-[#f26f2d]" />

          <ul
            ref={listRef}
            role="listbox"
            className="cs-list max-h-60 overflow-y-auto py-1.5 overscroll-contain"
            onKeyDown={handleKeyDown}
          >
            {options.map((opt, idx) => {
              const isSelected = String(opt.value) === String(value);
              const isHigh = idx === highlighted;

              return (
                <li
                  key={String(opt.value)}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlighted(idx)}
                  onMouseLeave={() => setHighlighted(-1)}
                  onClick={() => selectOption(opt)}
                  className={[
                    "relative mx-1.5 flex cursor-pointer items-center gap-3",
                    "rounded-lg px-3 py-2.5",
                    "text-[13.5px] font-medium",
                    "transition-all duration-100 select-none",
                    isSelected
                      ? "bg-[#fff2ea] text-[#c45a1a] font-semibold"
                      : isHigh
                      ? "bg-[#fdf0e8] text-[#2b1a0f]"
                      : "text-[#3d2510]",
                  ].join(" ")}
                >
                  {/* Selected indicator dot */}
                  <span
                    className={[
                      "h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-150",
                      isSelected ? "bg-[#f26f2d] scale-100" : "scale-0 bg-transparent",
                    ].join(" ")}
                  />

                  <span className="flex-1 truncate">{opt.label}</span>

                  {/* Checkmark */}
                  {isSelected && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="shrink-0 text-[#f26f2d]"
                    >
                      <path
                        d="M2.5 7L5.5 10L11.5 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <style>{`
        @keyframes cs-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .animate-cs-in {
          animation: cs-in 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .cs-list::-webkit-scrollbar { width: 4px; }
        .cs-list::-webkit-scrollbar-track { background: transparent; }
        .cs-list::-webkit-scrollbar-thumb {
          background: #e8d0be;
          border-radius: 99px;
        }
        .cs-list::-webkit-scrollbar-thumb:hover { background: #f26f2d; }
      `}</style>
    </div>
  );
}