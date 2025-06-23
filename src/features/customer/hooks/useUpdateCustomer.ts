import { useMutation } from "@tanstack/react-query";
import queryClient from "@/configs/queryClient";
import { updateCustomer } from "../domain/command/updateCustomer";
import customerQueries from "../domain/queries/customerQueries";

export default function useUpdateCustomer() {
  return useMutation({
    meta: {
      successMessage: "Customer contact updated successfully",
    },
    mutationFn: updateCustomer,
    onSuccess: (_data, _variables) => {
      return queryClient.invalidateQueries({
        queryKey: customerQueries.all,
      });
    },
  });
}
