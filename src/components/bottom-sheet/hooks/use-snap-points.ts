import { useCallback, useSyncExternalStore } from "react";

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function subscribeToViewport(callback: () => void) {
  const viewport = window.visualViewport;
  if (viewport) {
    viewport.addEventListener("resize", callback);
    return () => viewport.removeEventListener("resize", callback);
  }
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

/**
 * Resolves fractional snap points (e.g. [0.15, 0.5, 1]) to pixel translateY values.
 *
 * A snap point of 1 means "full height" → translateY(0).
 * A snap point of 0.5 means "half height" → translateY(viewportHeight * 0.5).
 * Returned values are the translateY pixels from the bottom of the viewport.
 */
export function useSnapPoints(snapPoints: number[]) {
  const viewportHeight = useSyncExternalStore(
    subscribeToViewport,
    getViewportHeight,
    // SSR fallback
    () => 800
  );

  const resolveSnapPoint = useCallback(
    (fraction: number) => viewportHeight * (1 - fraction),
    [viewportHeight]
  );

  // translateY values: lower value = more visible
  const resolvedPoints = snapPoints.map(resolveSnapPoint);

  return { resolvedPoints, viewportHeight };
}
