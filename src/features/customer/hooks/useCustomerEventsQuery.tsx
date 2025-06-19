import { useCustomerId } from "@/providers/CustomerIdContext";
import { useQuery } from "@tanstack/react-query";
import { customerDetailQueries } from "./queryKeyFactories";

export default function useCustomerEventsQuery() {
  const customerId = useCustomerId();
  return useQuery(customerDetailQueries.events(customerId));
}
