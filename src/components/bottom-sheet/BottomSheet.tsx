import {
  ComponentProps,
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { useControllableReducer } from "@/hooks/use-controllable";
import { callAll, cn } from "@/lib/utils";
import { Portal } from "./Portal";
import type { BottomSheetAction, BottomSheetState } from "./type";
import { BottomSheetContext, useBottomSheet } from "./hooks/use-bottom-sheet";
import { useSnapPoints } from "./hooks/use-snap-points";
import { useSheetAnimation } from "./hooks/use-sheet-animation";
import { useSheetGesture } from "./hooks/use-sheet-gesture";

// --- Reducer ---

function createReducer(defaultSnapIndex: number) {
  return function bottomSheetReducer(
    state: BottomSheetState,
    action: BottomSheetAction,
  ): BottomSheetState {
    switch (action.type) {
      case "open":
        return { open: true, snapIndex: defaultSnapIndex };
      case "close":
        return { open: false, snapIndex: -1 };
      case "toggle":
        return state.open
          ? { open: false, snapIndex: -1 }
          : { open: true, snapIndex: defaultSnapIndex };
      case "snap":
        return { open: action.snapIndex >= 0, snapIndex: action.snapIndex };
    }
  };
}

// --- Root ---

interface BottomSheetProps extends PropsWithChildren {
  initialValue?: boolean;
  value?: boolean;
  onChange?: (state: BottomSheetState, action: BottomSheetAction) => void;
  stateReducer?: (
    state: BottomSheetState,
    action: BottomSheetAction,
  ) => BottomSheetState;
  /** Fractional snap points, e.g. [0.15, 0.5, 1]. Default: [1] */
  snapPoints?: number[];
  /** Which snap index to go to on open. Default: 0 */
  defaultSnapIndex?: number;
}

export function BottomSheet({
  initialValue = false,
  value,
  onChange,
  stateReducer,
  snapPoints: snapPointsFractions = [1],
  defaultSnapIndex = 0,
  children,
}: BottomSheetProps) {
  const reducer = useRef(createReducer(defaultSnapIndex)).current;

  const [state, dispatch] = useControllableReducer({
    reducer,
    stateReducer,
    initialValue: {
      open: initialValue,
      snapIndex: initialValue ? defaultSnapIndex : -1,
    },
    value:
      value !== undefined
        ? { open: value, snapIndex: value ? defaultSnapIndex : -1 }
        : undefined,
    onChange,
  });

  const { resolvedPoints, viewportHeight } = useSnapPoints(snapPointsFractions);
  const sheetRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lastKnownY = useRef(viewportHeight);
  const { animateTo, cancelAnimation } = useSheetAnimation(
    sheetRef,
    overlayRef,
    viewportHeight,
    lastKnownY,
  );

  const onSnap = useCallback(
    (snapIndex: number) => {
      const targetY = resolvedPoints[snapIndex];
      if (targetY !== undefined) {
        animateTo(targetY);
        dispatch({ type: "snap", snapIndex });
      }
    },
    [resolvedPoints, animateTo, dispatch],
  );

  const onClose = useCallback(() => {
    animateTo(viewportHeight);
    dispatch({ type: "close" });
  }, [animateTo, viewportHeight, dispatch]);

  const { handleProps, isDragging } = useSheetGesture({
    sheetRef,
    overlayRef,
    snapPoints: resolvedPoints,
    currentSnapIndex: state.snapIndex,
    onSnap,
    onClose,
    enabled: state.open,
    viewportHeight,
    lastKnownY,
    cancelAnimation,
  });

  // Animate to snap point when state changes (not during drag)
  const prevSnapIndex = useRef(state.snapIndex);
  useEffect(() => {
    if (isDragging) return;
    if (prevSnapIndex.current === state.snapIndex) return;
    prevSnapIndex.current = state.snapIndex;

    if (state.snapIndex >= 0 && state.snapIndex < resolvedPoints.length) {
      animateTo(resolvedPoints[state.snapIndex]);
    } else if (state.snapIndex === -1) {
      animateTo(viewportHeight);
    }
  }, [state.snapIndex, isDragging, resolvedPoints, viewportHeight, animateTo]);

  // Set initial position before first paint (no flash)
  const initialized = useRef(false);
  useLayoutEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const sheet = sheetRef.current;
    if (!sheet) return;

    if (state.open && state.snapIndex >= 0) {
      const y = resolvedPoints[state.snapIndex];
      sheet.style.transform = `translateY(${y}px)`;
      lastKnownY.current = y;
      const overlay = overlayRef.current;
      if (overlay) {
        const opacity = 1 - y / viewportHeight;
        overlay.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      }
    } else {
      sheet.style.transform = `translateY(${viewportHeight}px)`;
      lastKnownY.current = viewportHeight;
      const overlay = overlayRef.current;
      if (overlay) overlay.style.opacity = "0";
    }
  }, [state.open, state.snapIndex, resolvedPoints, viewportHeight]);

  return (
    <BottomSheetContext
      value={{
        open: state.open,
        snapIndex: state.snapIndex,
        snapPoints: resolvedPoints,
        dispatch,
        sheetRef,
        overlayRef,
        animateTo,
        handleProps,
        isDragging,
      }}
    >
      {children}
    </BottomSheetContext>
  );
}

