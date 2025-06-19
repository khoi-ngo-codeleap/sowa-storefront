import { UnionizeEvents } from "@/types/domain/event";

export type CustomerEventPayloadMap = {
  create: never;
  update: { field: string; original: string; new: string };
  comment: { message: string };
  create_order: { orderId: string; draftOrderId: string };
  email_sent_confirming_order: {
    orderId: string;
    emailId: string;
    inviteeEmail: string;
  };
  create_note: { original: string };
  update_note: { original: string; new: string };
  credited: { credit: string };
};

export type CustomerEvent = UnionizeEvents<CustomerEventPayloadMap>;
