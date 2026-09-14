"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type Base = { label: string; error?: string; id: string; hint?: string };

export function TextField({ label, error, id, hint, className, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm text-ivory/75">
        {label}
      </label>
      <input id={id} className="input" aria-invalid={!!error} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} {...rest} />
      {error ? (
        <p id={`${id}-err`} className="text-xs text-[#f07a5a]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-ivory/45">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextArea({ label, error, id, hint, className, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm text-ivory/75">
        {label}
      </label>
      <textarea id={id} className="input" aria-invalid={!!error} {...rest} />
      {error && <p className="text-xs text-[#f07a5a]">{error}</p>}
    </div>
  );
}
