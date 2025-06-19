import { useMutation } from "@tanstack/react-query";
import queryClient from "@/configs/queryClient";
import { updateCustomer } from "../domain/command/updateCustomer";
import customerQueries from "../domain/queries/customerQueries";

export default function useUpdateCustomer() {
  return useMutation({
    meta: {
      successMsg: "Customer contact updated successfully",
      errorMsg: "Opp!, something went wrong",
    },
    mutationFn: updateCustomer,
    onSuccess: (_data, _variables) => {
      return queryClient.invalidateQueries({
        queryKey: customerQueries.all,
      });
    },
  });
}
