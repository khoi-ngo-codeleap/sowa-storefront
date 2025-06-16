import { getCustomerEvents } from "@/apis/supabase/customer";
import { useCustomerId } from "@/providers/CustomerIdContext";
import { useQuery } from "@tanstack/react-query";

export default function useCustomerEventsQuery() {
  const customerId = useCustomerId();
  return useQuery({
    queryKey: ["customers", "events", customerId],
    queryFn: () => getCustomerEvents({ id: customerId }),
  });
}
