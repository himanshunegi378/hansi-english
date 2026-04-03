"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generateStorySchema,
  type GenerateStoryInput,
  type StoryOnlyResponse,
} from "../schemas";
import { generateStoryContentAction, generateStoryQuestionsAction } from "../actions/generate-story";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { type EnglishLevel, type Question } from "../types";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const levelLabels: Record<EnglishLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const levelDescription: Record<EnglishLevel, string> = {
  BEGINNER: "Simple vocabulary, short sentences, for those starting out.",
  INTERMEDIATE: "Natural English, moderate variety, for everyday learners.",
  ADVANCED: "Fluent, rich vocabulary, nuanced emotions for proficient speakers.",
};

export function StoryCreator() {
  const [level, setLevel] = useState<EnglishLevel>("BEGINNER");
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [story, setStory] = useState<StoryOnlyResponse | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateStoryInput>({
    resolver: zodResolver(generateStorySchema),
    defaultValues: {
      level: "BEGINNER",
    },
  });

  async function onGenerateStory(data: GenerateStoryInput) {
    setIsGeneratingStory(true);
    setStory(null);
    setQuestions(null);
    setUserAnswers({});
    setShowResults(false);
    try {
      const result = await generateStoryContentAction({ ...data, level });
      setStory(result);
      toast.success("Story generated successfully!");
    } catch (error) {
      toast.error("Failed to generate story. Please try again.");
      console.error(error);
    } finally {
      setIsGeneratingStory(false);
    }
  }

  async function onGenerateQuestions() {
    if (!story) return;
    setIsGeneratingQuestions(true);
    try {
      const result = await generateStoryQuestionsAction(story.content, level);
      setQuestions(result.questions.map(q => ({
        ...q,
        id: crypto.randomUUID()
      })));
      toast.success("Questions generated successfully!");
    } catch (error) {
      toast.error("Failed to generate questions. Please try again.");
      console.error(error);
    } finally {
      setIsGeneratingQuestions(false);
    }
  }

  const handleLevelChange = (val: number | readonly number[]) => {
    const selected = Array.isArray(val) ? val[0] : val;
    const levels: EnglishLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
    setLevel(levels[selected]);
  };

  const handleOptionSelect = (questionId: string, option: string) => {
    if (showResults) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          AI Story Creator
        </h1>
        <p className="text-muted-foreground text-lg">
          Generate custom stories tailored to your English proficiency.
        </p>
      </motion.div>

      <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
        <CardHeader>
          <CardTitle>Configure your story</CardTitle>
          <CardDescription>
            Choose a topic and set your proficiency level.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onGenerateStory)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">What should the story be about?</Label>
              <Textarea
                id="prompt"
                placeholder="e.g. A mysterious lighthouse, a talking cat, or a trip to Mars..."
                className="min-h-25 resize-none"
                {...register("prompt")}
              />
              {errors.prompt && (
                <p className="text-sm text-red-500">{errors.prompt.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>English Proficiency Level</Label>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {levelLabels[level]}
                </span>
              </div>
              <Slider
                defaultValue={[0]}
                max={2}
                step={1}
                onValueChange={handleLevelChange}
                className="py-4"
              />
              <p className="text-sm text-muted-foreground italic">
                {levelDescription[level]}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity"
              disabled={isGeneratingStory}
            >
              {isGeneratingStory ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" /> Generating...
                </>
              ) : (
                "Generate Story"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {story && (
          <motion.div
            key="story-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 pb-20"
          >
            <Card className="overflow-hidden border-none shadow-2xl">
              <div className="h-2 bg-linear-to-r from-blue-500 to-indigo-600" />
              <CardHeader>
                <CardTitle className="text-3xl font-serif">{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-serif">
                  {story.content}
                </div>
              </CardContent>
              <div className="p-6 pt-0 border-t flex justify-end">
                {!questions && (
                  <Button
                    onClick={onGenerateQuestions}
                    disabled={isGeneratingQuestions}
                    variant="outline"
                    className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  >
                    {isGeneratingQuestions ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" /> Creating Quiz...
                      </>
                    ) : (
                      "Generate Questions"
                    )}
                  </Button>
                )}
              </div>
            </Card>

            {questions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-end px-2">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Comprehension Check
                  </h2>
                  {!showResults && (
                    <Button 
                      onClick={() => setShowResults(true)}
                      disabled={Object.keys(userAnswers).length === 0}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Check Answers
                    </Button>
                  )}
                  {showResults && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowResults(false);
                        setUserAnswers({});
                      }}
                    >
                      Reset Quiz
                    </Button>
                  )}
                </div>

                <div className="grid gap-6">
                  {questions.map((q, idx) => {
                    const selected = userAnswers[q.id];
                    const isCorrect = selected === q.correctAnswer;
                    
                    return (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800">
                          <CardHeader className="pb-3 bg-zinc-50/50 dark:bg-zinc-900/50">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border shadow-xs text-zinc-500">
                                {q.type.replace("_", " ")}
                              </span>
                              {showResults && q.correctAnswer && (
                                <span className={cn(
                                  "flex items-center gap-1 text-sm font-medium",
                                  isCorrect ? "text-green-600" : "text-red-600"
                                )}>
                                  {isCorrect ? (
                                    <><CheckCircle2 className="w-4 h-4" /> Correct</>
                                  ) : (
                                    <><XCircle className="w-4 h-4" /> Incorrect</>
                                  )}
                                </span>
                              )}
                            </div>
                            <p className="text-lg font-medium leading-snug">{q.text}</p>
                          </CardHeader>
                          <CardContent className="pt-4">
                            {q.options ? (
                              <div className="grid gap-2">
                                {q.options.map((option, optIdx) => {
                                  const isSelected = selected === option;
                                  const isOptionCorrect = showResults && option === q.correctAnswer;
                                  const isOptionWrong = showResults && isSelected && !isCorrect;

                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => handleOptionSelect(q.id, option)}
                                      disabled={showResults}
                                      className={cn(
                                        "w-full text-left p-3 rounded-lg border transition-all duration-200 group flex items-center justify-between",
                                        !showResults && "hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10",
                                        !showResults && isSelected && "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500",
                                        showResults && isOptionCorrect && "border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500",
                                        showResults && isOptionWrong && "border-red-500 bg-red-50 dark:bg-red-900/20 ring-1 ring-red-500 opacity-80",
                                        showResults && !isOptionCorrect && !isSelected && "opacity-50 grayscale-[0.5]"
                                      )}
                                    >
                                      <span className="flex-1">{option}</span>
                                      {showResults && isOptionCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 ml-2" />}
                                      {showResults && isOptionWrong && <XCircle className="w-5 h-5 text-red-600 shrink-0 ml-2" />}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Info className="w-4 h-4" /> This is an open-ended question.
                                </p>
                                {showResults && q.correctAnswer && (
                                  <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Answer Guide</p>
                                    <p className="text-sm">{q.correctAnswer}</p>
                                  </div>
                                )}
                              </div>
                            )
                            }
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
