"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    <Card className="overflow-hidden rounded-[2rem] border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="flex flex-col gap-4 p-5 sm:gap-5 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex max-w-3xl flex-col gap-3">
            <Badge variant="outline" className="w-fit rounded-full bg-secondary/70 px-3 py-1">
              Reading text
            </Badge>
            <CardTitle className="font-heading text-2xl tracking-tight text-foreground sm:text-4xl">
              {title}
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {prompt}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 font-medium">
            {levelLabels[level]}
          </Badge>
        </div>

        <Separator className="bg-border/70" />
      </CardHeader>

      <CardContent className="px-5 pb-5 sm:px-8 sm:pb-8">
        <TextMeaning>
          <div className="max-w-none whitespace-pre-wrap border-none font-heading text-[1.02rem] leading-8 text-foreground/90 sm:text-[1.2rem] sm:leading-9">
            {content}
          </div>
        </TextMeaning>
      </CardContent>

      {footer ? (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/70 bg-secondary/35 px-5 py-4 sm:px-8 sm:py-5">
          {footer}
        </div>
      ) : null}
    </Card>
  );
}
