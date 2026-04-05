"use client";

import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnkiPageShell } from "../components/layout/anki-page-shell";
import { AnkiSectionHeading } from "../components/shared/anki-section-heading";
import { CreateDeckDialog } from "../components/deck-list/create-deck-dialog";
import { DeckCard } from "../components/deck-list/deck-card";
import { DeckList } from "../components/deck-list/deck-list";
import { useAnkiDeckActions } from "../hooks/use-anki-deck-actions";
import { listDecksQueryOptions } from "../query-options";

/**
 * Renders the Anki deck library screen.
 * @returns The deck-list page composition.
 */
export function AnkiDeckListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { createDeck, isCreatingDeck } = useAnkiDeckActions();
  const deckListQuery = useQuery({
    ...listDecksQueryOptions(),
    throwOnError: true,
    select: (decks) =>
      decks.map((deck) => ({
        ...deck,
        createdAtLabel: formatDistanceToNow(new Date(deck.createdAt), {
          addSuffix: true,
        }),
        href: `/anki/${deck.id}`,
        studyHref: `/anki/${deck.id}/study`,
      })),
  });
  const decks = deckListQuery.data ?? [];

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
                  />
                  <DeckCard.Body>
                    <DeckCard.Meta createdAtLabel={deck.createdAtLabel} />
                    <DeckCard.Stats dueCards={deck.dueCards} totalCards={deck.totalCards} />
                  </DeckCard.Body>
                  <DeckCard.Actions href={deck.href} studyHref={deck.studyHref} />
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
