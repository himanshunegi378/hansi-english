"use client";

import { CardEditorDialog } from "../card-editor/card-editor-dialog";
import { DeleteCardDialog } from "../confirm/delete-card-dialog";
import { DeleteDeckDialog } from "../confirm/delete-deck-dialog";
import type { AnkiDeckCardViewModel } from "../../types/ui";

interface DeckCardDialogsProps {
  cardToDelete: AnkiDeckCardViewModel | null;
  cardToEdit: AnkiDeckCardViewModel | null;
  deckName: string;
  deletingCardId: string | null;
  deletingDeckId: string | null;
  editorValues: {
    back: string;
    front: string;
  };
  fieldErrors: {
    back?: string;
    front?: string;
  };
  isDeleteDeckOpen: boolean;
  isEditorOpen: boolean;
  isSavingCard: boolean;
  onBackChange: (back: string) => void;
  onConfirmDeleteCard: () => Promise<void>;
  onConfirmDeleteDeck: () => Promise<void>;
  onFrontChange: (front: string) => void;
  onOpenChangeDeleteCard: (open: boolean) => void;
  onOpenChangeDeleteDeck: (open: boolean) => void;
  onOpenChangeEditor: (open: boolean) => void;
  onSaveCard: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * Renders the deck detail dialogs for card editing and destructive actions.
 * @param props Dialog state, form state, and action handlers.
 * @returns Deck detail dialog cluster.
 */
export function DeckCardDialogs({
  cardToDelete,
  cardToEdit,
  deckName,
  deletingCardId,
  deletingDeckId,
  editorValues,
  fieldErrors,
  isDeleteDeckOpen,
  isEditorOpen,
  isSavingCard,
  onBackChange,
  onConfirmDeleteCard,
  onConfirmDeleteDeck,
  onFrontChange,
  onOpenChangeDeleteCard,
  onOpenChangeDeleteDeck,
  onOpenChangeEditor,
  onSaveCard,
}: DeckCardDialogsProps) {
  return (
    <>
      <CardEditorDialog.Root open={isEditorOpen} onOpenChange={onOpenChangeEditor}>
        <CardEditorDialog.Content
          title={cardToEdit ? "Edit card" : "Add a card"}
          description={cardToEdit ? "Refine the prompt or answer without bloating the deck." : "Write a prompt that invites recall and an answer that confirms it clearly."}
        >
          <form onSubmit={onSaveCard} className="flex flex-col">
            <CardEditorDialog.Form
              front={editorValues.front}
              back={editorValues.back}
              errors={fieldErrors}
              onFrontChange={onFrontChange}
              onBackChange={onBackChange}
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
        onOpenChange={onOpenChangeDeleteDeck}
        name={deckName}
        isPending={Boolean(deletingDeckId)}
        onConfirm={onConfirmDeleteDeck}
      />

      <DeleteCardDialog
        open={Boolean(cardToDelete)}
        onOpenChange={onOpenChangeDeleteCard}
        isPending={deletingCardId === cardToDelete?.id}
        onConfirm={onConfirmDeleteCard}
      />
    </>
  );
}
