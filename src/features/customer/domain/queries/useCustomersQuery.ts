import { useQuery } from "@tanstack/react-query";
import { customerListQueries } from "./customerQueries";
import { CustomerFilters } from "@/apis/supabase/customer";

export default function useCustomersQuery(filters?: CustomerFilters) {
  return useQuery(customerListQueries.list(filters));
}
