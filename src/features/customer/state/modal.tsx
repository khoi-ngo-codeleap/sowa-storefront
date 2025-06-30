import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";

type ModalPayloadMap = {
  editContact: {
    id: string;
    firstName: string;
    lastName: string;
    locale: string;
    email: string;
    phone: string;
  };
  editContactNew: {
    id: string;
    firstName: string;
    lastName: string;
    locale: string;
    email: string;
    phone: string;
  };
  //   manageAddress: { id: string };
  //   editMarketingSetting: { prefillCustomerId?: string };
  //   editTax: { invoiceId: string };
  editNote: { id: string; note: string | null };
};

type ModalPayload = {
  [K in keyof ModalPayloadMap]: {
    type: K;
    payload: ModalPayloadMap[K];
  };
}[keyof ModalPayloadMap];

const activeModalAtom = atom<keyof ModalPayloadMap | null>(null);
const modalPayloadAtom = atom<ModalPayload | null>(null);

export function useModal<T extends keyof ModalPayloadMap>(type: T) {
  const [activeModal, setActiveModal] = useAtom(activeModalAtom);
  const setModalPayload = useSetAtom(modalPayloadAtom);

  const isOpen = activeModal === type;

  const close = useCallback(() => setActiveModal(null), []);

  const open = useCallback((payload: ModalPayload) => {
    setActiveModal(payload.type);
    setModalPayload(payload);
  }, []);

  const onChange = useCallback((open: boolean) => {
    !open && setActiveModal(null);
  }, []);

  return { isOpen, close, open, onChange };
}

export function useModalState<T extends keyof ModalPayloadMap>(
  modalType: T
): ModalPayloadMap[T] | undefined {
  const modalPayload = useAtomValue(modalPayloadAtom);

  return useMemo(() => {
    if (modalPayload && modalPayload.type === modalType) {
      return modalPayload.payload as ModalPayloadMap[T];
    }
    return undefined;
  }, [modalPayload, modalType]);
}
