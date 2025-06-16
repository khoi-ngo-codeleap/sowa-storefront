import { getCustomerById } from "@/apis/supabase/customer";
import { useCustomerId } from "@/providers/CustomerIdContext";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function useCustomerQuery() {
  const customerId = useCustomerId();
  return useSuspenseQuery({
    queryKey: ["customers", customerId],
    queryFn: () => getCustomerById({ id: customerId }),
  });
}
