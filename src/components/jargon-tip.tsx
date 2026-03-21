"use client";

import { useState, useRef, useEffect } from "react";
import { HelpCircle, X } from "lucide-react";

/**
 * JargonTip — wraps a confusing real-estate term with a plain-English tooltip.
 * Usage: <JargonTip term="Pre-Approval" definition="A letter from a lender...">Pre-Approval</JargonTip>
 */
export function JargonTip({
  term,
  definition,
  children,
}: {
  term?: string;
  definition: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const displayTerm = term ?? (typeof children === "string" ? children : "This term");

  return (
    <span ref={ref} className="relative inline-flex items-baseline gap-0.5">
      <span
        className="underline decoration-dashed decoration-muted-foreground/50 underline-offset-2 cursor-help"
        onClick={() => setOpen((o) => !o)}
      >
        {children}
      </span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-muted-foreground/50 hover:text-gold transition-colors ml-0.5 cursor-help inline-flex items-center"
        aria-label={`What is ${displayTerm}?`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {open && (
        <span className="absolute bottom-full left-0 mb-2.5 z-50 block w-72 bg-slate-900 border border-white/10 text-white rounded-2xl shadow-2xl px-4 py-3.5 leading-relaxed">
          {/* Caret */}
          <span className="absolute -bottom-1.5 left-4 block w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-white/10" />

          <span className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gold-text uppercase tracking-widest">
              Plain English
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
          <span className="text-sm font-semibold text-white block mb-1">
            {displayTerm}
          </span>
          <span className="text-sm text-white/70">{definition}</span>
        </span>
      )}
    </span>
  );
}
