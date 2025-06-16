import { useCustomerId } from "@/providers/CustomerIdContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import { customerQueries } from "./customerQueries";

export default function useCustomerDetailQuery() {
  const customerId = useCustomerId();
  return useSuspenseQuery(customerQueries.detail(customerId));
}
