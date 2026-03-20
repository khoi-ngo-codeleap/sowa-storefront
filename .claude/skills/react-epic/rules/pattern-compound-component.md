---
title: Compound Components Pattern
impact: CRITICAL
impactDescription: foundation pattern for all reusable UI components in this repo
tags: pattern, compound-components, context, implicit-state, declarative-api, radix
---

## Pattern: Compound Components Pattern

### The Core Idea

Compound components are a set of components that work together and **implicitly share state** via context. The classic analogy is HTML's `<select>` + `<option>` — the select manages which option is selected, and the options configure what's available, with no explicit state wiring by the consumer.

```tsx
// Naive API — config object, limited flexibility
<CustomSelect options={[{ value: "1", display: "Option 1" }]} />

// Compound API — declarative, extensible, composable
<Toggle>
  <ToggleOn>The button is on</ToggleOn>
  <ToggleOff>The button is off</ToggleOff>
  <ToggleButton />
</Toggle>
```

The pattern is **not** about dot-notation namespacing (`Toggle.Button`). It's about implicit state sharing between parent and child components through context.

### The Pattern

Three pieces:

1. **Root component** — owns state, provides context
2. **Context + consumer hook** — shares state implicitly, validates usage
3. **Sub-components** — consume context, render conditionally or interactively

```tsx
import { createContext, use, useState } from "react";

// 1. Context typed as Value | null, initialized to null
type ToggleValue = { on: boolean; toggle: () => void };
const ToggleContext = createContext<ToggleValue | null>(null);

// 2. Consumer hook with validation (ALWAYS do this)
function useToggle() {
  const context = use(ToggleContext);
  if (!context) {
    throw new Error(
      "Cannot find ToggleContext. All Toggle components must be rendered within <Toggle />",
    );
  }
  return context;
}

// 3. Root component — manages state, provides context
export function Toggle({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(!on);
  return <ToggleContext value={{ on, toggle }}>{children}</ToggleContext>;
}

// 4. Sub-components — consume context
export function ToggleOn({ children }: { children: React.ReactNode }) {
  const { on } = useToggle();
  return <>{on ? children : null}</>;
}

export function ToggleOff({ children }: { children: React.ReactNode }) {
  const { on } = useToggle();
  return <>{on ? null : children}</>;
}

export function ToggleButton(props: ToggleButtonProps) {
  const { on, toggle } = useToggle();
  return <Switch {...props} on={on} onClick={toggle} />;
}
```

**Consumer usage:**

```tsx
import { Toggle, ToggleOn, ToggleOff, ToggleButton } from "./toggle";

function App() {
  return (
    <Toggle>
      <ToggleOn>The button is on</ToggleOn>
      <ToggleOff>The button is off</ToggleOff>
      <ToggleButton />
    </Toggle>
  );
}
```

### Key Rules

1. **Always validate context** — never use `use(Context)!` (non-null assertion). Create a `use<Name>()` hook that throws a descriptive error if context is null. This is the single most important practice for compound components
2. **Initialize context to `null`** — `createContext<Value | null>(null)`. This forces consumers through the validated hook
3. **Root renders `children`** — the root component wraps children in the context provider, nothing more
4. **Sub-components are named exports** — export `Toggle`, `ToggleOn`, `ToggleOff`, `ToggleButton` individually. Don't attach them as properties on the root (`Toggle.On`) — named exports are easier to tree-shake and re-export
5. **Consumers compose freely** — they can add elements between sub-components, reorder them, wrap them in divs, conditionally render them. This is the whole point

### Why Not Dot Notation?

Many libraries (Radix, etc.) use `<Tabs.Root>`, `<Tabs.Content>` as a namespace convention. This is fine for consumption but:

- It conflates a namespace pattern with the compound components pattern — they're separate ideas
- Named exports are better for tree-shaking
- In this repo, we use named exports per CLAUDE.md conventions

### When to Use

- **Any component with shared internal state** — toggles, accordions, tabs, dialogs, bottom sheets, dropdowns
- **When consumers need to control layout** — the compound API lets them place sub-components anywhere within the root
- **When the config-object API gets unwieldy** — once you need `renderOption`, `renderHeader`, `disabledOptions`, etc., compound components are simpler

### When NOT to Use

- **Simple leaf components** — a Button, Input, or Badge doesn't need implicit state sharing
- **When there's no shared state** — if sub-components don't need to communicate, just use composition (see `pattern-composition.md`)

### Context Validation Pattern (Reusable)

This pattern appears in every compound component. Extract it consistently:

```tsx
const MyContext = createContext<MyValue | null>(null);

function useMy() {
  const context = use(MyContext);
  if (!context) {
    throw new Error(
      "Cannot find MyContext. All My sub-components must be rendered within <My />",
    );
  }
  return context;
}
```

- The hook is **not exported** — it's internal to the component module
- The error message names the context and tells the user exactly what to wrap with
- TypeScript narrows the return type to `MyValue` (no null), so consumers don't need assertions

### Trade-offs

- **More files/exports** — each sub-component is its own export. This is a feature (tree-shaking, discoverability) but adds surface area
- **Implicit coupling** — sub-components only work inside the root. The validation hook makes this explicit at runtime, but it's invisible at the type level
- **Context overhead** — every context consumer re-renders when context value changes. For simple toggles this is fine; for high-frequency updates, consider splitting contexts or using refs

### Checklist

- [ ] Root component creates state and provides it via context
- [ ] Context initialized to `null` with type `Value | null`
- [ ] `use<Name>()` hook validates context is not null and throws a descriptive error
- [ ] Sub-components consume context exclusively through the validated hook
- [ ] No non-null assertions (`!`) on context usage
- [ ] All components are named exports (no dot-notation attachment)
- [ ] Consumer API is declarative — sub-components can be freely composed within the root

### Reference

- Source material: `materials/patterns/compound-component/`
- Real-world examples: [Radix UI](https://www.radix-ui.com/primitives) (Tabs, Accordion, Dialog, etc.)
- Related patterns: `pattern-composition.md` (layout components), `pattern-control-props.md` (controlled/uncontrolled state)
- In this repo: `src/components/bottom-sheet/` (reference compound component implementation)
