import { useCustomerId } from "@/providers/CustomerIdContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import customerDetailQueryServices from "../services/customerDetailQuery";

export default function useCustomerDetailQuery() {
  const customerId = useCustomerId();
  return useSuspenseQuery(customerDetailQueryServices.detail(customerId));
}
