import { useQuery } from "@tanstack/react-query";
import { customerListQueries } from "./customerQueries";
import { CustomerFilters } from "@/api/customer";

export default function useCustomersQuery(filters?: CustomerFilters) {
  return useQuery(customerListQueries.list(filters));
}
