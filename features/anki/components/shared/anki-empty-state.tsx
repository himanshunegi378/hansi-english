import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnkiEmptyStateProps {
  actionHref?: string;
  actionLabel?: string;
  description: string;
  icon: LucideIcon;
  title: string;
}

/**
 * Renders a consistent empty state for Anki screens.
 * @param props Empty-state icon, copy, and optional CTA.
 * @returns Empty-state panel.
 */
export function AnkiEmptyState({
  actionHref,
  actionLabel,
  description,
  icon: Icon,
  title,
}: AnkiEmptyStateProps) {
  return (
    <Empty className="rounded-[1.75rem] border-border/60 bg-background/70 px-6 py-10">
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="size-12 rounded-full bg-secondary text-secondary-foreground"
        >
          <Icon />
        </EmptyMedia>
        <EmptyTitle className="text-lg">{title}</EmptyTitle>
        <EmptyDescription className="max-w-md">{description}</EmptyDescription>
      </EmptyHeader>
      {actionHref && actionLabel ? (
        <EmptyContent>
          <Link
            href={actionHref}
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-full px-5",
            )}
          >
            {actionLabel}
          </Link>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
