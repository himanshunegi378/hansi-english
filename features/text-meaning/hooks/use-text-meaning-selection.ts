"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { SelectedText } from "../types";

interface UseTextMeaningSelectionResult {
  clearSelection: () => void;
  containerRef: RefObject<HTMLDivElement | null>;
  handlePointerSelection: () => void;
  selectedText: SelectedText | null;
}

const MAX_WORDS = 3;
const OVERLAY_SELECTOR = "[data-text-meaning-overlay='true']";
const SENTENCE_BREAK_PATTERN = /[.!?。！？]/;

/**
 * Tracks text selections inside a container and stores the selected text with viewport coordinates.
 * @returns Container bindings and the active selection state.
 */
export function useTextMeaningSelection(): UseTextMeaningSelectionResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState<SelectedText | null>(null);

  /**
   * Clears the browser selection and local tooltip state.
   */
  const clearSelection = () => {
    window.getSelection()?.removeAllRanges();
    setSelectedText(null);
  };

  /**
   * Captures the current text selection when it belongs to the wrapped container.
   */
  const handlePointerSelection = () => {
    const selection = window.getSelection();
    const selectedValue = selection?.toString().trim() ?? "";

    if (!selection || selection.isCollapsed || !selectedValue) {
      return;
    }

    const wordCount = selectedValue.split(/\s+/).length;
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    const rect = range?.getBoundingClientRect();
    const anchorNode = selection.anchorNode;

    if (
      !range ||
      !rect ||
      !anchorNode ||
      !containerRef.current?.contains(anchorNode) ||
      wordCount > MAX_WORDS
    ) {
      return;
    }

    setSelectedText({
      contextSentence: getContextSentence({
        containerElement: containerRef.current,
        range,
        selectedText: selectedValue,
      }),
      text: selectedValue,
      position: {
        top: rect.top,
        left: rect.left + rect.width / 2,
      },
    });
  };

  useEffect(() => {
    if (!selectedText) {
      return;
    }

    /**
     * Dismisses the meaning UI when the user interacts outside the wrapped text.
     * @param event The browser pointer event.
     */
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        target.closest(OVERLAY_SELECTOR)
      ) {
        return;
      }

      if (
        target instanceof Node &&
        containerRef.current?.contains(target)
      ) {
        return;
      }

      clearSelection();
    };

    /**
     * Hides the floating tooltip while the viewport is moving.
     */
    const handleViewportChange = () => {
      clearSelection();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [selectedText]);

  return {
    clearSelection,
    containerRef,
    handlePointerSelection,
    selectedText,
  };
}

interface GetContextSentenceOptions {
  containerElement: HTMLDivElement | null;
  range: Range;
  selectedText: string;
}

/**
 * Derives the sentence surrounding the current selection from the container text.
 * @param options The current container, range, and selected text.
 * @returns The nearest sentence containing the selection when available.
 */
function getContextSentence({
  containerElement,
  range,
  selectedText,
}: GetContextSentenceOptions): string | undefined {
  if (!containerElement) {
    return undefined;
  }

  const fullText = containerElement.textContent?.replace(/\s+/g, " ").trim();

  if (!fullText) {
    return undefined;
  }

  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(containerElement);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);

  const startIndex = preSelectionRange.toString().replace(/\s+/g, " ").length;
  const normalizedSelection = selectedText.replace(/\s+/g, " ").trim();

  if (!normalizedSelection) {
    return undefined;
  }

  const selectionIndex =
    fullText.indexOf(normalizedSelection, Math.max(0, startIndex - normalizedSelection.length)) >= 0
      ? fullText.indexOf(normalizedSelection, Math.max(0, startIndex - normalizedSelection.length))
      : fullText.indexOf(normalizedSelection);

  if (selectionIndex < 0) {
    return undefined;
  }

  let sentenceStart = selectionIndex;
  while (sentenceStart > 0 && !SENTENCE_BREAK_PATTERN.test(fullText[sentenceStart - 1])) {
    sentenceStart -= 1;
  }

  let sentenceEnd = selectionIndex + normalizedSelection.length;
  while (sentenceEnd < fullText.length && !SENTENCE_BREAK_PATTERN.test(fullText[sentenceEnd])) {
    sentenceEnd += 1;
  }

  if (sentenceEnd < fullText.length) {
    sentenceEnd += 1;
  }

  return fullText.slice(sentenceStart, sentenceEnd).trim() || undefined;
}
