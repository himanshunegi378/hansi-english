"use client";

import { motion } from "framer-motion";

interface QuestionTitleProps {
  text: string;
}

/**
 * Renders the main question text prominently.
 * @returns The styled question title.
 */
export function QuestionTitle({ text }: QuestionTitleProps) {
  return (
    <motion.p 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xl font-medium leading-tight text-zinc-900 dark:text-zinc-100"
    >
      {text}
    </motion.p>
  );
}
