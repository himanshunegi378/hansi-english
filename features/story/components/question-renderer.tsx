"use client";

import { AnimatePresence } from "framer-motion";
import { QuizHeader } from "./quiz/quiz-header";
import { QuizProgressDots } from "./quiz/quiz-progress-dots";
import { QuizQuestionPanel } from "./quiz/quiz-question-panel";
import { useStoryQuiz } from "../hooks/use-story-quiz";
import type { GeneratedQuestion, StoryProgress } from "../types";

interface QuestionRendererProps {
  canSaveProgress: boolean;
  initialProgress?: StoryProgress | null;
  questions: GeneratedQuestion[];
  storyId: string;
}

/**
 * Renders the interactive story quiz with saved progress support.
 * @param props The story id, generated questions, and optional user progress.
 * @returns The quiz interface for the story reader.
 */
export function QuestionRenderer({
  canSaveProgress,
  initialProgress,
  questions,
  storyId,
}: QuestionRendererProps) {
  const quiz = useStoryQuiz({
    canSaveProgress,
    initialProgress,
    questions,
    storyId,
  });

  const answeredIds = new Set(Object.keys(quiz.savedAnswerMap));
  const isLastQuestion = quiz.currentQuestionIndex === questions.length - 1;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 sm:gap-8">
      <QuizHeader
        answeredCount={quiz.answeredCount}
        completionPercent={quiz.completionPercent}
        currentQuestionIndex={quiz.currentQuestionIndex}
        progress={quiz.progress}
        totalQuestions={quiz.totalQuestions}
      />

      <AnimatePresence mode="wait">
        <QuizQuestionPanel
          canSaveProgress={quiz.canSaveProgress}
          draftAnswer={quiz.currentDraft}
          isPending={quiz.isPending}
          onNext={quiz.goToNextQuestion}
          onOptionChange={(option) =>
            quiz.setOptionAnswer(quiz.currentQuestion.id, option)
          }
          onSubmit={quiz.submitCurrentAnswer}
          onTextChange={(value) => quiz.setTextAnswer(quiz.currentQuestion.id, value)}
          question={quiz.currentQuestion}
          savedAnswer={quiz.currentSavedAnswer}
          showNextAction={Boolean(quiz.currentSavedAnswer) && !isLastQuestion}
        />
      </AnimatePresence>

      <QuizProgressDots
        answeredIds={answeredIds}
        currentQuestionId={quiz.currentQuestion.id}
        currentQuestionIndex={quiz.currentQuestionIndex}
        onSelect={quiz.goToQuestion}
        questionIds={questions.map((question) => question.id)}
      />
    </div>
  );
}
