import { createContext, useContext } from "react";

export const CustomerIdContext = createContext<string | null>(null);
export const useCustomerId = () => {
  const context = useContext(CustomerIdContext);
  if (!context) {
    throw new Error("useCustomerId must be used within a CustomerIdProvider.");
  }
  return context;
};
