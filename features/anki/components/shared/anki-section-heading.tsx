import type { ReactNode } from "react";

interface AnkiSectionHeadingProps {
  actions?: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}

/**
 * Renders a reusable editorial-style section heading for Anki pages.
 * @param props Heading copy and optional action area.
 * @returns Section heading content.
 */
export function AnkiSectionHeading({
  actions,
  description,
  eyebrow,
  title,
}: AnkiSectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex max-w-3xl flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground sm:text-sm sm:tracking-[0.28em]">
          {eyebrow}
        </p>
        <h1 className="font-heading text-3xl tracking-[-0.04em] text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-foreground/75 sm:text-base sm:leading-7">
          {description}
        </p>
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
