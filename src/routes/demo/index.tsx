import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHandle,
  BottomSheetOverlay,
  BottomSheetPortal,
  BottomSheetTrigger,
} from "@/components/bottom-sheet";
import type { BottomSheetAction, BottomSheetState } from "@/components/bottom-sheet";

export const Route = createFileRoute("/demo/")({
  component: DemoIndex,
});

const DEMOS = [
  {
    to: "/demo/bottom-sheet",
    label: "BottomSheet",
    description:
      "All examples on one page — uncontrolled, controlled, stateReducer, and multi-snap.",
  },
] as const;

function DemoIndex() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-1">Component Demos</h1>
      <p className="text-sm text-neutral-500 mb-8">
        Each demo is an isolated playground. Fork the repo, add your component,
        wire up a route.
      </p>

      <ul className="flex flex-col gap-3 mb-12">
        {DEMOS.map(({ to, label, description }) => (
          <li key={to}>
            <Link
              to={to}
              className="block border rounded-lg px-5 py-4 hover:bg-neutral-50 transition-colors"
            >
              <p className="font-medium">{label}</p>
              <p className="text-sm text-neutral-500 mt-0.5">{description}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="border-t pt-8">
        <h2 className="text-lg font-semibold mb-1">Quick Preview</h2>
        <p className="text-sm text-neutral-500 mb-8">
          Try the bottom sheet right here without navigating away.
        </p>

        <div className="flex flex-col gap-10">
          <PreviewSection title="Basic — Single snap">
            <BasicPreview />
          </PreviewSection>

          <PreviewSection title="Multi-snap — Google Maps style">
            <MultiSnapPreview />
          </PreviewSection>

          <PreviewSection title="Controlled — External state">
            <ControlledPreview />
          </PreviewSection>

          <PreviewSection title="stateReducer — Clamp to half">
            <ClampedPreview />
          </PreviewSection>
        </div>
      </div>
    </div>
  );
}

// --- Basic: single snap point, default behavior ---

function BasicPreview() {
  return (
    <BottomSheet>
      <BottomSheetTrigger className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg">
        Open
      </BottomSheetTrigger>
      <BottomSheetPortal>
        <BottomSheetOverlay />
        <BottomSheetContent className="flex flex-col">
          <BottomSheetHandle />
          <div className="p-6 flex flex-col gap-3">
            <p className="font-semibold">Basic Sheet</p>
            <p className="text-sm text-neutral-500">
              Single snap point at 100%. Drag the handle down or tap the overlay
              to dismiss.
            </p>
            <BottomSheetTrigger className="self-start px-4 py-2 border rounded-lg text-sm">
              Close
            </BottomSheetTrigger>
          </div>
        </BottomSheetContent>
      </BottomSheetPortal>
    </BottomSheet>
  );
}

// --- Multi-snap: peek / half / full ---

function MultiSnapPreview() {
  const [snapIndex, setSnapIndex] = useState(-1);
  const labels = ["peek (15%)", "half (50%)", "full (100%)"];

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-neutral-500">
        Current snap:{" "}
        <code className="font-mono">
          {snapIndex >= 0 ? `${snapIndex} — ${labels[snapIndex]}` : "closed"}
        </code>
      </p>
      <BottomSheet
        snapPoints={[0.15, 0.5, 1]}
        defaultSnapIndex={0}
        onChange={(state) => setSnapIndex(state.snapIndex)}
      >
        <BottomSheetTrigger className="self-start px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg">
          Open
        </BottomSheetTrigger>
        <BottomSheetPortal>
          <BottomSheetOverlay />
          <BottomSheetContent className="min-h-dvh">
            <BottomSheetHandle />
            <div className="p-6 flex flex-col gap-4">
              <p className="font-semibold">Google Maps-style</p>
              <p className="text-sm text-neutral-500">
                Drag between peek, half, and full. Flick down past the peek
                point to dismiss.
              </p>
              <div className="mt-2 space-y-2">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-neutral-100 rounded-lg flex items-center px-4 text-sm text-neutral-500"
                  >
                    Item {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </BottomSheetContent>
        </BottomSheetPortal>
      </BottomSheet>
    </div>
  );
}

// --- Controlled: parent owns state ---

function ControlledPreview() {
  const [open, setOpen] = useState(false);
  const [snapIndex, setSnapIndex] = useState(-1);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 text-sm text-neutral-500">
        <span>
          open=<code className="font-mono">{String(open)}</code>
        </span>
        <span>
          snapIndex=<code className="font-mono">{snapIndex}</code>
        </span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="px-3 py-1 border rounded text-xs"
        >
          Toggle externally
        </button>
      </div>
      <BottomSheet
        snapPoints={[0.4, 1]}
        value={open}
        onChange={(state) => {
          setOpen(state.open);
          setSnapIndex(state.snapIndex);
        }}
      >
        <BottomSheetTrigger className="self-start px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg">
          Open
        </BottomSheetTrigger>
        <BottomSheetPortal>
          <BottomSheetOverlay />
          <BottomSheetContent>
            <BottomSheetHandle />
            <div className="p-6 flex flex-col gap-3">
              <p className="font-semibold">Controlled</p>
              <p className="text-sm text-neutral-500">
                Parent owns the state. Use the external toggle button or drag the
                handle. Two snaps: 40% and 100%.
              </p>
              <button
                onClick={() => setOpen(false)}
                className="self-start px-4 py-2 border rounded-lg text-sm"
              >
                Close from inside
              </button>
            </div>
          </BottomSheetContent>
        </BottomSheetPortal>
      </BottomSheet>
    </div>
  );
}

// --- stateReducer: clamp max snap to half ---

function ClampedPreview() {
  function stateReducer(
    state: BottomSheetState,
    action: BottomSheetAction,
  ): BottomSheetState {
    // Intercept snap actions — prevent going above index 1 (half)
    if (action.type === "snap" && action.snapIndex > 1) {
      return { open: true, snapIndex: 1 };
    }
    switch (action.type) {
      case "open":
        return { open: true, snapIndex: 0 };
      case "close":
        return { open: false, snapIndex: -1 };
      case "toggle":
        return state.open
          ? { open: false, snapIndex: -1 }
          : { open: true, snapIndex: 0 };
      case "snap":
        return { open: action.snapIndex >= 0, snapIndex: action.snapIndex };
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-neutral-500">
        Three snap points defined, but <code>stateReducer</code> clamps the max
        to half (index 1). Try dragging to full — it stops at 50%.
      </p>
      <BottomSheet
        snapPoints={[0.15, 0.5, 1]}
        defaultSnapIndex={0}
        stateReducer={stateReducer}
      >
        <BottomSheetTrigger className="self-start px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg">
          Open
        </BottomSheetTrigger>
        <BottomSheetPortal>
          <BottomSheetOverlay />
          <BottomSheetContent className="min-h-dvh">
            <BottomSheetHandle />
            <div className="p-6 flex flex-col gap-3">
              <p className="font-semibold">Clamped via stateReducer</p>
              <p className="text-sm text-neutral-500">
                The consumer intercepts <code>snap</code> actions and caps the
                index at 1 (50%). The full snap point is unreachable.
              </p>
            </div>
          </BottomSheetContent>
        </BottomSheetPortal>
      </BottomSheet>
    </div>
  );
}

// --- Layout ---

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
        {title}
      </h3>
      <div className="border rounded-xl p-6">{children}</div>
    </div>
  );
}
