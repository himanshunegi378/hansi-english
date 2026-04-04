import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionOptionProps {
  option: string;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  index?: number;
}

/**
 * Renders an individual answer option with its current state.
 * @returns The styled question option.
 */
export function QuestionOption({ 
  option, 
  isCorrect, 
  isIncorrect, 
  isSelected,
  onClick,
  disabled,
  index = 0
}: QuestionOptionProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={!disabled ? { scale: 1.01, x: 4 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all duration-200 group flex items-center justify-between outline-hidden",
        "cursor-pointer disabled:cursor-default",
        // Correct state
        isCorrect && "border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500 shadow-sm shadow-green-500/20",
        // Incorrect state
        isIncorrect && "border-red-500 bg-red-50 dark:bg-red-900/20 ring-1 ring-red-500 shadow-sm shadow-red-500/20",
        // Selected state (if not revealing correct/incorrect)
        isSelected && !isCorrect && !isIncorrect && "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 ring-1 ring-blue-500",
        // Default / Unselected / Inert state
        !isCorrect && !isIncorrect && !isSelected && "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white/50 dark:bg-zinc-900/50",
        // Opacity when revealing others
        disabled && !isCorrect && !isIncorrect && !isSelected && "opacity-50"
      )}
    >
      <span className="flex-1 font-medium">{option}</span>
      <AnimatePresence mode="popLayout">
        {isCorrect && (
          <motion.div
            key="correct"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
          >
            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 ml-2" />
          </motion.div>
        )}
        {isIncorrect && (
          <motion.div
            key="incorrect"
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
          >
            <XCircle className="w-6 h-6 text-red-600 shrink-0 ml-2" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
