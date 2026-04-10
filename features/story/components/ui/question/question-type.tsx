"use client";

import { motion } from "framer-motion";
import type { QuestionType as QType } from "../../../types";

interface QuestionTypeProps {
  type: QType;
}

/**
 * Renders the question type badge.
 * @returns The formatted question type indicator.
 */
export function QuestionType({ type }: QuestionTypeProps) {
  return (
    <motion.span 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-background border shadow-xs text-muted-foreground"
    >
      {type.replace("_", " ")}
    </motion.span>
  );
}
