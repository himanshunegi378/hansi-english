"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { useCreateStoryFromDeck } from "@/features/create-story-from-deck";
import { AnkiPageShell } from "../components/layout/anki-page-shell";
import { AnkiSectionHeading } from "../components/shared/anki-section-heading";
import { CreateDeckDialog } from "../components/deck-list/create-deck-dialog";
import { DeckCard } from "../components/deck-list/deck-card";
import { DeckList } from "../components/deck-list/deck-list";
import { DeckStoryGenerationFeedback } from "../components/deck-list/deck-story-generation-feedback";
import { useAnkiDeckActions } from "../hooks/use-anki-deck-actions";
import { listDecksQueryOptions } from "../query-options";

/**
 * Renders the Anki deck library screen.
 * @returns The deck-list page composition.
 */
export function AnkiDeckListPage() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { createDeck, isCreatingDeck } = useAnkiDeckActions();
  const { createDeckStory, creatingStoryDeckId, isCreatingDeckStory } = useCreateStoryFromDeck();
  const deckListQuery = useQuery({
    ...listDecksQueryOptions(),
    throwOnError: true,
    select: (decks) =>
      decks.map((deck) => ({
        ...deck,
        href: `/anki/${deck.id}`,
        studyHref: `/anki/${deck.id}/study`,
      })),
  });
  const decks = deckListQuery.data ?? [];
  const activeStoryDeck = decks.find((deck) => deck.id === creatingStoryDeckId) ?? null;

  /**
   * Creates a story from the selected deck and opens it after persistence.
   * @param deckId Source deck id.
   */
  async function handleCreateStory(deckId: string) {
    const story = await createDeckStory(deckId);

    if (!story) {
      return;
    }

    router.push(`/story?storyId=${encodeURIComponent(story.id)}`);
  }

  return (
    <AnkiPageShell.Root>
      <AnkiPageShell.Header>
        <AnkiSectionHeading
          eyebrow="Spaced repetition"
          actions={(
            <Button className="rounded-full" onClick={() => setIsCreateOpen(true)}>
              <Plus data-icon="inline-start" />
              Create deck
            </Button>
          )}
        />
      </AnkiPageShell.Header>

      <AnkiPageShell.Body>
        <DeckList.Root>
          <AnimatePresence>
            {activeStoryDeck ? (
              <DeckStoryGenerationFeedback deckName={activeStoryDeck.name} />
            ) : null}
          </AnimatePresence>

          {deckListQuery.isPending ? (
            <div className="rounded-[2rem] border border-border/60 bg-card/90 p-6 text-sm text-muted-foreground">
              Loading decks...
            </div>
          ) : decks.length === 0 ? (
            <DeckList.Empty />
          ) : (
            <DeckList.Grid>
              {decks.map((deck, index) => (
                <DeckCard.Root key={deck.id} index={index}>
                  <DeckCard.Header
                    title={deck.name}
                    description={deck.description}
                    href={deck.href}
                    actions={(
                      <Menubar className="h-auto border-none bg-transparent p-0">
                        <MenubarMenu>
                          <MenubarTrigger className="flex size-8 items-center justify-center rounded-full p-0 hover:bg-muted data-[state=open]:bg-muted">
                            <MoreVertical className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </MenubarTrigger>
                          <MenubarContent align="end">
                            <MenubarItem
                              className="gap-2"
                              disabled={isCreatingDeckStory}
                              onClick={() => void handleCreateStory(deck.id)}
                            >
                              {creatingStoryDeckId === deck.id ? (
                                <>
                                  <Spinner />
                                  Creating story...
                                </>
                              ) : isCreatingDeckStory ? (
                                "Story in progress"
                              ) : (
                                "Create Story"
                              )}
                            </MenubarItem>

                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                    )}
                  />
                  <DeckCard.TotalStat
                    count={deck.totalCards}
                    href={deck.href}
                  />
                  <DeckCard.DueIndicator
                    count={deck.dueCards}
                    href={deck.studyHref}
                  />
                </DeckCard.Root>
              ))}
            </DeckList.Grid>
          )}
        </DeckList.Root>
      </AnkiPageShell.Body>

      <CreateDeckDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        isPending={isCreatingDeck}
        onSubmit={createDeck}
      />
    </AnkiPageShell.Root>
  );
}
