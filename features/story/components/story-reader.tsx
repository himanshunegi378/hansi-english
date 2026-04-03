"use client";

import { motion } from "framer-motion";
import { type PersistedStory } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionRendererWithAnswers } from "./question-renderer-with-answers";

const levelLabels = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
} as const;

/**
 * Renders a saved story in read-only mode with its generated questions.
 * @param props The persisted story to display.
 * @returns The read-mode story view.
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
          Read the saved story and review its generated questions.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6 pb-20"
      >
        <Card className="overflow-hidden border-none shadow-2xl">
          <div className="h-2 bg-linear-to-r from-blue-500 to-indigo-600" />
          <CardHeader className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-3xl font-serif">{story.title}</CardTitle>
                <CardDescription>
                  Prompt: {story.prompt}
                </CardDescription>
              </div>
              <Badge variant="outline">{levelLabels[story.level]}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-serif">
              {story.content}
            </div>
          </CardContent>
        </Card>

        <QuestionRendererWithAnswers
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
