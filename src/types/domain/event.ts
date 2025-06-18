
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

