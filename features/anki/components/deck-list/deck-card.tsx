"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock3, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <Card className="">
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
    <CardHeader className=" border-b">
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

function Meta({ createdAtLabel }: { createdAtLabel: string }) {
  return (
    <Badge variant="outline" className="rounded-full bg-background/80 px-3 py-1">
      <Clock3 data-icon="inline-start" />
      {createdAtLabel}
    </Badge>
  );
}

function Stats({
  dueCards,
  totalCards,
}: {
  dueCards: number;
  totalCards: number;
}) {
  return (
    <div className="grid gap-3 grid-cols-2">
      <div className="rounded-lg border border-border/60 bg-background/80 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Due now
        </p>
        <p className="mt-2 font-heading text-3xl text-foreground">{dueCards}</p>
      </div>
      <div className="rounded-lg border border-border/60 bg-background/80 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Total cards
        </p>
        <p className="mt-2 font-heading text-3xl text-foreground">{totalCards}</p>
      </div>
    </div>
  );
}

function Actions({
  href,
  studyHref,
}: {
  href: string;
  studyHref: string;
}) {
  return (
    <CardFooter className="flex flex-wrap items-center gap-3 border-t border-border/60 bg-secondary/20 px-5 py-4 sm:px-6">
      <Link href={studyHref} className={cn(buttonVariants({ variant: "default" }), "")}>
        <BookOpen data-icon="inline-start" />
        Study deck
      </Link>
      <Link href={href} className={cn(buttonVariants({ variant: "outline" }), "")}>
        <Layers3 data-icon="inline-start" />
        Manage cards
      </Link>
    </CardFooter>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <CardContent className="flex flex-col gap-4">{children}</CardContent>;
}

/**
 * Compound card primitive for deck summaries.
 */
export const DeckCard = {
  Actions,
  Body,
  Header,
  Meta,
  Root,
  Stats,
};
