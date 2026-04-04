import { Info } from "lucide-react";
import { motion } from "framer-motion";

interface QuestionOpenEndedProps {
  correctAnswer?: string;
}

/**
 * Renders the preview for an open-ended question.
 * @returns An informational block about the open-ended question and its answer guide.
 */
export function QuestionOpenEnded({ correctAnswer }: QuestionOpenEndedProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          This is an open-ended question. The AI will evaluate user responses based on the context and intent.
        </p>
      </div>

      {correctAnswer && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600/80 mb-2">
            AI Answer Guide
          </p>
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
            {correctAnswer}
          </p>
        </motion.div>
      )}
    </div>
  );
}
