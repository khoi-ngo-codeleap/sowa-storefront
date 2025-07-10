import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export default function Progress() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const runningRef = useRef<boolean>(false);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const minVisibleTime = 300; // ms

  // simple ease-out for width increase
  const easingProgress = (t: number) => 0.5 + 0.5 * Math.sin((Math.PI * t) / 2);

  useEffect(() => {
    console.log("Effect running for progress bar");

    function animateProgress(timestamp: number) {
      if (!runningRef.current) return;

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
      runningRef.current = false;
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
      runningRef.current = false;
      rafRef.current && cancelAnimationFrame(rafRef.current);
    };
  }, [router.state.status]);

  return (
    <div
      className={cn(
        "w-full h-1 bg-gray-200 fixed top-0 left-0 z-50"
        // visible ? "opacity-100 animate-pulse" : "opacity-0"
      )}
    >
      <div
        className="h-full bg-amber-500 transition-all"
        style={{
          width: `${progress}%`,
        }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
