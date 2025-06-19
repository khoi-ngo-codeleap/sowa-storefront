import { useCustomerId } from "@/providers/CustomerIdContext";
import { useQuery } from "@tanstack/react-query";
import customerQueries from "../domain/queries/customerQueries";

export default function useCustomerEventsQuery() {
  const customerId = useCustomerId();
  return useQuery(customerQueries.events(customerId));
}
