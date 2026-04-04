"use client";

import { motion } from "framer-motion";
import { type PersistedStory } from "../types";
import { StoryCard } from "../components/story-card";
import { QuestionRenderer } from "../components/question-renderer";

/**
 * Renders a saved story in read-only mode with its generated questions.
 * @param props The persisted story to display.
 * @returns The interactive story viewer.
 */
export function StoryReader({ story }: { story: PersistedStory }) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center flex flex-col gap-2"
      >
        <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Story Reader
        </h1>
        <p className="text-lg text-muted-foreground">
          Immerse yourself in the story and test your understanding.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-12 pb-24"
      >
        <StoryCard
          title={story.title}
          prompt={story.prompt}
          level={story.level}
          content={story.content}
        />

        <QuestionRenderer
          questions={story.questions.map((question) => ({
            id: question.id,
            text: question.text,
            type: question.type,
            options: question.options,
            correctAnswer: question.correctAnswer ?? undefined,
          }))}
        />
      </motion.div>
    </div>
  );
}
