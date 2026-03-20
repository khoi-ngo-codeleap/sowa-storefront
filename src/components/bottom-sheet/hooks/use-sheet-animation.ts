import { RefObject, useCallback, useRef } from "react";

const EASING = "cubic-bezier(0.32, 0.72, 0, 1)";
const BASE_DURATION = 500;
const MIN_DURATION = 200;

/**
 * Web Animations API wrapper for bottom sheet snap transitions.
 *
 * Tracks running animations and cancels them cleanly before starting new ones.
 * Commits the current animated position to inline style before cancellation
 * to prevent visual jumps.
 *
 * Accepts a shared `lastKnownY` ref as the single source of truth for the
 * sheet's current Y position — avoids DOM queries (getComputedStyle / inline
 * style parsing) on the hot path.
 */
export function useSheetAnimation(
  sheetRef: RefObject<HTMLDivElement | null>,
  overlayRef: RefObject<HTMLDivElement | null>,
  viewportHeight: number,
  lastKnownY: RefObject<number>,
) {
  const sheetAnimRef = useRef<Animation | null>(null);
  const overlayAnimRef = useRef<Animation | null>(null);
  const lastTargetY = useRef<number | null>(null);

  /**
   * Cancel running animations, committing their current position to inline style.
   *
   * When called with `positionOverride` (e.g. from the gesture hook which already
   * knows the sheet's Y), that value is used directly — no getComputedStyle needed.
   *
   * When called without (animation-to-animation cancellation), reads the live
   * computed position. Reads are batched before writes to avoid layout thrashing.
   */
  const cancelAnimation = useCallback(
    (positionOverride?: number) => {
      const sheet = sheetRef.current;
      const overlay = overlayRef.current;

      const hasSheetAnim = sheetAnimRef.current !== null;
      const hasOverlayAnim = overlayAnimRef.current !== null;
      if (!hasSheetAnim && !hasOverlayAnim) return;

      // --- READ PHASE ---
      let liveY: number | null = null;
      let liveOpacity: string | null = null;

      if (positionOverride !== undefined) {
        liveY = positionOverride;
      } else if (hasSheetAnim && sheet) {
        liveY = getComputedTranslateY(sheet);
      }

      if (hasOverlayAnim && overlay) {
        liveOpacity = positionOverride !== undefined
          ? String(computeOverlayOpacity(positionOverride, viewportHeight))
          : getComputedStyle(overlay).opacity;
      }

      // --- WRITE PHASE ---
      if (sheetAnimRef.current) {
        if (liveY !== null && sheet) {
          sheet.style.transform = `translateY(${liveY}px)`;
          lastKnownY.current = liveY;
        }
        sheetAnimRef.current.cancel();
        sheetAnimRef.current = null;
      }

      if (overlayAnimRef.current) {
        if (liveOpacity !== null && overlay) {
          overlay.style.opacity = liveOpacity;
        }
        overlayAnimRef.current.cancel();
        overlayAnimRef.current = null;
      }

      lastTargetY.current = null;
    },
    [sheetRef, overlayRef, viewportHeight, lastKnownY],
  );

  const animateTo = useCallback(
    (targetY: number, options?: { duration?: number }) => {
      const sheet = sheetRef.current;
      if (!sheet) return Promise.resolve();

      // Already animating to this exact target — let it finish
      if (
        lastTargetY.current === targetY &&
        sheetAnimRef.current?.playState === "running"
      ) {
        return sheetAnimRef.current.finished.then(() => {}).catch(() => {});
      }

      // Cancel running animations — commit current position first to avoid jump
      cancelAnimation();

      lastTargetY.current = targetY;

      const currentY = lastKnownY.current;
      const distance = Math.abs(targetY - currentY);

      // Already at target — just commit
      if (distance < 1) {
        commitPosition(sheet, overlayRef.current, targetY, viewportHeight);
        lastKnownY.current = targetY;
        lastTargetY.current = null;
        return Promise.resolve();
      }

      // Duration proportional to distance, bounded
      const duration =
        options?.duration ??
        Math.max(
          MIN_DURATION,
          Math.min(BASE_DURATION, (distance / viewportHeight) * BASE_DURATION),
        );

      const sheetAnim = sheet.animate(
        [
          { transform: `translateY(${currentY}px)` },
          { transform: `translateY(${targetY}px)` },
        ],
        { duration, easing: EASING, fill: "forwards" },
      );
      sheetAnimRef.current = sheetAnim;

      // Animate overlay opacity
      const overlay = overlayRef.current;
      if (overlay) {
        const currentOpacity = parseFloat(overlay.style.opacity) || 0;
        const targetOpacity = computeOverlayOpacity(targetY, viewportHeight);

        const overlayAnim = overlay.animate(
          [{ opacity: currentOpacity }, { opacity: targetOpacity }],
          { duration, easing: EASING, fill: "forwards" },
        );
        overlayAnimRef.current = overlayAnim;
      }

      return sheetAnim.finished
        .then(() => {
          commitPosition(sheet, overlay, targetY, viewportHeight);
          lastKnownY.current = targetY;
          sheetAnimRef.current = null;
          overlayAnimRef.current = null;
          lastTargetY.current = null;

          // Clean up finished animations
          sheetAnim.cancel();
          overlay?.getAnimations().forEach((a) => a.cancel());
        })
        .catch(() => {
          // Animation was cancelled by a newer animateTo call — expected
        });
    },
    [sheetRef, overlayRef, viewportHeight, lastKnownY, cancelAnimation],
  );

  return { animateTo, cancelAnimation };
}

function commitPosition(
  sheet: HTMLDivElement,
  overlay: HTMLDivElement | null,
  targetY: number,
  viewportHeight: number,
) {
  sheet.style.transform = `translateY(${targetY}px)`;
  if (overlay) {
    overlay.style.opacity = String(computeOverlayOpacity(targetY, viewportHeight));
  }
}

function computeOverlayOpacity(targetY: number, viewportHeight: number) {
  if (targetY >= viewportHeight) return 0;
  return Math.max(0, Math.min(1, 1 - targetY / viewportHeight));
}

/** Read the live (mid-animation) translateY from the computed style matrix. */
function getComputedTranslateY(el: HTMLElement): number | null {
  const raw = getComputedStyle(el).transform;
  if (!raw || raw === "none") return null;
  const matrix = new DOMMatrix(raw);
  return matrix.m42;
}
