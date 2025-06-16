import { getCustomers } from "@/apis/supabase/customer";
import { useQuery } from "@tanstack/react-query";

export default function useCustomersQuery() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });
}
