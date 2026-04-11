"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnkiPageShell } from "../components/layout/anki-page-shell";
import { DeckDetail } from "../components/deck-detail/deck-detail";
import { DeckCardDialogs } from "../components/deck-detail/deck-card-dialogs";
import { DeckDetailPageHeader } from "../components/deck-detail/deck-detail-page-header";
import { DeckDetailTabs } from "../components/deck-detail/deck-detail-tabs";
import { useAnkiCardActions } from "../hooks/use-anki-card-actions";
import { useAnkiDeckActions } from "../hooks/use-anki-deck-actions";
import { toDeckViewModel } from "../lib/deck-detail-view-model";
import { deckDetailQueryOptions } from "../query-options";
import type { AnkiDeckCardViewModel } from "../types/ui";

interface AnkiDeckDetailPageProps {
  deckId: string;
}

/**
 * Renders the deck-management screen for one Anki deck.
 * @param props Deck identifier to query.
 * @returns The deck-detail page composition.
 */
export function AnkiDeckDetailPage({ deckId }: AnkiDeckDetailPageProps) {
  const router = useRouter();
  const [cardToDelete, setCardToDelete] =
    useState<AnkiDeckCardViewModel | null>(null);
  const [cardToEdit, setCardToEdit] = useState<AnkiDeckCardViewModel | null>(
    null,
  );
  const [editorValues, setEditorValues] = useState({ back: "", front: "" });
  const [isDeleteDeckOpen, setIsDeleteDeckOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    back?: string;
    front?: string;
  }>({});
  const { createCard, deleteCard, deletingCardId, isSavingCard, updateCard } =
    useAnkiCardActions();
  const { deleteDeck, deletingDeckId } = useAnkiDeckActions();
  const deckQuery = useQuery({
    ...deckDetailQueryOptions(deckId),
    throwOnError: true,
    select: toDeckViewModel,
  });
  const deck = deckQuery.data;

  function openCreateCard() {
    setCardToEdit(null);
    setEditorValues({ back: "", front: "" });
    setFieldErrors({});
    setIsEditorOpen(true);
  }

  function openEditCard(card: AnkiDeckCardViewModel) {
    setCardToEdit(card);
    setEditorValues({ back: card.back, front: card.front });
    setFieldErrors({});
    setIsEditorOpen(true);
  }

  async function handleSaveCard(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = {
      back: editorValues.back.trim() ? undefined : "Card back cannot be empty.",
      front: editorValues.front.trim()
        ? undefined
        : "Card front cannot be empty.",
    };

    setFieldErrors(nextErrors);

    if (nextErrors.front || nextErrors.back || !deck) {
      return;
    }

    const success = cardToEdit
      ? await updateCard(cardToEdit.id, deck.id, editorValues)
      : await createCard(deck.id, editorValues);

    if (success) {
      setIsEditorOpen(false);
    }
  }

  async function handleDeleteDeck() {
    if (!deck) {
      return;
    }

    const success = await deleteDeck(deck.id);
    if (success) {
      router.push("/anki");
    }
  }

  async function handleDeleteCard() {
    if (!cardToDelete || !deck) {
      return;
    }

    const success = await deleteCard(cardToDelete.id, deck.id);
    if (success) {
      setCardToDelete(null);
    }
  }

  if (!deck) {
    return (
      <AnkiPageShell.Root>
        <AnkiPageShell.Body>
          <div className="rounded-[2rem] border border-border/60 bg-card/90 p-6 text-sm text-foreground/80">
            Loading deck…
          </div>
        </AnkiPageShell.Body>
      </AnkiPageShell.Root>
    );
  }

  return (
    <AnkiPageShell.Root>
      <DeckDetailPageHeader studyHref={deck.studyHref} />

      <AnkiPageShell.Body>
        <DeckDetail.Root>
          <DeckDetail.Header
            title={deck.name}
            description={deck.description}
            totalCards={deck.totalCards}
            actions={(
              <>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={openCreateCard}
                >
                  <Plus data-icon="inline-start" />
                  Add card
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setIsDeleteDeckOpen(true)}
                >
                  <Trash2 data-icon="inline-start" />
                  Delete deck
                </Button>
              </>
            )}
          />
        </DeckDetail.Root>

        <div className="mt-8 flex flex-col gap-6">
          <DeckDetailTabs
            deckId={deck.id}
            cards={deck.cards}
            onEditCard={openEditCard}
            onDeleteCard={setCardToDelete}
          />
        </div>
      </AnkiPageShell.Body>

      <DeckCardDialogs
        cardToDelete={cardToDelete}
        cardToEdit={cardToEdit}
        deckName={deck.name}
        deletingCardId={deletingCardId}
        deletingDeckId={deletingDeckId === deck.id ? deletingDeckId : null}
        editorValues={editorValues}
        fieldErrors={fieldErrors}
        isDeleteDeckOpen={isDeleteDeckOpen}
        isEditorOpen={isEditorOpen}
        isSavingCard={isSavingCard}
        onBackChange={(back) => setEditorValues((value) => ({ ...value, back }))}
        onConfirmDeleteCard={handleDeleteCard}
        onConfirmDeleteDeck={handleDeleteDeck}
        onFrontChange={(front) => setEditorValues((value) => ({ ...value, front }))}
        onOpenChangeDeleteCard={(open) => {
          if (!open) {
            setCardToDelete(null);
          }
        }}
        onOpenChangeDeleteDeck={setIsDeleteDeckOpen}
        onOpenChangeEditor={setIsEditorOpen}
        onSaveCard={handleSaveCard}
      />
    </AnkiPageShell.Root>
  );
}
