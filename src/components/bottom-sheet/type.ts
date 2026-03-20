export type BottomSheetState = {
  open: boolean;
  snapIndex: number; // index into snapPoints; -1 = closed
};

export type BottomSheetAction =
  | { type: "open" }
  | { type: "close" }
  | { type: "toggle" }
  | { type: "snap"; snapIndex: number };
