---
title: Latest Ref Pattern
impact: MEDIUM
impactDescription: eliminates stale closures in effects, debounce, and subscriptions
tags: pattern, refs, closures, stale-closure, useRef, useEffect, useEffectEvent
---

## Pattern: Latest Ref Pattern

### The Core Idea

React hooks capture values via closures — every render gets its own snapshot of props and state. This is a **safer default** than class components (where `this.props` / `this.state` always pointed to the latest values, causing subtle async bugs).

But sometimes you **need** the latest value inside a long-lived callback — debounce handlers, event subscriptions, timers, or effects that shouldn't re-run when the callback changes. The Latest Ref pattern gives you an escape hatch: store the value in a ref and keep it up to date via a no-deps `useEffect`.

| Approach          | Latest value?                       | Re-runs effect?         |
| ----------------- | ----------------------------------- | ----------------------- |
| Closure (default) | No — captures render snapshot       | Yes — must list in deps |
| Latest Ref        | Yes — reads `.current` at call time | No — ref is stable      |

### The Pattern

```ts
const callbackRef = useRef(callback);
useEffect(() => {
  callbackRef.current = callback;
});

// Use callbackRef.current inside effects, memoized functions, etc.
```

**Key rules:**

1. Update the ref in a **no-dependency `useEffect`** (not in the render body) — side-effects in the function body lead to confusing bugs
2. When passing to `useMemo` or `debounce`, wrap in an **anonymous function**: `(...args) => callbackRef.current(...args)` — don't pass `callbackRef.current` directly, as that captures the value at memo time
3. The ref itself is a stable identity — safe to omit from dependency arrays

### When to Use

- **Debounced/throttled callbacks** — you want the debounced function to be stable but always call the latest handler
- **Event subscriptions in effects** — avoid tearing down and re-adding listeners on every render
- **Intervals/timers** — the callback should use the latest state without resetting the timer
- **Any effect where listing the callback in deps causes unwanted re-execution**

### When NOT to Use

- When the closure default is what you want (most of the time) — capturing a snapshot is safer for async operations like fetch-then-act
- When `useCallback` with proper deps is sufficient
- For simple event handlers on elements — closures work fine there

### Example: useDebounce

**Problem:** `useMemo(() => debounce(callback, delay), [callback, delay])` — every time `callback` changes (every render if not memoized), the debounce resets.

**Solution with Latest Ref:**

```ts
function useDebounce<Callback extends (...args: Array<unknown>) => unknown>(
  callback: Callback,
  delay: number,
) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  return useMemo(
    () => debounce((...args) => callbackRef.current(...args), delay),
    [delay],
  );
}
```

- `callback` is no longer in the `useMemo` deps — the debounced function is only recreated when `delay` changes
- The anonymous wrapper `(...args) => callbackRef.current(...args)` ensures we always call the latest version at invocation time

### Modern Alternative: useEffectEvent (React 19+)

React's `useEffectEvent` encapsulates this pattern natively:

```ts
import { useEffectEvent } from "react";

function useWindowEvent(event: string, handler: (e: Event) => void) {
  const onEvent = useEffectEvent(handler);

  useEffect(() => {
    window.addEventListener(event, onEvent);
    return () => window.removeEventListener(event, onEvent);
  }, [event]);
}
```

`useEffectEvent` creates a stable function that always calls the latest handler — same semantics as the manual ref pattern, cleaner API. **Prefer `useEffectEvent` when available; fall back to manual refs otherwise.**

### Trade-offs

- You're opting **back into** the class component default of "always latest" — be aware of the async bugs this can reintroduce (e.g., checking a condition then acting on a changed value)
- The ref update runs after render (in `useEffect`), so the value is always one render behind during the render phase itself — only access `.current` in callbacks, effects, and event handlers, never during render

### Checklist

- [ ] Ref created with `useRef(callback)`
- [ ] Ref updated in a no-dependency `useEffect`, not in the render body
- [ ] Consumers read `ref.current` inside a wrapper function, not directly as a value
- [ ] Considered whether `useEffectEvent` is available and preferable
- [ ] Confirmed that "latest value" semantics are actually needed (not just missing `useCallback`)

### Reference

- Source material: `materials/patterns/latest-ref/`
- Related: `useEffectEvent` (React 19+)
- Real-world usage: [TanStack Query](https://tanstack.com/query) uses this pattern for query/mutation functions
