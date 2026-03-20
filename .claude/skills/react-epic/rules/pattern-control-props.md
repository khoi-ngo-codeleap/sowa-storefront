---
title: Control Props Pattern
impact: CRITICAL
impactDescription: foundation pattern for all stateful components
tags: controlled, uncontrolled, state-reducer, inversion-of-control
---

## Pattern: Control Props Pattern

### The Core Idea

A component should work in two modes without separate implementations:

| Mode             | How it's detected      | Who owns the state              |
| ---------------- | ---------------------- | ------------------------------- |
| **Uncontrolled** | `value` is `undefined` | Component (internal `useState`) |
| **Controlled**   | `value` is defined     | Parent (passed as prop)         |

Same hook, same code paths. The only branch is on `isControlled`.

### Rules

1. **`onChange` always fires** — in both modes, with `(nextState, action)`. It reports "what I _would_ do if I were in charge." The parent decides what to do with it.
2. **In controlled mode**, internal state is never updated — `value` always wins.
3. **In uncontrolled mode**, internal state advances normally, and `onChange` is still called so parents can observe without controlling.
4. **`stateReducer` prop** = inversion of control. Consumers override individual transitions without rewriting the whole component.

### How Kent's `dispatchWithOnChange` maps to our `dispatch`

Kent's reference implementation:

```ts
function dispatchWithOnChange(action: ToggleAction) {
  if (!onIsControlled) {
    dispatch(action); // advance internal state
  }
  onChange?.(reducer({ ...state, on }, action), action); // always notify
}
```

Our `useControllableReducer` does the same thing internally — the `dispatch` it returns already handles both branches. You never write this logic in a component.

---

## Our Implementation

Two foundation hooks live in `src/hooks/use-controllable.ts`. **Never re-implement this logic in a component.**

### `useControllableReducer` — for named actions + complex transitions

```ts
import { useControllableReducer } from "@/hooks/use-controllable";

const [state, dispatch] = useControllableReducer({
  reducer, // component's default transitions
  stateReducer, // consumer prop — overrides transitions
  initialValue, // { open: false } etc.
  value, // defined → controlled mode
  onChange, // fires (nextState, action) in both modes
});
```

Use when: multiple action types, reset support, or you need to expose `stateReducer`.

### `useControllableState` — for simple single-value state

```ts
import { useControllableState } from "@/hooks/use-controllable";

const [open, setOpen] = useControllableState({
  initialValue: false,
  value: props.open,
  onChange: props.onOpenChange,
});
```

Use when: single boolean/value, no named actions needed.

### `callAll` — compose event handlers

```ts
import { callAll } from '@/lib/utils'

<button onClick={callAll(props.onClick, internalHandler)} />
```

Calls each handler in order. Skips `undefined` entries safely.

---

## Code Pattern: Applying to a New Component

```ts
// 1. Define State and Action types
type DrawerState  = { open: boolean }
type DrawerAction = { type: 'open' } | { type: 'close' } | { type: 'toggle' }

// 2. Write the component's default reducer
function drawerReducer(state: DrawerState, action: DrawerAction): DrawerState {
  switch (action.type) {
    case 'open':   return { open: true }
    case 'close':  return { open: false }
    case 'toggle': return { open: !state.open }
  }
}

// 3. Component hook — wires everything together
function useDrawer({
  open,
  onOpenChange,
  stateReducer,
}: {
  open?: boolean
  onOpenChange?: (state: DrawerState, action: DrawerAction) => void
  stateReducer?: (state: DrawerState, action: DrawerAction) => DrawerState
}) {
  const [state, dispatch] = useControllableReducer({
    reducer: drawerReducer,
    stateReducer,
    initialValue: { open: false },
    value: open !== undefined ? { open } : undefined,
    onChange: onOpenChange,
  })

  return {
    open: state.open,
    toggle: () => dispatch({ type: 'toggle' }),
    close:  () => dispatch({ type: 'close' }),
  }
}

// 4. Root component exposes stateReducer
function Drawer({ open, onOpenChange, stateReducer, children }: DrawerProps) {
  const ctx = useDrawer({ open, onOpenChange, stateReducer })
  return <DrawerContext.Provider value={ctx}>{children}</DrawerContext.Provider>
}
```

**Key points:**

- Map `open?: boolean` → `value?: DrawerState` before passing to `useControllableReducer`
- Always expose `stateReducer` as a prop when using `useControllableReducer`
- `onChange` signature matches `(state: DrawerState, action: DrawerAction) => void`

---

## Checklist — When Adding a New Component with State

- [ ] State defined as a typed object (`{ open: boolean }`, not a bare `boolean`)
- [ ] Actions defined as a discriminated union
- [ ] Component reducer covers all action types
- [ ] Hook uses `useControllableReducer` (complex) or `useControllableState` (simple)
- [ ] `stateReducer` exposed as a prop (if using `useControllableReducer`)
- [ ] `onChange` fires `(nextState, action)` — not just a value
- [ ] Event handlers composed with `callAll` where needed

---

## Reference

- Source material: `materials/patterns/control-props/`
- Foundation hooks: `src/hooks/use-controllable.ts`
- `callAll`: `src/lib/utils.ts`
- Reference compound component: `src/components/bottom-sheet/`
