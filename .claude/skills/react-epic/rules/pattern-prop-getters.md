---
title: Prop Getters Pattern
impact: CRITICAL
impactDescription: foundation pattern for composable hook APIs
tags: prop-getters, prop-collections, callAll, hook-api, accessibility
---

## Pattern: Prop Getters

### The Core Idea

A hook that manages state for a UI element should expose a **getter function** that returns the props needed for common use cases. The consumer calls the getter with their own props, and the getter **merges** them — composing event handlers, preserving accessibility attributes, and forwarding everything else.

This replaces the older "prop collections" approach (returning a static object of props) because collections break when consumers spread their own props and accidentally override internal handlers.

| Approach                    | API                                       | Problem                                         |
| --------------------------- | ----------------------------------------- | ----------------------------------------------- |
| **Prop Collection** (avoid) | `togglerProps` — static object            | Consumer's `onClick` overrides the internal one |
| **Prop Getter** (use this)  | `getTogglerProps({ onClick })` — function | Getter merges handlers with `callAll`           |

### Why Prop Collections Break

```tsx
// Prop collection — static object
const { togglerProps } = useToggle()

// Consumer's onClick OVERRIDES the internal onClick — toggle stops working
<button {...togglerProps} onClick={() => console.log('click')} />

// Reversing the order overrides the consumer's handler instead
<button onClick={() => console.log('click')} {...togglerProps} />
```

There is no safe spread order. The consumer must manually call internal handlers, leaking implementation details.

### Rules

1. **Always use getters, never collections** — return `getXProps()` functions, not `xProps` objects
2. **Merge event handlers with `callAll`** — consumer handlers and internal handlers both fire, in order
3. **Destructure known props, forward the rest** — `({ onClick, ...props })` so internal props are merged, unknown props pass through
4. **Include accessibility attributes** — `aria-checked`, `aria-expanded`, `role`, etc. should be set by the getter, not the consumer
5. **The getter is the public API** — consumers should not need to know which specific props or handlers are applied internally

### Implementation

```ts
import { callAll } from "@/lib/utils";

function getTogglerProps<Props>({
  onClick,
  ...props
}: {
  onClick?: React.ComponentProps<"button">["onClick"];
} & Props) {
  return {
    "aria-checked": on,
    onClick: callAll(onClick, toggle),
    ...props,
  };
}
```

Key mechanics:

- `onClick` is destructured so it doesn't override the internal handler via `...props`
- `callAll(onClick, toggle)` calls the consumer's handler first, then the internal one
- `...props` forwards everything else (aria-label, id, className, etc.)

### Usage by Consumers

```tsx
const { on, getTogglerProps } = useToggle()

// Simple — just spread the getter result
<Switch {...getTogglerProps({ on })} />

// With custom props — onClick is merged, not overridden
<button
  {...getTogglerProps({
    'aria-label': 'custom-button',
    onClick: () => console.info('onButtonClick'),
    id: 'custom-button-id',
  })}
>
  {on ? 'on' : 'off'}
</button>
```

### Scaling to Multiple Getters

When a hook manages multiple UI elements, expose one getter per element:

```ts
function useCombobox() {
  return {
    getInputProps, // props for the text input
    getMenuProps, // props for the dropdown menu
    getItemProps, // props for each menu item
    getToggleProps, // props for the open/close button
  };
}
```

Each getter is independent — consumers only pay for what they use. If a getter isn't needed, it isn't called and its logic doesn't run.

### Combining with Other Patterns

Prop getters compose naturally with compound components and control props:

```tsx
// Hook provides the getter
function useDrawer({ open, onOpenChange, stateReducer }) {
  const [state, dispatch] = useControllableReducer({ ... })

  function getTriggerProps<Props>({
    onClick,
    ...props
  }: { onClick?: React.ComponentProps<'button'>['onClick'] } & Props) {
    return {
      'aria-expanded': state.open,
      onClick: callAll(onClick, () => dispatch({ type: 'toggle' })),
      ...props,
    }
  }

  return { state, dispatch, getTriggerProps }
}

// Compound component sub-component uses the getter internally
function DrawerTrigger(props: React.ComponentProps<'button'>) {
  const { getTriggerProps } = useDrawerContext()
  return <button {...getTriggerProps(props)} />
}
```

---

## Checklist — When Adding Prop Getters

- [ ] Getter function named `get<Element>Props` (not a static object)
- [ ] Known event handlers destructured and merged with `callAll`
- [ ] Remaining props forwarded with `...props`
- [ ] Accessibility attributes (`aria-*`, `role`) set by the getter
- [ ] Getter is generic to accept and forward arbitrary consumer props
- [ ] `callAll` imported from `@/lib/utils` — not re-implemented

---

## Reference

- Source material: `materials/vercel-react-best-practices/props-collection-and-getter/`
- `callAll`: `src/lib/utils.ts`
- Downshift (real-world example): uses prop getters for input, menu, item, toggle
