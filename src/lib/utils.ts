import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Composes multiple event handlers into one.
 * Each handler is called in order. Undefined handlers are safely skipped.
 *
 * @example
 * <button onClick={callAll(props.onClick, internalHandler)} />
 */
export function callAll<Args extends unknown[]>(
  ...fns: Array<((...args: Args) => unknown) | undefined>
) {
  return (...args: Args) => fns.forEach((fn) => fn?.(...args));
}
