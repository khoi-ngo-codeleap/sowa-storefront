import { useCustomerId } from "@/providers/CustomerIdContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import { customerDetailQueries } from "./queryKeyFactories";

export default function useCustomerDetailQuery() {
  const customerId = useCustomerId();
  return useSuspenseQuery(customerDetailQueries.detail(customerId));
}
