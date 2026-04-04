"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EnglishLevel } from "../types";
import { TextMeaning } from "@/features/text-meaning";

const levelLabels: Record<EnglishLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
} as const;

interface StoryCardProps {
  title: string;
  prompt: string;
  level: EnglishLevel;
  content: string;
  /** Slot for action buttons rendered in the card footer. */
  footer?: ReactNode;
}

/**
 * Displays a story's title, prompt badge, level, and body text.
 * Accepts an optional footer slot for contextual action buttons.
 * @param props The story fields and optional footer content.
 * @returns A styled story card.
 */
export function StoryCard({ title, prompt, level, content, footer }: StoryCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-2xl bg-white dark:bg-zinc-950">
      <div className="h-2 bg-linear-to-r from-blue-500 to-indigo-600" />
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-4xl font-serif tracking-tight">{title}</CardTitle>
            <CardDescription className="italic">{prompt}</CardDescription>
          </div>
          <Badge variant="secondary" className="px-3 py-1 font-bold">
            {levelLabels[level]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <TextMeaning>
          <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-serif text-xl border-t pt-8">
            {content}
          </div>
        </TextMeaning>
      </CardContent>
      {footer ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t p-6 pt-4">
          {footer}
        </div>
      ) : null}
    </Card>
  );
}
