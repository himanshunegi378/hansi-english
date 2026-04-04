"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, Languages, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const learningSignals = [
  "Read stories matched to your level",
  "Tap unfamiliar words for fast help",
  "Practice with questions that reinforce meaning",
];

const heroStats = [
  { label: "Stories", value: "Adaptive" },
  { label: "Vocabulary", value: "Instant" },
  { label: "Practice", value: "Active" },
];

/**
 * Renders the landing-page hero for the English learning experience.
 * @returns The primary homepage hero section.
 */
export function LandingHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl flex-col justify-center px-5 py-10 sm:px-8 sm:py-16 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]"
        >
          <div className="flex flex-col gap-6 sm:gap-7">
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              <Badge
                variant="outline"
                className="h-auto rounded-full px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.24em] sm:px-4 sm:py-2 sm:text-[0.7rem] sm:tracking-[0.28em]"
              >
                <Languages data-icon="inline-start" />
                English, made readable
              </Badge>
              <Badge
                variant="secondary"
                className="h-auto rounded-full px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.24em] sm:px-4 sm:py-2 sm:text-[0.7rem] sm:tracking-[0.28em]"
              >
                <Sparkles data-icon="inline-start" />
                Story-led practice
              </Badge>
            </div>

            <div className="flex max-w-3xl flex-col gap-4 sm:gap-5">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground sm:text-sm sm:tracking-[0.32em]">
                Learn by reading, not memorizing
              </p>
              <h1 className="font-heading text-4xl leading-[0.95] tracking-[-0.04em] text-balance sm:text-6xl sm:leading-none lg:text-8xl">
                English that opens up
                <span className="block text-muted-foreground">one story at a time.</span>
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Hansi English helps learners build confidence through level-aware stories,
                quick vocabulary support, and comprehension questions that turn reading
                into lasting practice.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/story"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full rounded-full px-6 text-sm uppercase tracking-[0.18em] sm:w-auto sm:px-7 sm:tracking-[0.22em]",
                )}
              >
                <BookOpenText data-icon="inline-start" />
                Start a story
              </Link>
              <Link
                href="/stories"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full rounded-full px-6 text-sm uppercase tracking-[0.18em] sm:w-auto sm:px-7 sm:tracking-[0.22em]",
                )}
              >
                Explore library
                <ArrowRight data-icon="inline-end" />
              </Link>
            </div>

            <div className="grid gap-3 pt-1 sm:pt-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-border/70 bg-background/75 px-4 py-3.5 backdrop-blur-sm sm:px-5 sm:py-4"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-heading text-2xl tracking-[-0.04em] sm:text-3xl">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-secondary/80 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 p-5 shadow-2xl shadow-primary/10 sm:p-6">
              <div className="flex items-center justify-between border-b border-dashed border-border pb-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Reading Desk
                </p>
                <p className="font-heading text-base sm:text-lg">Beginner to Advanced</p>
              </div>

              <div className="flex flex-col gap-4 py-5 sm:gap-5 sm:py-6">
                {learningSignals.map((signal, index) => (
                  <motion.div
                    key={signal}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 + index * 0.12 }}
                    className="flex items-start gap-3 rounded-3xl border border-border/60 bg-background/70 px-3.5 py-3.5 sm:gap-4 sm:px-4 sm:py-4"
                  >
                    <span className="font-heading text-2xl leading-none text-muted-foreground sm:text-3xl">
                      0{index + 1}
                    </span>
                    <p className="pt-0.5 text-sm leading-6 text-foreground/90 sm:pt-1 sm:leading-7">{signal}</p>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-[1.5rem] border border-border/70 bg-secondary/70 p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Why it works
                </p>
                <p className="mt-3 max-w-md font-heading text-xl leading-tight tracking-[-0.03em] sm:text-2xl">
                  Familiar reading rituals, supported by AI when you need it.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
