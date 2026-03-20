import { createContext, RefObject, use } from "react";
import type { BottomSheetAction } from "../type";

export type BottomSheetContextValue = {
  open: boolean;
  snapIndex: number;
  snapPoints: number[]; // resolved pixel translateY values
  dispatch: (action: BottomSheetAction) => void;
  sheetRef: RefObject<HTMLDivElement | null>;
  overlayRef: RefObject<HTMLDivElement | null>;
  animateTo: (targetY: number, options?: { duration?: number }) => Promise<void>;
  handleProps: Record<string, unknown>;
  isDragging: boolean;
};

export const BottomSheetContext =
  createContext<BottomSheetContextValue | null>(null);

export function useBottomSheet() {
  const context = use(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheet");
  }
  return context;
}