// --- Trigger ---

export function BottomSheetTrigger({
  onClick,
  ...props
}: ComponentProps<"button">) {
  const { open, dispatch } = useBottomSheet();

  return (
    <button
      aria-expanded={open}
      {...props}
      onClick={callAll(onClick, () => dispatch({ type: "toggle" }))}
    />
  );
}

// --- Portal ---

export function BottomSheetPortal({ children }: PropsWithChildren) {
  return <Portal>{children}</Portal>;
}

// --- Overlay ---

export function BottomSheetOverlay({
  onClick,
  className,
  ...props
}: ComponentProps<"div">) {
  const { dispatch, overlayRef, open } = useBottomSheet();

  return (
    <div
      ref={overlayRef}
      aria-hidden
      {...props}
      onClick={callAll(onClick, () => dispatch({ type: "close" }))}
      className={cn(
        "fixed inset-0 bg-black/40 opacity-0",
        !open && "pointer-events-none",
        className,
      )}
    />
  );
}

// --- Content ---

export function BottomSheetContent({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  const { open, sheetRef } = useBottomSheet();

  return (
    <div
      ref={sheetRef}
      role="dialog"
      aria-hidden={!open}
      {...props}
      className={cn(
        "fixed bottom-0 left-0 right-0",
        "bg-white rounded-t-2xl shadow-xl",
        "will-change-transform",
        !open && "pointer-events-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

// --- Handle ---

export function BottomSheetHandle({
  className,
  ...props
}: ComponentProps<"div">) {
  const { handleProps, snapIndex, snapPoints, dispatch } = useBottomSheet();

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      // Go to next more-expanded snap (lower index in resolvedPoints = more expanded)
      const nextIdx = snapIndex + 1;
      if (nextIdx < snapPoints.length) {
        dispatch({ type: "snap", snapIndex: nextIdx });
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = snapIndex - 1;
      if (nextIdx >= 0) {
        dispatch({ type: "snap", snapIndex: nextIdx });
      } else {
        dispatch({ type: "close" });
      }
    }
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-valuemin={0}
      aria-valuemax={snapPoints.length - 1}
      aria-valuenow={snapIndex}
      aria-label="Sheet position"
      {...props}
      {...handleProps}
      onKeyDown={callAll(props.onKeyDown, onKeyDown)}
      className={cn(
        "flex items-center justify-center py-3 cursor-grab active:cursor-grabbing",
        className,
      )}
    >
      <div className="w-10 h-1 rounded-full bg-neutral-300" />
    </div>
  );
}
