"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnkiPageShell } from "../components/layout/anki-page-shell";
import { AnkiSectionHeading } from "../components/shared/anki-section-heading";
import { CreateDeckDialog } from "../components/deck-list/create-deck-dialog";
import { DeckCard } from "../components/deck-list/deck-card";
import { DeckList } from "../components/deck-list/deck-list";
import { useAnkiDeckActions } from "../hooks/use-anki-deck-actions";
import type { AnkiDeckListItem } from "../types/ui";

interface AnkiDeckListPageProps {
  decks: AnkiDeckListItem[];
}

/**
 * Renders the Anki deck library screen.
 * @param props Deck list view model for the current user.
 * @returns The deck-list page composition.
 */
export function AnkiDeckListPage({ decks }: AnkiDeckListPageProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { createDeck, isCreatingDeck } = useAnkiDeckActions();

  return (
    <AnkiPageShell.Root>
      <AnkiPageShell.Header>
        <AnkiSectionHeading
          eyebrow="Spaced repetition"
          title="Build a quiet review routine, one deck at a time."
          description="Start with a small deck, return to it often, and let the due queue guide what deserves attention today."
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
          {decks.length === 0 ? (
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
