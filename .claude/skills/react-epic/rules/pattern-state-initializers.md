---
title: State Initializers Pattern
impact: MEDIUM
impactDescription: enables predictable initialization and reset without unmount/remount
tags: pattern, state-initializer, reset, useRef, stability, key-prop
---

## Pattern: State Initializers

**Source:** Kent C. Dodds — Epic React workshop
**Reference materials:** `materials/patterns/state-initializers/`

### The Core Idea

A hook that accepts an initial value should also expose a **reset** function that returns state to that initial value. The catch: the initial value must be **stable** — if the caller re-renders with a different `initialX` prop, reset should still return to the _original_ value, not the new one.

| Concern | Approach |
|---------|----------|
| **Initialize** | Accept `initialX` option, pass to `useState`/`useReducer` |
| **Reset** | Dispatch a `reset` action that restores the initial state |
| **Stability** | Store initial value in a `useRef` — never update it |

### Why Not Just Use `key` to Reset?

Changing a component's `key` unmounts and remounts it, which:

- Destroys all internal state, refs, and DOM nodes
- Kills in-progress animations and transitions
- Re-fires all effects (`useEffect`, `useLayoutEffect`)
- Is a sledgehammer when you only need to reset one piece of state

A built-in reset function keeps the component mounted, so animations, transitions, and effects behave correctly.

### Implementation

```ts
import { useReducer, useRef } from 'react'

type ToggleState = { on: boolean }
type ToggleAction =
  | { type: 'toggle' }
  | { type: 'reset'; initialState: ToggleState }

function toggleReducer(state: ToggleState, action: ToggleAction) {
  switch (action.type) {
    case 'toggle': {
      return { on: !state.on }
    }
    case 'reset': {
      return action.initialState
    }
  }
}

export function useToggle({ initialOn = false } = {}) {
  // useRef ensures stability — even if initialOn changes on re-render,
  // initialState always holds the FIRST value
  const { current: initialState } = useRef<ToggleState>({ on: initialOn })
  const [state, dispatch] = useReducer(toggleReducer, initialState)
  const { on } = state

  const toggle = () => dispatch({ type: 'toggle' })
  const reset = () => dispatch({ type: 'reset', initialState })

  return { on, toggle, reset }
}
```

Key details:

- `useRef` captures the initial value on first render and never updates — this is the stability guarantee
- The `reset` action carries `initialState` so the reducer doesn't need external references
- `initialOn` changing after mount is intentionally ignored — "initial" means initial

### Usage

```tsx
function App() {
  const [initialOn, setInitialOn] = useState(true)
  const { on, toggle, reset } = useToggle({ initialOn })

  return (
    <div>
      {/* Changing initialOn does NOT affect what reset goes back to */}
      <button onClick={() => setInitialOn(o => !o)}>
        Toggle initialOn (currently {initialOn ? 'true' : 'false'})
      </button>
      <Switch on={on} onClick={toggle} />
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

### Rules

1. **Always stabilize with `useRef`** — destructure `{ current: initialState }` from `useRef` so changes to the option are ignored after first render
2. **Expose `reset` alongside the state** — if a hook accepts an initializer, consumers will eventually need to reset
3. **Use a `reset` action type** — pass `initialState` in the action payload so the reducer is pure
4. **Prefer reset over key-based remounting** — keeps animations, transitions, and effects intact
5. **Name the option `initialX`** — the `initial` prefix signals "used once, then ignored" (same convention as `useState(initialValue)`)

### Combining with Control Props

When using `useControllableReducer`, the reset action works the same way — the reducer receives `{ type: 'reset', initialState }` and the `stateReducer` prop can intercept it like any other action:

```ts
const [state, dispatch] = useControllableReducer({
  reducer: toggleReducer,  // handles 'reset' action
  stateReducer,            // consumer can override reset behavior
  initialValue: initialState,
  value,
  onChange,
})

const reset = () => dispatch({ type: 'reset', initialState })
```

### Checklist

- [ ] Initial value accepted as an option with a sensible default
- [ ] Initial value stabilized with `useRef` (never updated after first render)
- [ ] `reset` function exposed in the hook's return value
- [ ] `reset` action carries the initial state in its payload
- [ ] Reducer handles the `reset` action type
