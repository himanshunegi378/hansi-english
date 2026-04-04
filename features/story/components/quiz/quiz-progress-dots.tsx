"use client";

import { cn } from "@/lib/utils";

interface QuizProgressDotsProps {
  answeredIds: Set<string>;
  currentQuestionId: string;
  currentQuestionIndex: number;
  onSelect: (index: number) => void;
  questionIds: string[];
}

/**
 * Renders clickable progress indicators for each quiz question.
 * @param props The current selection and answered-question state.
 * @returns The quiz navigation dots row.
 */
export function QuizProgressDots({
  answeredIds,
  currentQuestionId,
  currentQuestionIndex,
  onSelect,
  questionIds,
}: QuizProgressDotsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {questionIds.map((questionId, index) => (
        <button
          key={questionId}
          type="button"
          onClick={() => onSelect(index)}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            index === currentQuestionIndex || questionId === currentQuestionId
              ? "w-8 bg-primary"
              : "w-2 bg-muted",
            answeredIds.has(questionId) && index !== currentQuestionIndex && "bg-primary/40",
          )}
          aria-label={`Go to question ${index + 1}`}
        />
      ))}
    </div>
  );
}
