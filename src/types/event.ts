export interface Event<T extends string, Payload> {
  id: string;
  type: T;
  payload: Payload;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

export type UnionizeEvents<PayloadMap extends Record<string, any>> = {
  [Key in keyof PayloadMap]: Key extends string
    ? Event<Key, PayloadMap[Key]>
    : unknown;
}[keyof PayloadMap];

export type EventMap = {
  create: never;
  patch: { field: string, original: string, new: string },
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

export type CustomerEvent = UnionizeEvents<{
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
}>;