"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type GeneratedQuestion } from "../types";
import { 
  QuestionType, 
  QuestionTitle, 
  QuestionOption 
} from "./ui/question";

interface QuestionRendererProps {
  questions: GeneratedQuestion[];
}

/**
 * Interactive quiz renderer for students.
 * Manages selection, validation, and feedback states with premium animations.
 * @returns The interactive quiz interface.
 */
export function QuestionRenderer({ questions }: QuestionRendererProps) {
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleSelect = (questionId: string, option: string) => {
    if (revealed[questionId]) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleCheck = (questionId: string) => {
    setRevealed((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setRevealed({});
    setCurrentQuestionIndex(0);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOption = answers[currentQuestion.id];
  const isRevealed = revealed[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allAnswered = questions.every(q => revealed[q.id]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center px-2">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold bg-linear-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
            Comprehension Check
          </h3>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        {allAnswered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleReset}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <RotateCcw className="w-4 h-4" /> Reset Quiz
          </motion.button>
        )}
      </div>

      <div className="relative min-h-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <QuestionType type={currentQuestion.type} />
                  {isRevealed && (
                    <motion.span
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={selectedOption === currentQuestion.correctAnswer ? "text-green-600" : "text-red-600"}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </motion.span>
                  )}
                </div>
                <QuestionTitle text={currentQuestion.text} />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid gap-3">
                  {currentQuestion.options?.map((option, optIdx) => (
                    <QuestionOption
                      key={optIdx}
                      index={optIdx}
                      option={option}
                      isSelected={selectedOption === option}
                      isCorrect={isRevealed && option === currentQuestion.correctAnswer}
                      isIncorrect={isRevealed && selectedOption === option && option !== currentQuestion.correctAnswer}
                      disabled={isRevealed}
                      onClick={() => handleSelect(currentQuestion.id, option)}
                    />
                  ))}
                  
                  {!currentQuestion.options && (
                    <div className="flex flex-col gap-4">
                       <p className="text-sm text-zinc-500 italic">
                         Think about your answer, then check the guide below.
                       </p>
                    </div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {selectedOption && !isRevealed && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="mt-8"
                    >
                      <button
                        onClick={() => handleCheck(currentQuestion.id)}
                        className="w-full py-4 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:opacity-90 active:scale-[0.98] transition-all"
                      >
                        Check Answer
                      </button>
                    </motion.div>
                  )}

                  {isRevealed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-8 flex flex-col gap-4"
                    >
                      {!currentQuestion.options && (
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                            Answer Guide
                          </p>
                          <p className="text-sm font-medium">{currentQuestion.correctAnswer}</p>
                        </div>
                      )}
                      
                      {!isLastQuestion ? (
                        <button
                          onClick={handleNext}
                          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-bold hover:opacity-90 transition-opacity"
                        >
                          Next Question <ChevronRight className="w-5 h-5" />
                        </button>
                      ) : (
                        <div className="text-center py-4 text-green-600 font-bold flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> Quiz Completed!
                        </div>
                      )}
                    </motion.div>
                  )}
                  
                  {!currentQuestion.options && !isRevealed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-8"
                    >
                      <button
                        onClick={() => handleCheck(currentQuestion.id)}
                        className="w-full py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                      >
                        Show Answer Guide
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-1.5 justify-center">
        {questions.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i === currentQuestionIndex ? "w-8 bg-primary" : "w-2 bg-zinc-200 dark:bg-zinc-800",
              revealed[questions[i].id] && i !== currentQuestionIndex && "bg-green-500/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
