import { CustomerDetail } from "@/types/domain";
import { atom } from "jotai";

export type ModalType =
  | "edit_contact"
  | "manage_address"
  | "edit_marketing_setting"
  | "edit_tax";

export type ModalPayload = {
  edit_contact: CustomerDetail;
  manage_address: { id: string };
  edit_marketing_setting: { prefillCustomerId?: string };
  edit_tax: { invoiceId: string };
};

export type ModalState =
  | { type: null; payload: null }
  | {
      [K in ModalType]: {
        type: K;
        payload: ModalPayload[K];
      };
    }[ModalType];

export const modalAtom = atom<ModalState>({
  type: null,
  payload: null,
});

export const openModalAtom = atom(null, (_, set, modalState: ModalState) => {
  set(modalAtom, modalState);
});

export const closeModalAtom = atom(null, (_, set) => {
  set(modalAtom, { type: null, payload: null });
});
