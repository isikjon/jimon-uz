"use client";

import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  as: Tag = "h2",
  light,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
  light?: boolean;
}) {
  return (
    <div className={cn("max-w-4xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal>
          <p className="eyebrow mb-5">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <Tag className={cn("h-section", light ? "text-ink" : "text-ivory")}>{title}</Tag>
      </Reveal>
      {lead && (
        <Reveal delay={0.18}>
          <p className={cn("lead mt-6", align === "center" && "mx-auto", light && "text-ink/70")}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
