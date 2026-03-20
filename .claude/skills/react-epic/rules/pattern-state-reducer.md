---
title: State Reducer Pattern
impact: CRITICAL
impactDescription: inverts control over state transitions — eliminates endless one-off props
tags: pattern, state-reducer, inversion-of-control, reducer, downshift, customization
---

## Pattern: State Reducer

### The Core Idea

Instead of adding one-off props for every behavior customization (`closeOnSelection`, `disableAfterN`, etc.), accept a **`reducer` prop** and let the consumer control what happens when actions are dispatched. The consumer's reducer replaces the internal one — they decide which state changes happen, which are blocked, and which are modified.

| Approach                                                | Scales?                                | Problem                                          |
| ------------------------------------------------------- | -------------------------------------- | ------------------------------------------------ |
| One-off props (`closeOnSelection`, `preventToggleWhen`) | No — infinite feature requests         | Every use case needs a new prop + internal logic |
| **State reducer** (`reducer` prop)                      | Yes — consumer handles their own cases | Exposes state/action types as public API         |

This is **inversion of control** applied to state management: "here's what I _would_ do — you tell me what to _actually_ do."

### Why This Exists

Kent created this pattern for Downshift after receiving endless feature requests like "add a `closeOnSelection` prop." Each request was a one-off `if` statement in the reducer. The state reducer pattern replaced all of them with a single prop that lets consumers intercept any transition.

### Implementation

#### 1. Export the default reducer

```ts
type ToggleState = { on: boolean };
type ToggleAction =
  | { type: "toggle" }
  | { type: "reset"; initialState: ToggleState };

// Exported so consumers can call it as the default case
export function toggleReducer(state: ToggleState, action: ToggleAction) {
  switch (action.type) {
    case "toggle": {
      return { on: !state.on };
    }
    case "reset": {
      return action.initialState;
    }
  }
}
```

#### 2. Accept the reducer as an option, default to the built-in one

```ts
export function useToggle({ initialOn = false, reducer = toggleReducer } = {}) {
  const { current: initialState } = useRef<ToggleState>({ on: initialOn });
  const [state, dispatch] = useReducer(reducer, initialState);
  const { on } = state;

  const toggle = () => dispatch({ type: "toggle" });
  const reset = () => dispatch({ type: "reset", initialState });

  return { on, toggle, reset, getTogglerProps, getResetterProps };
}
```

That's it — one line changes (`reducer = toggleReducer` instead of hardcoded `toggleReducer`).

#### 3. Consumer overrides specific transitions

```tsx
import { toggleReducer, useToggle } from "./toggle";

function App() {
  const [timesClicked, setTimesClicked] = useState(0);
  const clickedTooMuch = timesClicked >= 4;

  const { on, getTogglerProps, getResetterProps } = useToggle({
    reducer(state, action) {
      // Block toggles after 4 clicks
      if (action.type === "toggle" && clickedTooMuch) {
        return state; // no change
      }
      // Everything else: use default behavior
      return toggleReducer(state, action);
    },
  });

  return (
    <div>
      <Switch
        {...getTogglerProps({
          on,
          onClick: () => setTimesClicked((count) => count + 1),
        })}
      />
      {clickedTooMuch ? <div>Whoa, you clicked too much!</div> : null}
      <button {...getResetterProps({ onClick: () => setTimesClicked(0) })}>
        Reset
      </button>
    </div>
  );
}
```

Key mechanics:

- The consumer imports and calls `toggleReducer` for the default case — no logic duplication
- Only the specific transition that needs customization is intercepted
- The consumer can also _modify_ the result: call `toggleReducer` first, then override specific fields

### The "Modify, Don't Replace" Variant

For partial overrides, call the default reducer first and tweak the result:

```ts
reducer(state, action) {
  const newState = toggleReducer(state, action)
  if (action.type === 'toggle' && clickedTooMuch) {
    // Accept all other state changes, but keep `on` unchanged
    return { ...newState, on: state.on }
  }
  return newState
}
```

### Rules

1. **Accept `reducer` as an option, default to the built-in reducer** — zero config for the common case, full control when needed
2. **Export the default reducer** — consumers should call it for the default case, not re-implement your logic
3. **State and action types become public API** — renaming an action type or reshaping state is a breaking change; design these carefully
4. **Don't use this everywhere** — it's powerful but exposes internals. Use it for components with many possible behavior customizations (combobox, dropdown, toggle). For simple components, it's overkill
5. **Combine with state initializers** — the `reset` action should carry `initialState` in its payload (see `pattern-state-initializers`)

### How This Maps to Our Codebase

Our `useControllableReducer` takes this further by combining the state reducer pattern with controlled/uncontrolled support. It accepts a `stateReducer` prop that wraps the component's default reducer:

```ts
const [state, dispatch] = useControllableReducer({
  reducer: myReducer, // component's default transitions
  stateReducer, // consumer's override — the state reducer pattern
  initialValue,
  value,
  onChange,
});
```

The `stateReducer` receives the state and action just like a standalone reducer, but it's layered on top of `reducer` inside `useControllableReducer`.

### Trade-offs

- **Power vs. encapsulation** — the consumer sees your internal state shape and action types. This is intentional, but it means refactoring internals is a breaking change
- **Debugging** — when something goes wrong, the bug might be in the consumer's reducer, not yours. Clear action types help
- **Not for simple state** — if a component only has `open`/`closed`, use `useControllableState` instead. The reducer pattern shines when there are many action types

### Checklist

- [ ] Default reducer exported so consumers can call it
- [ ] Hook accepts `reducer` option defaulting to the built-in reducer
- [ ] State and action types are exported and well-named
- [ ] Action types are descriptive (`'toggle'`, `'reset'`, `'selectItem'`) — they're now public API
- [ ] Documentation shows the "call default reducer + override" pattern
