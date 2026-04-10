import { cn } from "@/lib/utils";

interface QuizQuestionPaletteProps {
  answeredIds: Set<string>;
  currentQuestionId: string;
  markedIds: Set<string>;
  onSelect: (id: string) => void;
  questionIds: string[];
}

/**
 * Renders the learner-facing question navigator.
 * @param props Answered, review, and active question state.
 * @returns Question palette.
 */
export function QuizQuestionPalette({
  answeredIds,
  currentQuestionId,
  markedIds,
  onSelect,
  questionIds,
}: QuizQuestionPaletteProps) {
  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-background/80 p-4 shadow-sm backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Question palette</p>
      <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-7 lg:grid-cols-5 xl:grid-cols-6">
        {questionIds.map((questionId, index) => (
          <button
            key={questionId}
            type="button"
            onClick={() => onSelect(questionId)}
            className={cn(
              "flex aspect-square items-center justify-center rounded-2xl border text-sm font-medium transition-colors",
              currentQuestionId === questionId ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-card/80 text-foreground hover:bg-background",
              answeredIds.has(questionId) && currentQuestionId !== questionId && "border-primary/30 bg-primary/10",
              markedIds.has(questionId) && currentQuestionId !== questionId && "ring-2 ring-accent/60",
            )}
            aria-label={`Go to question ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
