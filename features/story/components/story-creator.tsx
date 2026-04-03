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
import { QuestionRendererWithAnswers } from "./question-renderer-with-answers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { type EnglishLevel, type GeneratedQuestion, type GeneratedStoryDraft } from "../types";
import { CheckCircle2, Save } from "lucide-react";

const levelLabels: Record<EnglishLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const levelDescription: Record<EnglishLevel, string> = {
  BEGINNER: "Simple vocabulary, short sentences, for those starting out.",
  INTERMEDIATE: "Natural English, moderate variety, for everyday learners.",
  ADVANCED: "Fluent, rich vocabulary, nuanced emotions for proficient speakers.",
};

/**
 * Renders the admin story creation flow with local generation and explicit save.
 * @returns The interactive story creator screen.
 */
export function StoryCreator() {
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

  /**
   * Maps the slider value to the matching proficiency level.
   * @param val The raw slider value.
   */
  const handleLevelChange = (val: number | readonly number[]) => {
    const selected = Array.isArray(val) ? val[0] : val;
    const levels: EnglishLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
    setLevel(levels[selected]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center flex flex-col gap-2"
      >
        <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          AI Story Creator
        </h1>
        <p className="text-muted-foreground text-lg">
          Generate custom stories tailored to your English proficiency.
        </p>
      </motion.div>

      <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
        <CardHeader>
          <CardTitle>Configure your story</CardTitle>
          <CardDescription>
            Choose a topic and set your proficiency level.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(generateStory)} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="prompt">What should the story be about?</Label>
              <Textarea
                id="prompt"
                placeholder="e.g. A mysterious lighthouse, a talking cat, or a trip to Mars..."
                className="min-h-25 resize-none"
                {...register("prompt", {
                  minLength: {
                    value: 5,
                    message: "Prompt must be at least 5 characters long",
                  },
                  maxLength: {
                    value: 500,
                    message: "Prompt must be less than 500 characters",
                  },
                  required: "Prompt is required",
                })}
              />
              {errors.prompt ? (
                <p className="text-sm text-destructive">{errors.prompt.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <Label>English Proficiency Level</Label>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {levelLabels[level]}
                </span>
              </div>
              <Slider
                defaultValue={[0]}
                max={2}
                step={1}
                onValueChange={handleLevelChange}
                className="py-4"
              />
              <p className="text-sm text-muted-foreground italic">
                {levelDescription[level]}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity"
              disabled={isGeneratingStory}
            >
              {isGeneratingStory ? (
                <Spinner data-icon="inline-start" />
              ) : null}
              {isGeneratingStory ? "Generating..." : "Generate Story"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {story ? (
          <motion.div
            key="story-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6 pb-20"
          >
            <Card className="overflow-hidden border-none shadow-2xl">
              <div className="h-2 bg-linear-to-r from-blue-500 to-indigo-600" />
              <CardHeader>
                <CardTitle className="text-3xl font-serif">{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-serif">
                  {story.content}
                </div>
              </CardContent>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t p-6 pt-4">
                <p className="text-sm text-muted-foreground">
                  {savedStoryId ? "This story is already saved in the shared library." : "Generate questions, review the quiz, then save the full story package."}
                </p>
                {!questions ? (
                  <Button
                    onClick={generateQuestions}
                    disabled={isGeneratingQuestions}
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary/5"
                  >
                    {isGeneratingQuestions ? (
                      <Spinner data-icon="inline-start" />
                    ) : null}
                    {isGeneratingQuestions ? "Creating Quiz..." : "Generate Questions"}
                  </Button>
                ) : (
                  <Button
                    onClick={saveStory}
                    disabled={isSavingStory || Boolean(savedStoryId)}
                    className="bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity"
                  >
                    {isSavingStory ? (
                      <Spinner data-icon="inline-start" />
                    ) : savedStoryId ? (
                      <CheckCircle2 data-icon="inline-start" />
                    ) : (
                      <Save data-icon="inline-start" />
                    )}
                    {isSavingStory ? "Saving..." : savedStoryId ? "Saved to Library" : "Save Story"}
                  </Button>
                )}
              </div>
            </Card>

            {questions ? (
              <QuestionRendererWithAnswers questions={questions} />
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
