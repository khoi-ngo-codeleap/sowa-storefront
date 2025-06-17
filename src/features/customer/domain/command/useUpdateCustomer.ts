import { Query, useMutation } from "@tanstack/react-query";
import { updateCustomer } from "@/apis/supabase/customer";
import queryClient from "@/configs/queryClient";

export default function useUpdateCustomer() {
  return useMutation({
    meta: {
      successMsg: "Customer contact updated successfully",
      errorMsg: "Opp!, something went wrong",
    },
    mutationFn: updateCustomer,
    onSuccess: (_data, variable, _context) => {
      return queryClient.invalidateQueries({
        predicate: ({ queryKey }: Query) => queryKey.includes(variable.id) || queryKey.includes('customer-list')
      });
    },
  });
}
