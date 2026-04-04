"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type PersistedStory } from "../types";
import { StoryCard } from "../components/story-card";
import { StoryPageIntro } from "../components/story-page-intro";
import { QuestionRendererWithAnswers } from "../components/question-renderer-with-answers";

interface StoryPreviewProps {
  story: PersistedStory;
}

/**
 * Admin read-only view of a persisted story with its questions and answer keys.
 * @param props The saved story to preview.
 * @returns The admin story preview layout.
 */
export function StoryPreview({ story }: StoryPreviewProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6 pb-24 sm:p-8">
      <StoryPageIntro
        eyebrow="Admin Review"
        title="Check the saved reading package before sending learners in."
        description="This view keeps the story and the answer key together so you can review reading quality, question coverage, and the correctness of the saved quiz."
        actions={(
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to stories
          </Link>
        )}
        meta={(
          <>
            <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">
              <ShieldCheck data-icon="inline-start" />
              Answer key visible
            </Badge>
            <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">
              {story.questions.length} saved questions
            </Badge>
          </>
        )}
      />

      <StoryCard
        title={story.title}
        prompt={story.prompt}
        level={story.level}
        content={story.content}
      />

      {story.questions.length > 0 && (
        <QuestionRendererWithAnswers
          questions={story.questions.map((q) => ({
            id: q.id,
            text: q.text,
            type: q.type,
            options: q.options,
            correctAnswer: q.correctAnswer ?? undefined,
          }))}
        />
      )}
    </div>
  );
}
