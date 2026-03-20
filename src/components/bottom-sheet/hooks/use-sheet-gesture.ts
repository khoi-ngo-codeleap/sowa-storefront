import { RefObject, useCallback, useEffect, useRef, useState } from "react";

type PositionEntry = { y: number; t: number };

const VELOCITY_THRESHOLD = 500; // px/s — flick threshold
const CLOSE_THRESHOLD_FRACTION = 0.5; // drag below 50% of lowest snap → close

/**
 * Pointer event-based drag gesture hook for bottom sheet.
 *
 * All drag movement is applied via refs (zero re-renders during drag).
 * DOM writes are coalesced via rAF — at most one style write per frame,
 * even when pointermove fires faster than the display refresh rate.
 *
 * On release: velocity-based or nearest-point snapping.
 */
export function useSheetGesture({
  sheetRef,
  overlayRef,
  snapPoints,
  currentSnapIndex,
  onSnap,
  onClose,
  enabled,
  viewportHeight,
  lastKnownY,
  cancelAnimation,
}: {
  sheetRef: RefObject<HTMLDivElement | null>;
  overlayRef: RefObject<HTMLDivElement | null>;
  /** Resolved pixel translateY values (sorted ascending = most visible first is lowest value) */
  snapPoints: number[];
  currentSnapIndex: number;
  onSnap: (snapIndex: number) => void;
  onClose: () => void;
  enabled: boolean;
  viewportHeight: number;
  lastKnownY: RefObject<number>;
  cancelAnimation: (positionOverride?: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startTranslateY = useRef(0);
  const positions = useRef<PositionEntry[]>([]);
  const pendingY = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  // Clean up rAF on unmount
  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return;
      // Only handle primary button (touch or left-click)
      if (e.button !== 0) return;

      const sheet = sheetRef.current;
      if (!sheet) return;

      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      // Stop any running WAAPI animation — use known position, no getComputedStyle
      cancelAnimation(lastKnownY.current);

      startTranslateY.current = lastKnownY.current;
      startY.current = e.clientY;
      positions.current = [{ y: e.clientY, t: e.timeStamp }];

      setIsDragging(true);
    },
    [enabled, sheetRef, cancelAnimation, lastKnownY],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      // Prevent scroll during drag
      e.preventDefault();

      const sheet = sheetRef.current;
      if (!sheet) return;

      const deltaY = e.clientY - startY.current;
      const newY = startTranslateY.current + deltaY;

      // Clamp: don't allow dragging above the highest snap point (smallest translateY)
      const minY = Math.min(...snapPoints);
      const clampedY = Math.max(minY, newY);

      // --- READ PHASE (sync, in event handler) ---
      lastKnownY.current = clampedY;
      pendingY.current = clampedY;

      // --- WRITE PHASE (deferred to rAF — one write per frame) ---
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(() => {
          const y = pendingY.current;
          if (y !== null && sheet) {
            sheet.style.transform = `translateY(${y}px)`;

            const overlay = overlayRef.current;
            if (overlay) {
              const progress = 1 - y / viewportHeight;
              overlay.style.opacity = String(Math.max(0, Math.min(1, progress)));
            }
          }
          rafId.current = null;
        });
      }

      // Track last 5 positions for velocity calculation
      positions.current.push({ y: e.clientY, t: e.timeStamp });
      if (positions.current.length > 5) positions.current.shift();
    },
    [isDragging, sheetRef, overlayRef, snapPoints, viewportHeight, lastKnownY],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;

      setIsDragging(false);

      const sheet = sheetRef.current;
      if (!sheet) return;

      // Flush pending rAF — snap animation must start from the correct position
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      const finalY = pendingY.current ?? lastKnownY.current;
      sheet.style.transform = `translateY(${finalY}px)`;
      const overlay = overlayRef.current;
      if (overlay) {
        const progress = 1 - finalY / viewportHeight;
        overlay.style.opacity = String(Math.max(0, Math.min(1, progress)));
      }
      pendingY.current = null;

      // Calculate velocity from tracked positions
      const entries = positions.current;
      let velocity = 0;
      if (entries.length >= 2) {
        const first = entries[0];
        const last = entries[entries.length - 1];
        const dt = (last.t - first.t) / 1000; // seconds
        if (dt > 0) {
          velocity = (last.y - first.y) / dt; // px/s, positive = downward
        }
      }

      const currentY = finalY;

      // Lowest snap point (most collapsed, highest translateY)
      const lowestSnapY = Math.max(...snapPoints);

      // If dragged significantly below lowest snap or flicked down fast → close
      const closeThreshold = lowestSnapY + (viewportHeight - lowestSnapY) * CLOSE_THRESHOLD_FRACTION;
      if (currentY > closeThreshold || (velocity > VELOCITY_THRESHOLD && currentY > lowestSnapY)) {
        onClose();
        return;
      }

      // Velocity-based snapping: if flicking fast, go to next snap in that direction
      if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
        const direction = velocity > 0 ? 1 : -1; // 1 = down (collapse), -1 = up (expand)
        if (direction < 0) {
          // Flick up: find next more-expanded snap (lower translateY)
          const target = snapPoints
            .filter((p) => p < currentY - 10)
            .sort((a, b) => b - a)[0]; // closest one that's more expanded
          if (target !== undefined) {
            const idx = snapPoints.indexOf(target);
            onSnap(idx);
            return;
          }
        } else {
          // Flick down: find next more-collapsed snap (higher translateY)
          const target = snapPoints
            .filter((p) => p > currentY + 10)
            .sort((a, b) => a - b)[0]; // closest one that's more collapsed
          if (target !== undefined) {
            const idx = snapPoints.indexOf(target);
            onSnap(idx);
            return;
          }
        }
      }

      // Default: snap to nearest point
      let nearestIdx = 0;
      let nearestDist = Infinity;
      for (let i = 0; i < snapPoints.length; i++) {
        const dist = Math.abs(snapPoints[i] - currentY);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = i;
        }
      }
      onSnap(nearestIdx);
    },
    [isDragging, sheetRef, overlayRef, snapPoints, viewportHeight, lastKnownY, onClose, onSnap],
  );

  const onPointerCancel = useCallback(() => {
    if (!isDragging) return;

    // Cancel any pending rAF
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    pendingY.current = null;

    setIsDragging(false);
    // Snap back to current position
    if (currentSnapIndex >= 0 && currentSnapIndex < snapPoints.length) {
      onSnap(currentSnapIndex);
    }
  }, [isDragging, currentSnapIndex, snapPoints, onSnap]);

  return {
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      style: { touchAction: "none" } as const,
    },
    isDragging,
  };
}
