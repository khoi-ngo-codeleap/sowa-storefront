import { useCustomerId } from "@/providers/CustomerIdContext";
import { useQuery } from "@tanstack/react-query";
import { customerDetailQueries } from "./customerQueries";

export default function useCustomerEventsQuery() {
  const customerId = useCustomerId();
  return useQuery(customerDetailQueries.events(customerId));
}
