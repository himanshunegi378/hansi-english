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
      !rect ||
      !anchorNode ||
      !containerRef.current?.contains(anchorNode) ||
      wordCount > MAX_WORDS
    ) {
      return;
    }

    setSelectedText({
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
