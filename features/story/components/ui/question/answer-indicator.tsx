import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Renders a small indicator that an answer is included for a question.
 * @returns The answer inclusion indicator.
 */
export function AnswerIndicator() {
  return (
    <span className={cn("flex items-center gap-1 text-sm font-medium text-green-600")}>
      <CheckCircle2 data-icon="inline-start" /> Answer Included
    </span>
  );
}
