import { useRef, useState } from "react";

/**
 * Foundation hook for the controlled/uncontrolled + state reducer pattern.
 *
 * Handles all the wiring so components don't re-implement it:
 * - Controlled mode: external `value` wins, internal state is not touched
 * - Uncontrolled mode: internal state is managed, seeded by `initialValue`
 * - `onChange` always fires with (nextState, action) — in both modes
 * - `stateReducer` lets consumers override how state transitions happen
 *   without rewriting the whole component (inversion of control)
 *
 * @example
 * type State  = { open: boolean }
 * type Action = { type: 'open' } | { type: 'close' } | { type: 'toggle' }
 *
 * function myReducer(state: State, action: Action): State {
 *   switch (action.type) {
 *     case 'open':   return { open: true }
 *     case 'close':  return { open: false }
 *     case 'toggle': return { open: !state.open }
 *   }
 * }
 *
 * const [state, dispatch] = useControllableReducer({
 *   reducer: myReducer,
 *   stateReducer,       // consumer prop — allows transition overrides
 *   initialValue: { open: false },
 *   value,
 *   onChange,
 * })
 */
export function useControllableReducer<State, Action>({
  reducer,
  stateReducer,
  initialValue,
  value,
  onChange,
}: {
  /** The component's default state transition logic */
  reducer: (state: State, action: Action) => State;
  /** Consumer-provided override — runs instead of reducer when provided */
  stateReducer?: (state: State, action: Action) => State;
  initialValue: State;
  /** Passing this makes the component controlled */
  value?: State;
  /** Receives (nextState, action) — fires in both controlled and uncontrolled mode */
  onChange?: (state: State, action: Action) => void;
}): [State, (action: Action) => void] {
  const { current: initialState } = useRef(initialValue);
  const [internalState, setInternalState] = useState(initialState);

  const isControlled = value !== undefined;
  const currentState = isControlled ? value : internalState;
  const effectiveReducer = stateReducer ?? reducer;

  function dispatch(action: Action) {
    const nextState = effectiveReducer(currentState, action);
    if (!isControlled) {
      setInternalState(nextState);
    }
    onChange?.(nextState, action);
  }

  return [currentState, dispatch] as const;
}

/**
 * Simplified controlled/uncontrolled hook for single-value state.
 *
 * Use this when there are no named action types — just a direct value update.
 * Delegates to `useControllableReducer` with a passthrough reducer.
 *
 * For components with complex state transitions (multiple action types,
 * reset support, consumer reducer overrides) use `useControllableReducer` directly.
 *
 * @example
 * const [open, setOpen] = useControllableState({
 *   initialValue: false,
 *   value: props.open,
 *   onChange: props.onOpenChange,
 * })
 */
export function useControllableState<T>({
  initialValue,
  value,
  onChange,
}: {
  initialValue: T;
  value?: T;
  onChange?: (value: T) => void;
}): [T, (value: T) => void] {
  return useControllableReducer<T, T>({
    reducer: (_, newValue) => newValue,
    initialValue,
    value,
    onChange: onChange ? (state) => onChange(state) : undefined,
  });
}
