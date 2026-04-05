import type { ReactNode } from "react";

interface AnkiSectionHeadingProps {
  actions?: ReactNode;
  eyebrow: string;
}

/**
 * Renders a reusable editorial-style section heading for Anki pages.
 * @param props Heading copy and optional action area.
 * @returns Section heading content.
 */
export function AnkiSectionHeading({
  actions,
  eyebrow,
}: AnkiSectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex max-w-3xl flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground sm:text-sm sm:tracking-[0.28em]">
          {eyebrow}
        </p>

      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
