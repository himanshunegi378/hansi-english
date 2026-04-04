"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpenText, Bookmark, CircleHelp, NotebookPen, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { type StoryListItem } from "@/features/story";

interface StoriesHeroProps {
  canCreateStories: boolean;
  stories: StoryListItem[];
}

/**
 * Builds compact story-library metrics for the hero surface.
 * @param stories The saved stories available in the library.
 * @returns A small set of display-ready metrics.
 */
function getLibraryStats(stories: StoryListItem[]) {
  const totalQuestions = stories.reduce((sum, story) => sum + story.questionCount, 0);
  const completedStories = stories.filter((story) => story.isCompleted).length;

  return [
    { label: "Stories", value: String(stories.length).padStart(2, "0") },
    { label: "Questions", value: String(totalQuestions).padStart(2, "0") },
    { label: "Completed", value: String(completedStories).padStart(2, "0") },
  ];
}

/**
 * Renders the editorial hero for the saved stories library.
 * @param props The hero props.
 * @returns A branded story-library header.
 */
export function StoriesHero({ canCreateStories, stories }: StoriesHeroProps) {
  const stats = getLibraryStats(stories);

  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-border/70 bg-background/80 px-6 py-8 shadow-sm backdrop-blur-sm sm:px-8 sm:py-10 lg:px-10">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,theme(colors.secondary/.85)_0%,transparent_42%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-border/70" />
      <div aria-hidden="true" className="absolute bottom-6 right-6 size-32 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="h-auto rounded-full px-4 py-2 text-[0.68rem] uppercase tracking-[0.28em]">
              <BookOpenText data-icon="inline-start" />
              Reading desk
            </Badge>
            <Badge variant="secondary" className="h-auto rounded-full px-4 py-2 text-[0.68rem] uppercase tracking-[0.28em]">
              <Bookmark data-icon="inline-start" />
              Saved library
            </Badge>
          </div>

          <div className="flex max-w-3xl flex-col gap-4">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Revisit stories, vocabulary, and practice
            </p>
            <h1 className="font-heading text-4xl leading-none tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
              A quieter place to keep every story
              <span className="block text-muted-foreground">you want to return to.</span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Browse the shared library, reopen familiar passages, and keep your reading
              practice close at hand without losing the calm of the page.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="#story-library"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-7 text-sm uppercase tracking-[0.2em]",
              )}
            >
              <BookOpenText data-icon="inline-start" />
              Open library
            </Link>
            {canCreateStories ? (
              <Link
                href="/story"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full px-7 text-sm uppercase tracking-[0.2em]",
                )}
              >
                <Sparkles data-icon="inline-start" />
                Create story
              </Link>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-border/70 bg-background/75 px-5 py-4 backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 font-heading text-3xl tracking-[-0.04em]">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 24, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
          className="relative"
        >
          <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] bg-secondary/80 blur-2xl" />
          <div className="relative flex flex-col gap-5 overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-2xl shadow-primary/8">
            <div className="flex items-center justify-between border-b border-dashed border-border pb-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Library notes
              </p>
              <NotebookPen className="text-muted-foreground" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-border/60 bg-background/70 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  What this space is for
                </p>
                <p className="mt-3 font-heading text-2xl leading-tight tracking-[-0.03em]">
                  Reading practice that stays organized, gentle, and easy to revisit.
                </p>
              </div>

              <Separator />

              <div className="flex items-start gap-4 rounded-3xl border border-border/60 bg-background/70 px-4 py-4">
                <CircleHelp className="mt-0.5 text-muted-foreground" />
                <div className="flex flex-col gap-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Best use
                  </p>
                  <p className="text-sm leading-7 text-foreground/90">
                    Return to stories you enjoyed, compare question results, and keep
                    reading in context instead of drilling isolated words.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
