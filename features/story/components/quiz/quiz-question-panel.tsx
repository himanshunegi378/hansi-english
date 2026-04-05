"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, LoaderCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { GeneratedQuestion, StoryAnswerValue, StoryQuestionAnswer } from "../../types";
import {
  QuestionOpenEnded,
  QuestionOption,
  QuestionTitle,
  QuestionType,
} from "../ui/question";

interface QuizQuestionPanelProps {
  /** Whether the viewer can persist their progress to a profile. */
  canSaveProgress: boolean;
  /** The local response being typed or selected before submission. */
  draftAnswer?: StoryAnswerValue;
  /** Whether an answer is currently being submitted or graded by AI. */
  isPending: boolean;
  /** Callback to advance to the next question in the sequence. */
  onNext: () => void;
  /** Updates the draft response for a specific question ID. */
  onChange: (id: string, value: string | boolean) => void;
  /** Validates and commits the current draft response. */
  onSubmit: () => void;
  /** The content and options for the active quiz item. */
  question: GeneratedQuestion;
  /** The results of a previous submission, including grading and feedback. */
  savedAnswer?: StoryQuestionAnswer;
  /** Whether to display the navigation control to the next item. */
  showNextAction: boolean;
}

/**
 * Renders the active quiz question, answer controls, and grading feedback.
 * @param props The active question state and handlers.
 * @returns The active question card.
 */
export function QuizQuestionPanel({
  canSaveProgress,
  draftAnswer,
  isPending,
  onNext,
  onChange,
  onSubmit,
  question,
  savedAnswer,
  showNextAction,
}: QuizQuestionPanelProps) {
  const isObjective = (question.options?.length ?? 0) > 0;
  const selectedOption =
    draftAnswer?.valueType === "OPTION" ? draftAnswer.selectedOption ?? null : null;
  const textValue = draftAnswer?.valueType === "TEXT" ? draftAnswer.textAnswer ?? "" : "";

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="rounded-[2rem] border-border/70 bg-card/95 shadow-sm">
        <CardHeader className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <QuestionType type={question.type} />
            {savedAnswer ? (
              <span className={savedAnswer.isCorrect ? "text-primary" : "text-muted-foreground"}>
                <CheckCircle2 />
              </span>
            ) : null}
          </div>
          <QuestionTitle text={question.text} />
        </CardHeader>

        <CardContent className="flex flex-col gap-5 px-5 pb-5 sm:gap-6 sm:px-6 sm:pb-6">
          {isObjective ? (
            <div className="grid gap-3">
              {question.options?.map((option, index) => (
                <QuestionOption
                  key={option}
                  index={index}
                  option={option}
                  isSelected={selectedOption === option}
                  isCorrect={savedAnswer?.isCorrect ? option === question.correctAnswer : false}
                  isIncorrect={
                    savedAnswer?.isCorrect === false && savedAnswer.selectedOption === option
                  }
                  onClick={() => onChange(question.id, option)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor={`answer-${question.id}`}>Your answer</FieldLabel>
                <Textarea
                  id={`answer-${question.id}`}
                  placeholder="Write your answer in simple English."
                  value={textValue}
                  onChange={(event) => onChange(question.id, event.target.value)}
                  rows={5}
                />
                <FieldDescription>
                  {canSaveProgress
                    ? "Your response will be checked with AI and saved to this story."
                    : "Sign in to save your response and get AI grading."}
                </FieldDescription>
              </Field>

              <QuestionOpenEnded correctAnswer={savedAnswer ? question.correctAnswer : undefined} />
            </div>
          )}

          {savedAnswer ? (
            <FeedbackPanel
              canSaveProgress={canSaveProgress}
              question={question}
              savedAnswer={savedAnswer}
            />
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button type="button" onClick={onSubmit} disabled={isPending} className="rounded-full">
              {isPending ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : null}
              {question.options?.length ? "Check Answer" : "Check with AI"}
            </Button>

            {!canSaveProgress ? (
              <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <LogIn />
                Sign in to keep this progress.
              </p>
            ) : null}

            {savedAnswer && showNextAction ? (
              <Button type="button" variant="outline" onClick={onNext} className="rounded-full">
                Next Question
                <ChevronRight data-icon="inline-end" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface FeedbackPanelProps {
  canSaveProgress: boolean;
  question: GeneratedQuestion;
  savedAnswer: StoryQuestionAnswer;
}

/**
 * Displays the grading result and saved answer details for the active question.
 * @param props The graded answer payload.
 * @returns A result summary block.
 */
function FeedbackPanel({ canSaveProgress, question, savedAnswer }: FeedbackPanelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border/70 bg-secondary/45 p-4 sm:p-5">
      <p className="text-sm font-medium text-foreground">
        {savedAnswer.isCorrect ? "Correct answer" : "Needs another try"}
      </p>
      <p className="text-sm text-muted-foreground">
        {savedAnswer.feedback ??
          (savedAnswer.isCorrect
            ? "Nice work."
            : "Review the story and update your answer whenever you want.")}
      </p>
      <p className="text-sm text-muted-foreground">
        Points earned: <span className="font-medium text-foreground">{savedAnswer.pointsEarned}</span>
      </p>
      {!question.options?.length && question.correctAnswer ? (
        <p className="text-sm text-muted-foreground">
          Answer guide: <span className="font-medium text-foreground">{question.correctAnswer}</span>
        </p>
      ) : null}
      {!canSaveProgress ? (
        <p className="text-sm text-muted-foreground">
          This result is local-only until you sign in.
        </p>
      ) : null}
    </div>
  );
}
