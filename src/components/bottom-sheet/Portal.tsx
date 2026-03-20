import { createPortal } from "react-dom";
import { PropsWithChildren } from "react";

export function Portal({ children }: PropsWithChildren) {
  return createPortal(children, document.body);
}
