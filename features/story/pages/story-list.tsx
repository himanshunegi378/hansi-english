"use client";

import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, CalendarDays, CheckCircle2, CircleHelp, Sparkles, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { type EnglishLevel, type StoryListItem } from "../types";

const levelLabels: Record<EnglishLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

/**
 * Truncates story content into a compact preview for list surfaces.
 * @param content The saved story content.
 * @returns A short readable preview string.
 */
function getPreview(content: string): string {
  return content.length > 120 ? `${content.slice(0, 117).trimEnd()}...` : content;
}

/**
 * Formats a saved story creation timestamp for display.
 * @param createdAt The ISO timestamp string.
 * @returns A compact date label.
 */
function formatCreatedAt(createdAt: string): string {
  return format(new Date(createdAt), "MMM d, yyyy");
}

interface StoryListCardProps {
  story: StoryListItem;
  index: number;
}

/**
 * Renders one saved story as a linked summary card.
 * @param props The story metadata and animation index.
 * @returns A clickable card preview for the story library.
 */
function StoryListCard({ story, index }: StoryListCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      <Link href={`/story?storyId=${encodeURIComponent(story.id)}`} className="group block h-full">
        <Card className="flex h-full flex-col border-border/60 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-xl">
          <CardHeader className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-2">
                <CardTitle className="line-clamp-2 text-xl">{story.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {getPreview(story.content)}
                </CardDescription>
              </div>
              <Badge variant="outline">{levelLabels[story.level]}</Badge>
            </div>
          </CardHeader>

          <CardContent className="mt-auto flex flex-col gap-4">
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1">
                <CalendarDays />
                <span>{formatCreatedAt(story.createdAt)}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1">
                <CircleHelp />
                <span>{story.questionCount} questions</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1">
                <Trophy />
                <span>{story.earnedPoints ?? 0}/{story.totalPoints ?? story.questionCount * 10} pts</span>
              </div>
              {story.isCompleted ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                  <CheckCircle2 />
                  <span>Completed</span>
                </div>
              ) : null}
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              <span>Read story</span>
              <ArrowRight />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

/**
 * Renders the public saved stories library.
 * @param props The component props.
 * @returns The story list screen content.
 */
export function StoryList({
  canCreateStories,
  stories,
}: {
  canCreateStories: boolean;
  stories: StoryListItem[];
}) {
  if (stories.length === 0) {
    return (
      <Card className="border-none shadow-xl bg-white/60 backdrop-blur-sm dark:bg-zinc-900/50">
        <CardContent className="p-6">
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BookOpenText />
              </EmptyMedia>
              <EmptyTitle>No saved stories yet</EmptyTitle>
              <EmptyDescription>
                The shared library will appear here once an admin generates and saves the first story.
              </EmptyDescription>
            </EmptyHeader>
            {canCreateStories ? (
              <EmptyContent>
                <Link
                  href="/story"
                  className={cn(buttonVariants({ variant: "default" }))}
                >
                  <Sparkles data-icon="inline-start" />
                  Open Story Creator
                </Link>
              </EmptyContent>
            ) : null}
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="border-none ring-0 bg-transparent">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          {canCreateStories ? (
            <Link
              href="/story"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Sparkles data-icon="inline-start" />
              Create Story
            </Link>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stories.map((story, index) => (
              <StoryListCard key={story.id} story={story} index={index} />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
