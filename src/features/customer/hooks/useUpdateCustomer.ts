import { Query, useMutation } from "@tanstack/react-query";
import queryClient from "@/configs/queryClient";
import { updateCustomer } from "../domain/command/updateCustomer";

export default function useUpdateCustomer() {
  return useMutation({
    meta: {
      successMsg: "Customer contact updated successfully",
      errorMsg: "Opp!, something went wrong",
    },
    mutationFn: updateCustomer,
    onSuccess: (_data, variable) => {
      return queryClient.invalidateQueries({
        predicate: ({ queryKey }: Query) =>
          queryKey.includes(variable.id) || queryKey.includes("customer-list"),
      });
    },
  });
}
