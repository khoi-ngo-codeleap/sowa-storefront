# React Patterns for Dummies

You built a component. It works. Now someone wants it to do something _slightly_ different, and suddenly you're drowning in props, context, and `useEffect` spaghetti. These patterns exist so you don't have to reinvent the wheel every time.

Here's when to reach for each one.

---

## "I keep passing props through 5 components that don't even use them"

**Use: [Composition](pattern-composition.md)**

Stop drilling. Pass `<ReactNode>` instead of data. The middle components become layout — they decide _where_ things go, not _what_ they are. Bonus: works great with Server Components.

---

## "My component has a bunch of related sub-parts that share state"

**Use: [Compound Components](pattern-compound-component.md)**

Think `<select>` + `<option>`. One root component owns the state, sub-components consume it via context. The consumer gets a declarative API (`<Menu>`, `<Menu.Item>`) instead of a config object with 47 props.

---

## "I have Label, Input, and Text components that appear in 10 different compound components"

**Use: [Slots](pattern-slots.md)**

Instead of creating `ToggleLabel`, `TextFieldLabel`, `ComboBoxLabel`... make one `Label` that checks a slot context for extra props. The root component says "the label slot gets `htmlFor=someId`", and any `Label` rendered inside picks it up automatically.

---

## "My hook returns props for the consumer to spread, but they keep overriding my onClick"

**Use: [Prop Getters](pattern-prop-getters.md)**

Don't return a static props object — return a _function_ that merges the consumer's handlers with yours using `callAll()`. Their `onClick` runs, then yours runs. Nobody loses.

---

## "Should the component or the parent own the state?"

**Use: [Control Props](pattern-control-props.md)**

Both. Same hook, same code path. If the parent passes `value`, they own it (controlled). If they don't, the component owns it (uncontrolled). `onChange` fires in both modes so the parent always knows what's happening.

---

## "People keep asking me to add props like `closeOnSelection` and `disableAfterN`"

**Use: [State Reducer](pattern-state-reducer.md)**

Stop adding one-off props. Accept a `reducer` prop and let the consumer intercept any state transition. They call your default reducer for the normal case and override the one thing they need. You export your reducer, they import it — no logic duplication.

---

## "I need a reset button that goes back to the initial state"

**Use: [State Initializers](pattern-state-initializers.md)**

Accept `initialX`, store it in a `useRef` (so it's stable forever), and expose a `reset()` that dispatches back to it. Don't use `key` to reset — that nukes the whole component, killing animations and effects.

---

## "My effect keeps re-running because a callback in the dependency array changes every render"

**Use: [Latest Ref](pattern-latest-ref.md)**

Store the callback in a ref, update it in a no-deps `useEffect`. Read `.current` inside your long-lived callback. The ref is stable, so effects don't re-fire. This is what `useEffectEvent` will do once it ships — until then, do it manually.

---

## How They Fit Together

These aren't competing patterns — they layer:

```
Composition          → how you structure the component tree
Compound Components  → how sub-parts share state
Slots                → how shared primitives get context-specific props
Prop Getters         → how your hook hands props to the consumer
Control Props        → who owns the state (parent or component)
State Reducer        → who controls transitions (consumer overrides)
State Initializers   → how state starts and resets
Latest Ref           → how you escape stale closures in effects
```

A real-world component like a `ComboBox` might use _all of them_. Start with the simplest pattern that solves your problem and add more only when the next requirement demands it.
