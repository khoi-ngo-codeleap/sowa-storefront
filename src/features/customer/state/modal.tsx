import { createModalSystem } from "@/factories/createModalSystem";

type CustomerModalPayloadMap = {
  editContact: {
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

export const { useModal, useModalState } =
  createModalSystem<CustomerModalPayloadMap>();
