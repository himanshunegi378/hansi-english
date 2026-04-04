"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { type PersistedStory } from "../types";
import { StoryCard } from "../components/story-card";
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
    <div className="mx-auto flex max-w-4xl flex-col gap-8 p-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <Link
          href="/stories"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          Back to Stories
        </Link>

        <div className="text-center flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Story Preview
          </h1>
          <p className="text-muted-foreground text-lg">
            Viewing a saved story as an admin.
          </p>
        </div>
      </motion.div>

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
