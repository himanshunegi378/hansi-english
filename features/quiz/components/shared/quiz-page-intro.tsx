"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface QuizPageIntroProps {
  actions?: ReactNode;
  description: string;
  eyebrow: string;
  meta?: ReactNode;
  title: string;
}

/**
 * Renders a shared editorial intro block for quiz surfaces.
 * @param props Intro copy plus optional metadata and actions.
 * @returns The quiz heading block.
 */
export function QuizPageIntro({ actions, description, eyebrow, meta, title }: QuizPageIntroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="overflow-hidden rounded-[2rem] border border-border/70 bg-background/80 p-5 shadow-sm backdrop-blur-sm sm:p-8"
    >
      <div className="absolute pointer-events-none inset-0 bg-linear-to-br from-primary/8 via-transparent to-accent/8" />
      <div className="relative flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <Badge variant="outline" className="rounded-full border-border bg-secondary px-3 py-1 text-foreground/85">
              {eyebrow}
            </Badge>
            <div className="mt-4 flex flex-col gap-3">
              <h1 className="font-heading text-3xl leading-tight text-foreground sm:text-5xl">{title}</h1>
              <p className="max-w-2xl text-sm leading-6 text-foreground/75 sm:text-base sm:leading-7">{description}</p>
            </div>
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
        </div>
        {meta ? <div className="flex flex-wrap items-center gap-2">{meta}</div> : null}
      </div>
    </motion.section>
  );
}
