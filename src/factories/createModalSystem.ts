import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";

// 1. Generic ModalPayload type
//    TModalMap: The consumer-defined map of modal types to their specific payload types.
type ModalPayload<TModalMap extends Record<string, unknown>> = {
  [K in keyof TModalMap]: {
    type: K;
    payload: TModalMap[K];
  };
}[keyof TModalMap];

/**
 * A factory function to create a type-safe and reusable modal state management system using Jotai.
 *
 * @returns An object containing `useModal` and `useModalState` hooks,
 * tailored to the provided `TModalMap` type.
 */
export function createModalSystem<TModalMap extends Record<string, unknown>>() {
  const activeModalAtom = atom<keyof TModalMap | null>(null);
  const modalPayloadAtom = atom<ModalPayload<TModalMap> | null>(null);

  function useModal<T extends keyof TModalMap>(type: T) {
    const [activeModal, setActiveModal] = useAtom(activeModalAtom);
    const setModalPayload = useSetAtom(modalPayloadAtom);

    const isOpen = activeModal === type;

    const close = useCallback(() => setActiveModal(null), [setActiveModal]);

    // `payload` parameter now correctly infers the type based on `type: T`
    const open = useCallback(
      (payload: { type: T; payload: TModalMap[T] }) => {
        setActiveModal(payload.type);
        setModalPayload(payload as ModalPayload<TModalMap>); // Cast needed as payload might be a specific subtype
      },
      [setActiveModal, setModalPayload]
    );

    // This is useful for UI components that have an `onOpenChange` prop (e.g., Radix Dialog)
    const onChange = useCallback(
      (openState: boolean) => {
        !openState && setActiveModal(null);
      },
      [setActiveModal]
    );

    return { isOpen, close, open, onChange };
  }

  /**
   * Hook for accessing the payload of a currently active modal.
   * Ensures type safety based on the requested modalType.
   * @param modalType The unique identifier for the modal whose payload you want to retrieve.
   * @returns The payload for the specified modal type, or `undefined` if the modal is not active or no payload is set.
   */
  function useModalState<T extends keyof TModalMap>(
    modalType: T
  ): TModalMap[T] | undefined {
    const modalPayload = useAtomValue(modalPayloadAtom);

    return useMemo(() => {
      // Check if there's a payload and if its type matches the requested modalType
      if (modalPayload && modalPayload.type === modalType) {
        // Cast `payload` to the specific type inferred from `modalType`
        return modalPayload.payload as TModalMap[T];
      }
      return undefined;
    }, [modalPayload, modalType]);
  }

  return { useModal, useModalState };
}
