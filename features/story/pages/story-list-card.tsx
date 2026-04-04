"use client";

import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type EnglishLevel, type StoryListItem } from "../types";

const levelLabels: Record<EnglishLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

interface StoryListCardProps {
  story: StoryListItem;
  index: number;
}

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

/**
 * Renders one saved story as a linked summary card.
 * @param props The story metadata and animation index.
 * @returns A clickable card preview for the story library.
 */
export function StoryListCard({ story, index }: StoryListCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut", delay: index * 0.06 }}
    >
      <Link href={`/story?storyId=${encodeURIComponent(story.id)}`} className="group block h-full">
        <Card className="flex ring-0 border border-border h-full flex-col overflow-hidden rounded-[2rem] bg-card/90 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/10">
          <CardHeader className="flex flex-col gap-3 p-5 sm:gap-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle className="line-clamp-2 text-lg leading-snug sm:text-2xl">
                  {story.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 text-sm/6 sm:text-sm/7">
                  {getPreview(story.content)}
                </CardDescription>
              </div>
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1.5">
                {levelLabels[story.level]}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="mt-auto flex flex-col gap-3 px-5 pb-5 sm:gap-4 sm:px-6 sm:pb-6">
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground sm:text-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5">
                <CalendarDays />
                <span>{formatCreatedAt(story.createdAt)}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5">
                <CircleHelp />
                <span>{story.questionCount} questions</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5">
                <Trophy />
                <span>
                  {story.earnedPoints ?? 0}/{story.totalPoints ?? story.questionCount * 10} pts
                </span>
              </div>
              {story.isCompleted ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-primary">
                  <CheckCircle2 />
                  <span>Completed</span>
                </div>
              ) : null}
            </div>

            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-foreground sm:text-sm sm:tracking-[0.22em]">
              <span>Open reading</span>
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
