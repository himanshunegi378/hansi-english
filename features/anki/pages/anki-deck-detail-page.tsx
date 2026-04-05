"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft, Plus, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnkiPageShell } from "../components/layout/anki-page-shell";
import { AnkiSectionHeading } from "../components/shared/anki-section-heading";
import { CardEditorDialog } from "../components/card-editor/card-editor-dialog";
import { DeleteCardDialog } from "../components/confirm/delete-card-dialog";
import { DeleteDeckDialog } from "../components/confirm/delete-deck-dialog";
import { DeckDetail } from "../components/deck-detail/deck-detail";
import { useAnkiCardActions } from "../hooks/use-anki-card-actions";
import { useAnkiDeckActions } from "../hooks/use-anki-deck-actions";
import type { AnkiDeckCardViewModel, AnkiDeckDetailViewModel } from "../types/ui";
import { useRouter } from "next/navigation";

interface AnkiDeckDetailPageProps {
  deck: AnkiDeckDetailViewModel;
}

/**
 * Renders the deck-management screen for one Anki deck.
 * @param props Deck detail view model.
 * @returns The deck-detail page composition.
 */
export function AnkiDeckDetailPage({ deck }: AnkiDeckDetailPageProps) {
  const router = useRouter();
  const [cardToDelete, setCardToDelete] = useState<AnkiDeckCardViewModel | null>(null);
  const [cardToEdit, setCardToEdit] = useState<AnkiDeckCardViewModel | null>(null);
  const [editorValues, setEditorValues] = useState({ back: "", front: "" });
  const [isDeleteDeckOpen, setIsDeleteDeckOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ back?: string; front?: string }>({});
  const { createCard, deleteCard, deletingCardId, isSavingCard, updateCard } = useAnkiCardActions();
  const { deleteDeck, deletingDeckId } = useAnkiDeckActions();

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
      front: editorValues.front.trim() ? undefined : "Card front cannot be empty.",
    };

    setFieldErrors(nextErrors);

    if (nextErrors.front || nextErrors.back) {
      return;
    }

    const success = cardToEdit
      ? await updateCard(cardToEdit.id, editorValues)
      : await createCard(deck.id, editorValues);

    if (success) {
      setIsEditorOpen(false);
    }
  }

  async function handleDeleteDeck() {
    const success = await deleteDeck(deck.id);
    if (success) {
      router.push("/anki");
      router.refresh();
    }
  }

  async function handleDeleteCard() {
    if (!cardToDelete) {
      return;
    }

    const success = await deleteCard(cardToDelete.id);
    if (success) {
      setCardToDelete(null);
    }
  }

  return (
    <AnkiPageShell.Root>
      <AnkiPageShell.Header>
        <AnkiSectionHeading
          eyebrow="Deck workspace"
          title="Shape the deck, then let the study queue do the pacing."
          description="Add only the cards this deck truly needs, keep each prompt clear, and return to the due queue instead of cramming all at once."
          actions={(
            <AnkiPageShell.Actions>
              <Link href="/anki" className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-4")}>
                <ChevronLeft data-icon="inline-start" />
                Back to decks
              </Link>
              <Link href={deck.studyHref} className={cn(buttonVariants({ variant: "default" }), "rounded-full px-4")}>
                <BookOpen data-icon="inline-start" />
                Start study
              </Link>
            </AnkiPageShell.Actions>
          )}
        />
      </AnkiPageShell.Header>

      <AnkiPageShell.Body>
        <DeckDetail.Root>
          <DeckDetail.Header
            title={deck.name}
            description={deck.description}
            actions={(
              <>
                <Button variant="outline" className="rounded-full" onClick={openCreateCard}>
                  <Plus data-icon="inline-start" />
                  Add card
                </Button>
                <Button variant="outline" className="rounded-full" onClick={() => setIsDeleteDeckOpen(true)}>
                  <Trash2 data-icon="inline-start" />
                  Delete deck
                </Button>
              </>
            )}
          />
          <DeckDetail.Body>
            <DeckDetail.Stats
              createdAtLabel={deck.createdAtLabel}
              updatedAtLabel={deck.updatedAtLabel}
              dueCards={deck.dueCards}
              totalCards={deck.totalCards}
            />
            <DeckDetail.CardList
              cards={deck.cards}
              onEdit={openEditCard}
              onDelete={setCardToDelete}
            />
          </DeckDetail.Body>
        </DeckDetail.Root>
      </AnkiPageShell.Body>

      <CardEditorDialog.Root open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <CardEditorDialog.Content
          title={cardToEdit ? "Edit card" : "Add a card"}
          description={cardToEdit ? "Refine the prompt or answer without bloating the deck." : "Write a prompt that invites recall and an answer that confirms it clearly."}
        >
          <form onSubmit={handleSaveCard} className="flex flex-col">
            <CardEditorDialog.Form
              front={editorValues.front}
              back={editorValues.back}
              errors={fieldErrors}
              onFrontChange={(front) => setEditorValues((value) => ({ ...value, front }))}
              onBackChange={(back) => setEditorValues((value) => ({ ...value, back }))}
            />
            <CardEditorDialog.Actions
              isPending={isSavingCard}
              submitLabel={cardToEdit ? "Save changes" : "Add card"}
            />
          </form>
        </CardEditorDialog.Content>
      </CardEditorDialog.Root>

      <DeleteDeckDialog
        open={isDeleteDeckOpen}
        onOpenChange={setIsDeleteDeckOpen}
        name={deck.name}
        isPending={deletingDeckId === deck.id}
        onConfirm={handleDeleteDeck}
      />

      <DeleteCardDialog
        open={Boolean(cardToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setCardToDelete(null);
          }
        }}
        isPending={deletingCardId === cardToDelete?.id}
        onConfirm={handleDeleteCard}
      />
    </AnkiPageShell.Root>
  );
}
