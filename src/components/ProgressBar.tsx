import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function ProgressBar() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const minVisibleTime = 300; // ms

  const easingProgress = (t: number) =>
    // simple ease-out for width increase
    0.5 + 0.5 * Math.sin((Math.PI * t) / 2);

  useEffect(() => {
    let isRunning = true;
    let lastFrame = performance.now();

    function animateProgress(timestamp: number) {
      if (!isRunning) return;

      const elapsed = timestamp - startTimeRef.current;
      const t = Math.min(elapsed / 2000, 1); // Progress bar runs ~2s max
      const eased = easingProgress(t);
      setProgress(20 + eased * 70); // 20% to ~90%

      rafRef.current = requestAnimationFrame(animateProgress);
    }

    if (router.state.status === "pending") {
      setVisible(true);
      setProgress(0);
      startTimeRef.current = performance.now();

      // Begin animation on next tick
      rafRef.current = requestAnimationFrame(animateProgress);
    } else {
      isRunning = false;
      cancelAnimationFrame(rafRef.current!);

      // Fill to 100%, then fade out after a delay
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, minVisibleTime);

      return () => clearTimeout(timer);
    }

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafRef.current!);
    };
  }, [router.state.status]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed top-0 left-0 right-0 z-50 h-1 overflow-hidden transition-opacity duration-300"
        // visible ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        // style={{ width: `${progress}%` }}
        // style={{ width: `20%` }}
      />
    </div>
  );
}
