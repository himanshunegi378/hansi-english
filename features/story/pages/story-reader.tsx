"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleHelp, Trophy } from "lucide-react";
import { type PersistedStory } from "../types";
import { StoryCard } from "../components/story-card";
import { StoryPageIntro } from "../components/story-page-intro";
import { QuestionRenderer } from "../components/question-renderer";

/**
 * Renders a saved story in read-only mode with its generated questions.
 * @param props The persisted story to display.
 * @returns The interactive story viewer.
 */
export function StoryReader({
  canSaveProgress,
  story,
}: {
  canSaveProgress: boolean;
  story: PersistedStory;
}) {
  const totalPoints = story.viewerProgress?.totalPoints ?? story.questions.length * 10;
  const earnedPoints = story.viewerProgress?.earnedPoints ?? 0;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6 pb-24 sm:p-8">
      <StoryPageIntro
        eyebrow="Reading Workspace"
        title="Read first, then check understanding."
        description="The story stays central, while the comprehension tools sit alongside your progress so the learning flow feels supportive instead of crowded."
        meta={
          <>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              <Trophy data-icon="inline-start" />
              {earnedPoints}/{totalPoints} pts
            </Badge>
            <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">
              <CircleHelp data-icon="inline-start" />
              {story.questions.length} questions
            </Badge>
            {story.viewerProgress?.completedAt ? (
              <Badge className="rounded-full px-3 py-1">
                <CheckCircle2 data-icon="inline-start" />
                Story completed
              </Badge>
            ) : null}
          </>
        }
      />

      <div className="flex flex-col gap-10">
        <StoryCard
          title={story.title}
          prompt={story.prompt}
          level={story.level}
          content={story.content}
          footer={(
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  <Trophy data-icon="inline-start" />
                  {earnedPoints}/{totalPoints} pts
                </Badge>
                {story.viewerProgress?.completedAt ? (
                  <Badge>
                    <CheckCircle2 data-icon="inline-start" />
                    Story completed
                  </Badge>
                ) : null}
              </div>
            </>
          )}
        />

        <QuestionRenderer
          canSaveProgress={canSaveProgress}
          initialProgress={story.viewerProgress}
          questions={story.questions.map((question) => ({
            id: question.id,
            text: question.text,
            type: question.type,
            options: question.options,
            correctAnswer: question.correctAnswer ?? undefined,
          }))}
          storyId={story.id}
        />
      </div>
    </div>
  );
}
