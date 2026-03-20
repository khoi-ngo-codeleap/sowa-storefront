---
title: Slots Pattern
impact: MEDIUM
impactDescription: enables reusable slottable components across multiple compound component sets
tags: pattern, slots, context, reusability, component-library, react-aria
---

## Pattern: Slots Pattern

### The Core Idea

Slots allow a single generic component (e.g., `Label`, `Text`, `Input`) to **take on a role** inside any compound component — without needing a dedicated compound sub-component for each combination. The root component publishes a map of slot names to props via context; slottable components look up their slot and merge those props with their own.

Think of it as: compound components share state through a **named context hook**, while slots share props through a **named prop bucket**.

```tsx
// Same Label and Text components work in both Toggle and TextField
<Toggle>
  <Label>Party mode</Label>
  <Switch />
  <Text slot="onText">Let's party</Text>
  <Text slot="offText">Sad town</Text>
</Toggle>

<TextField>
  <Label>Venue</Label>
  <Input />
</TextField>
```

`Label`, `Text`, `Input`, and `Switch` are all reusable across any compound component that provides matching slots.

### The Pattern: Three Pieces

#### 1. Slot Context + useSlotProps Hook

```tsx
import { createContext, use } from "react";

type Slots = Record<string, Record<string, unknown>>;
export const SlotContext = createContext<Slots>({});

function useSlotProps<Props>(
  props: Props & { slot?: string },
  defaultSlot?: string,
): Props {
  const slot = props.slot ?? defaultSlot;
  if (!slot) return props;

  const slots = use(SlotContext);

  // merge: slot props first, then user props (user wins on conflicts)
  return { ...slots[slot], slot, ...props } as Props;
}
```

Key details:

- Context defaults to `{}` (not `null`) — slottable components work fine without a provider, they just get no extra props
- `useSlotProps` checks for a slot name: if none, returns props unchanged (no context subscription needed)
- Merge order: slot props → slot name → user props (user can override anything)

#### 2. Slottable Components

```tsx
export function Label(
  props: React.ComponentProps<"label"> & { slot?: string },
) {
  props = useSlotProps(props, "label");
  return <label {...props} />;
}

export function Input(
  props: React.ComponentProps<"input"> & { slot?: string },
) {
  props = useSlotProps(props, "input");
  return <input {...props} />;
}

export function Text(props: React.ComponentProps<"span"> & { slot?: string }) {
  props = useSlotProps(props, "text");
  return <span {...props} />;
}
```

Each component has a **default slot** (e.g., `Label` defaults to `"label"`). The `slot` prop lets consumers override which slot to fill.

#### 3. Root Components Provide Slots

```tsx
function TextField({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  const generatedId = useId();
  id ??= generatedId;

  const slots = {
    label: { htmlFor: id },
    input: { id },
  };

  return <SlotContext value={slots}>{children}</SlotContext>;
}

function Toggle({ id, children }: { id?: string; children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  const generatedId = useId();
  id ??= generatedId;

  const slots = {
    label: { htmlFor: id },
    switch: { id, on, onClick: () => setOn(!on) },
    onText: { hidden: on ? undefined : true },
    offText: { hidden: on ? true : undefined },
  };

  return <SlotContext value={slots}>{children}</SlotContext>;
}
```

The root creates a slots object mapping slot names to prop buckets. Each slottable child looks up its slot and merges the props.

### The `slot` Prop

When a component needs to fill a non-default slot, the consumer provides a `slot` prop:

```tsx
<Text slot="onText">Let's party</Text>   // fills the "onText" slot
<Text slot="offText">Sad town</Text>      // fills the "offText" slot
```

Without the `slot` prop, `Text` would look for the `"text"` slot (its default). The `slot` prop overrides this.

### Slots vs Compound Components

| Aspect          | Compound Components                 | Slots                                    |
| --------------- | ----------------------------------- | ---------------------------------------- |
| State sharing   | Named context + validated hook      | Named prop buckets via SlotContext       |
| Component reuse | Sub-components tied to one root     | Same component works across many roots   |
| Type safety     | Strong — hook returns typed context | Weak — slot names are strings            |
| Best for        | Single component with rich state    | Component library with shared primitives |

Slots **extend** compound components — a root can use both a typed context (for complex state) and a SlotContext (for shared primitives like Label, Text).

### When to Use

- **Component library with shared primitives** — `Label`, `Text`, `Input` etc. appear in many compound components (TextField, Toggle, ComboBox, DatePicker)
- **Accessibility prop injection** — automatically wire `htmlFor`, `id`, `aria-describedby` between label and input without manual plumbing
- **When you want compound-component benefits without per-root sub-components** — avoid creating `ToggleLabel`, `TextFieldLabel`, `ComboBoxLabel` when one `Label` suffices

### When NOT to Use

- **Simple one-off compound components** — if the sub-components are specific to one root, use the compound component pattern directly (see `pattern-compound-component.md`)
- **When type safety is critical** — slot names are strings at runtime; typos aren't caught by TypeScript. Mitigate with wrapper components (see below)
- **When you only have one or two compound component sets** — the overhead of the slot infrastructure isn't worth it

### Type Safety Escape Hatch

Create thin typed wrappers for specific compound components:

```tsx
function ToggleText(
  props: React.ComponentProps<"span"> & { slot: "onText" | "offText" },
) {
  return <Text {...props} />;
}

// Usage — typos caught at compile time
<ToggleText slot="onText">Let's party</ToggleText>;
```

This narrows the `slot` type while reusing the same slottable infrastructure underneath.

### Trade-offs

- **Weak typing** — slot names are arbitrary strings; typos are silent. React Aria adds runtime validation (throws if a slot name has no matching provider) but TypeScript can't help
- **Implicit coupling** — the connection between root and child is invisible in the code. Unlike compound components where the context hook makes it explicit
- **mergeProps complexity** — the simple `{ ...slotProps, ...userProps }` spread doesn't handle merging event handlers, className, or style correctly. A real implementation needs a proper `mergeProps` utility (like React Aria's)
- **Great for libraries, overkill for apps** — most application code doesn't need this level of reuse

### Checklist

- [ ] `SlotContext` created with `createContext<Slots>({})` — empty default, not null
- [ ] `useSlotProps` hook merges slot props with user props (user wins on conflicts)
- [ ] Each slottable component accepts optional `slot?: string` prop
- [ ] Each slottable component has a sensible default slot name
- [ ] Root components provide a slots object mapping names to prop buckets
- [ ] Considered thin typed wrappers for type safety on slot names
- [ ] If doing this for real, implemented proper `mergeProps` for event handlers and classNames

### Reference

- Source material: `materials/patterns/slots/`
- Real-world implementation: [React Aria](https://react-spectrum.adobe.com/react-aria/index.html) (originator of this pattern)
- Related: `pattern-compound-component.md` (simpler alternative when components aren't shared across roots)
