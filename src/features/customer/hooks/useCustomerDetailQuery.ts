import { useCustomerId } from "@/providers/CustomerIdContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import customerQueries from "../domain/queries/customerQueries";

export default function useCustomerDetailQuery() {
  const customerId = useCustomerId();
  return useSuspenseQuery(customerQueries.detail(customerId));
}
