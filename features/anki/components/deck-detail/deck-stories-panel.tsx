"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpenText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { StoryListCard } from "@/features/story/pages/story-list-card";
import { deckStoriesQueryOptions } from "../../query-options";

interface DeckStoriesPanelProps {
  deckId: string;
}

/**
 * Renders the saved stories linked to a deck.
 * @param props The deck identifier to load stories for.
 * @returns The stories panel content.
 */
export function DeckStoriesPanel({ deckId }: DeckStoriesPanelProps) {
  const storiesQuery = useQuery({
    ...deckStoriesQueryOptions(deckId),
    throwOnError: true,
  });
  const stories = storiesQuery.data ?? [];

  if (storiesQuery.isPending) {
    return (
      <div className="rounded-[2rem] border border-border/60 bg-card/90 p-6 text-sm text-foreground/80">
        Loading stories...
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <Card className="rounded-[2rem] border-border/70 bg-card/90 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <Empty className="rounded-[1.75rem] border-border/60 bg-background/70">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="size-12 rounded-full bg-secondary text-secondary-foreground"
              >
                <BookOpenText />
              </EmptyMedia>
              <EmptyTitle className="text-lg">No stories for this deck yet</EmptyTitle>
              <EmptyDescription className="max-w-md">
                Generate a story from this deck to build a reading practice set around its vocabulary.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stories.map((story, index) => (
        <StoryListCard key={story.id} story={story} index={index} />
      ))}
    </div>
  );
}
