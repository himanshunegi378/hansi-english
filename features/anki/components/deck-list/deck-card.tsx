"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    >
      <Card className="rounded-md">
        {children}
      </Card>
    </motion.div>
  );
}

function Header({
  description,
  href,
  title,
}: {
  description: string | null;
  href: string;
  title: string;
}) {
  return (
    <CardHeader className="py-4 border-b">
      <CardTitle className="">
        <Link href={href} className="transition-opacity hover:opacity-80">
          {title}
        </Link>
      </CardTitle>
      <CardDescription className="">
        {description || "A focused deck for steady spaced-repetition practice."}
      </CardDescription>
    </CardHeader>
  );
}

/**
 * Renders the deck stat links for study and card management.
 */
function Stats({
  dueCards,
  dueHref,
  totalCards,
  totalHref,
}: {
  dueCards: number;
  dueHref: string;
  totalCards: number;
  totalHref: string;
}) {
  return (
    <div className="grid gap-3 grid-cols-2">
      <Link
        href={dueHref}
        className="rounded-lg border border-border/60 bg-background/80 p-4 transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Due now
        </p>
        <p className="mt-2 font-heading text-3xl text-foreground">{dueCards}</p>
      </Link>
      <Link
        href={totalHref}
        className="rounded-lg border border-border/60 bg-background/80 p-4 transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Total cards
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="font-heading text-3xl text-foreground">{totalCards}</p>
          {totalCards === 0 ? (
            <p className="text-sm font-medium text-muted-foreground">Add card</p>
          ) : null}
        </div>
      </Link>
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <CardContent className="flex flex-col gap-4 pb-4">{children}</CardContent>;
}

/**
 * Compound card primitive for deck summaries.
 */
export const DeckCard = {
  Body,
  Header,
  Root,
  Stats,
};
