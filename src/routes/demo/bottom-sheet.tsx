import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/demo/bottom-sheet")({
  component: BottomSheetDemo,
});

function BottomSheetDemo() {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <h2 className="text-xl font-semibold mb-1">BottomSheet</h2>
        <p className="text-sm text-neutral-500">
          Compound component. Controlled and uncontrolled modes. Portal rendering.
          Consumer-overridable state transitions via <code>stateReducer</code>.
        </p>
      </div>

      <Section title="Uncontrolled">
        <UncontrolledExample />
      </Section>

      <Section title="Controlled">
        <ControlledExample />
      </Section>

      <Section title="stateReducer — prevent close">
        <PreventCloseExample />
      </Section>

      <Section title="Google Maps-style — Multi-snap">
        <MultiSnapExample />
      </Section>
    </div>
  );
}

// --- Uncontrolled ---

function UncontrolledExample() {
  return (
    <BottomSheet initialValue={false}>
      <BottomSheetTrigger className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg">
        Open sheet
      </BottomSheetTrigger>
      <BottomSheetPortal>
        <BottomSheetOverlay />
        <BottomSheetContent className="p-6 flex flex-col gap-4">
          <BottomSheetHandle />
          <p className="font-semibold">Uncontrolled</p>
          <p className="text-sm text-neutral-500">
            State lives inside the component. Click the overlay to close.
          </p>
          <BottomSheetTrigger className="self-start px-4 py-2 border rounded-lg text-sm">
            Close
          </BottomSheetTrigger>
        </BottomSheetContent>
      </BottomSheetPortal>
    </BottomSheet>
  );
}

// --- Controlled ---

function ControlledExample() {
  const [open, setOpen] = useState(false);
  const [snapIndex, setSnapIndex] = useState(-1);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-neutral-500">
        External state: open=<code className="font-mono">{String(open)}</code>,
        snapIndex=<code className="font-mono">{snapIndex}</code>
      </p>
      <BottomSheet
        value={open}
        onChange={(state) => {
          setOpen(state.open);
          setSnapIndex(state.snapIndex);
        }}
      >
        <BottomSheetTrigger className="self-start px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg">
          Open sheet
        </BottomSheetTrigger>
        <BottomSheetPortal>
          <BottomSheetOverlay />
          <BottomSheetContent className="p-6 flex flex-col gap-4">
            <BottomSheetHandle />
            <p className="font-semibold">Controlled</p>
            <p className="text-sm text-neutral-500">
              Parent owns the state. onChange fires with (nextState, action).
            </p>
            <button
              onClick={() => setOpen(false)}
              className="self-start px-4 py-2 border rounded-lg text-sm"
            >
              Close externally
            </button>
          </BottomSheetContent>
        </BottomSheetPortal>
      </BottomSheet>
    </div>
  );
}

// --- stateReducer: prevent close ---

function PreventCloseExample() {
  const [locked, setLocked] = useState(false);

  function stateReducer(
    state: BottomSheetState,
    action: BottomSheetAction
  ): BottomSheetState {
    if (action.type === "close" && locked) return state;
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
    <BottomSheet stateReducer={stateReducer}>
      <BottomSheetTrigger className="self-start px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg">
        Open sheet
      </BottomSheetTrigger>
      <BottomSheetPortal>
        <BottomSheetOverlay />
        <BottomSheetContent className="p-6 flex flex-col gap-4">
          <BottomSheetHandle />
          <p className="font-semibold">stateReducer</p>
          <p className="text-sm text-neutral-500">
            When locked, clicking the overlay or close button does nothing.
            The consumer intercepts the <code>close</code> action.
          </p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={locked}
              onChange={(e) => setLocked(e.target.checked)}
            />
            Lock (prevent close)
          </label>
          <BottomSheetTrigger className="self-start px-4 py-2 border rounded-lg text-sm">
            Close
          </BottomSheetTrigger>
        </BottomSheetContent>
      </BottomSheetPortal>
    </BottomSheet>
  );
}

// --- Multi-snap: Google Maps style ---

function MultiSnapExample() {
  const [snapIndex, setSnapIndex] = useState(-1);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-neutral-500">
        Three snap points: peek (15%), half (50%), full (100%).
        Drag the handle or flick to snap. Current snapIndex:{" "}
        <code className="font-mono">{snapIndex}</code>
      </p>
      <BottomSheet
        snapPoints={[0.15, 0.5, 1]}
        defaultSnapIndex={0}
        onChange={(state) => setSnapIndex(state.snapIndex)}
      >
        <BottomSheetTrigger className="self-start px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg">
          Open sheet
        </BottomSheetTrigger>
        <BottomSheetPortal>
          <BottomSheetOverlay />
          <BottomSheetContent className="min-h-dvh">
            <BottomSheetHandle />
            <div className="p-6 flex flex-col gap-4">
              <p className="font-semibold">Google Maps-style</p>
              <p className="text-sm text-neutral-500">
                Drag the handle to peek, half, or full height. Flick down past the
                lowest snap point to dismiss.
              </p>
              <div className="flex flex-col gap-2 text-sm text-neutral-400">
                <p>0 = peek (15%)</p>
                <p>1 = half (50%)</p>
                <p>2 = full (100%)</p>
              </div>
              <div className="mt-4 space-y-2">
                {Array.from({ length: 20 }, (_, i) => (
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

// --- Shared layout ---

function Section({
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
