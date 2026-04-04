"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { type GenerateStoryInput } from "../schemas";
import {
  useGenerateQuestions,
  useGenerateStory,
  useSaveStory,
} from "../hooks/use-story-actions";
import { StoryPreview } from "./story-preview";
import { QuestionRendererWithAnswers } from "../components/question-renderer-with-answers";
import { StoryCard } from "../components/story-card";
import { StoryPageIntro } from "../components/story-page-intro";
import { StoryCreatorForm } from "./story-creator-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { type EnglishLevel, type GeneratedQuestion, type GeneratedStoryDraft, type PersistedStory } from "../types";
import { BookOpenText, CheckCircle2, CircleHelp, Save } from "lucide-react";

const levelLabels: Record<EnglishLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

interface StoryCreatorProps {
  /** When provided, skips the generation form and shows a read-only preview of the story. */
  readOnlyStory?: PersistedStory;
}

/**
 * Renders the admin story creation flow with local generation and explicit save.
 * When readOnlyStory is provided, shows a read-only preview of that saved story.
 * @param props Optional persisted story for read-only admin preview.
 * @returns The interactive story creator screen.
 */
export function StoryCreator({ readOnlyStory }: StoryCreatorProps = {}) {
  const [level, setLevel] = useState<EnglishLevel>("BEGINNER");
  const [story, setStory] = useState<GeneratedStoryDraft | null>(null);
  const [questions, setQuestions] = useState<GeneratedQuestion[] | null>(null);
  const [savedStoryId, setSavedStoryId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateStoryInput>({
    defaultValues: {
      prompt: "",
      level: "BEGINNER",
    },
  });

  const { generateStory, isGeneratingStory } = useGenerateStory({
    level,
    setQuestions,
    setSavedStoryId,
    setStory,
  });
  const { generateQuestions, isGeneratingQuestions } = useGenerateQuestions({
    story,
    setQuestions,
  });
  const { isSavingStory, saveStory } = useSaveStory({
    questions,
    savedStoryId,
    setSavedStoryId,
    story,
  });

  if (readOnlyStory) {
    return <StoryPreview story={readOnlyStory} />;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pb-20 pt-2 sm:gap-8 sm:p-8 sm:pb-24">
      <StoryPageIntro
        eyebrow="Admin Workspace"
        title="Build stories the way learners will actually read them."
        description="Create the brief, choose the right difficulty band, review the generated story, then validate the comprehension questions before saving anything to the shared library."
        meta={
          <>
            <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">
              <BookOpenText data-icon="inline-start" />
              Story-first workflow
            </Badge>
            <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">
              <CircleHelp data-icon="inline-start" />
              Question review before save
            </Badge>
            <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">
              {levelLabels[level]}
            </Badge>
          </>
        }
      />

      <div className="grid gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1.25fr)_22rem]">
        <StoryCreatorForm
          isGeneratingStory={isGeneratingStory}
          level={level}
          onLevelChange={setLevel}
          onSubmit={handleSubmit(generateStory)}
          promptError={errors.prompt}
          register={register}
        />

        <Card className="rounded-[2rem] border-border/70 bg-card/80 shadow-sm">
          <CardContent className="flex h-full flex-col gap-4 p-5 sm:gap-5 sm:p-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Workflow
              </p>
              <h2 className="font-heading text-2xl text-foreground">Review before publishing</h2>
            </div>
            <Separator className="bg-border/70" />
            <div className="grid gap-4 text-sm leading-7 text-muted-foreground">
              <p>
                1. Generate a draft from a focused prompt.
              </p>
              <p>
                2. Read the story as a learner would, with vocabulary support in context.
              </p>
              <p>
                3. Generate questions and check the answer key for clarity and coverage.
              </p>
              <p>
                4. Save only when the reading and quiz feel coherent together.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence mode="wait">
        {story ? (
          <motion.div
            key="story-result"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <StoryCard
              title={story.title}
              prompt={story.prompt}
              level={story.level}
              content={story.content}
              footer={
                <>
                  <div className="flex max-w-xl flex-col gap-2">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                      Next step
                    </p>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {savedStoryId
                        ? "This story is already stored in the shared library."
                        : "Generate the quiz, review the answer set, then save the full reading package."}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {!questions ? (
                      <Button onClick={generateQuestions} disabled={isGeneratingQuestions} variant="outline">
                        {isGeneratingQuestions ? <Spinner data-icon="inline-start" /> : null}
                        {isGeneratingQuestions ? "Creating quiz..." : "Generate questions"}
                      </Button>
                    ) : (
                      <Button onClick={saveStory} disabled={isSavingStory || Boolean(savedStoryId)}>
                        {isSavingStory ? (
                          <Spinner data-icon="inline-start" />
                        ) : savedStoryId ? (
                          <CheckCircle2 data-icon="inline-start" />
                        ) : (
                          <Save data-icon="inline-start" />
                        )}
                        {isSavingStory ? "Saving..." : savedStoryId ? "Saved to library" : "Save story"}
                      </Button>
                    )}
                  </div>
                </>
              }
            />

            {questions ? (
              <QuestionRendererWithAnswers questions={questions} />
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
