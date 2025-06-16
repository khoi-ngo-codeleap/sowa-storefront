import { getCustomerLastOrder } from "@/apis/supabase/customer";
import { useCustomerId } from "@/providers/CustomerIdContext";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function useCustomerOrdersQuery() {
  const customerId = useCustomerId();
  return useSuspenseQuery({
    queryKey: ["customer", 'last-order', customerId],
    queryFn: () => getCustomerLastOrder({ id: customerId }),
  });
}
