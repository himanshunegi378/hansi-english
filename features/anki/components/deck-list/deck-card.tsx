"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";

/**
 * Primary container for a deck summary card.
 */
function Root({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.28, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="group relative gap-0 grid h-full grid-cols-[1fr_auto] overflow-hidden rounded-xl border border-border/50 bg-card/40 transition-all hover:bg-card/60 hover:shadow-lg">
        {children}
      </Card>
    </motion.div>
  );
}


/**
 * Descriptive header for the deck.
 */
function Header({
  description,
  href,
  title,
  actions,
}: {
  description: string | null;
  href: string;
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <CardHeader className="col-start-1 row-start-1 p-5 pb-2 relative">
      <div className="flex items-start justify-between gap-4">
        <CardTitle className="text-xl">
          <Link href={href} className="transition-opacity hover:opacity-80">
            {title}
          </Link>
        </CardTitle>
      </div>
      {actions && <div className="absolute top-5 right-0">{actions}</div>}
      <CardDescription className="line-clamp-2 min-h-10 leading-relaxed text-balance">
        {description || "A focused deck for steady spaced-repetition practice."}
      </CardDescription>
    </CardHeader>
  );
}

/**
 * Renders the total card count as a secondary stat.
 */
function TotalStat({
  count,
  href,
}: {
  count: number;
  href: string;
}) {
  return (
    <div className="col-start-1 row-start-2 px-5 pb-5 mt-auto">
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/40"
      >
        <Layers className="size-3.5" />
        <span>
          {count} {count === 1 ? "card" : "cards"}
        </span>
      </Link>
    </div>
  );
}

/**
 * Full-height indicator for cards due for review (right side).
 */
function DueIndicator({
  count,
  href,
}: {
  count: number;
  href: string;
}) {
  const isDue = count > 0;

  return (
    <Link
      href={href}
      className={cn(
        "col-start-2 row-span-2 flex w-20 flex-col items-center justify-center border-l border-border/50 transition-all sm:w-24",
        isDue
          ? "bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground"
          : "bg-secondary/5 text-muted-foreground/40 hover:bg-secondary/10"
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
        Due
      </span>
      <span className={cn(
        "mt-1 text-4xl font-heading font-bold tabular-nums tracking-tight",
        isDue ? "opacity-100" : "opacity-40"
      )}>
        {count}
      </span>
    </Link>
  );
}

/**
 * Compound card primitive for deck summaries in a grid.
 */
export const DeckCard = {
  DueIndicator,
  Header,
  Root,
  TotalStat,
};
