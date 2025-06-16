import { useMutation } from "@tanstack/react-query";
import { updateCustomer } from "@/apis/supabase/customer";
import { customerQueries } from "../queries/customerQueries";
import queryClient from "@/configs/queryClient";

export default function useUpdateCustomer() {
  return useMutation({
    meta: {
      successMsg: "Customer contact updated successfully",
      errorMsg: "Opp!, something went wrong",// split by error code
    },
    mutationFn:updateCustomer,
    onSuccess: () => {
      return queryClient.invalidateQueries({queryKey: customerQueries.all});
    }
  });
};