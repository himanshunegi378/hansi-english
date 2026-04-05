"use client";

import { LibraryBig } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteDeckDialogProps {
  isPending: boolean;
  name: string;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

/**
 * Confirms deletion of an entire deck and its cards.
 * @param props Controlled dialog state and confirmation handler.
 * @returns Deck deletion confirmation dialog.
 */
export function DeleteDeckDialog(props: DeleteDeckDialogProps) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <LibraryBig />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete “{props.name}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the deck, every card inside it, and its review history. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={props.isPending} onClick={props.onConfirm}>
            {props.isPending ? "Deleting..." : "Delete deck"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
