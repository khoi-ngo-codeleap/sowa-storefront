import { useCustomerId } from "@/providers/CustomerIdContext";
import { useQuery } from "@tanstack/react-query";
import customerDetailQueryServices from "../services/customerDetailQuery";

export default function useCustomerEventsQuery() {
  const customerId = useCustomerId();
  return useQuery(customerDetailQueryServices.events(customerId));
}
