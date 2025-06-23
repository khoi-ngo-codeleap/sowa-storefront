import { useMutation } from "@tanstack/react-query";
import queryClient from "@/configs/queryClient";
import { updateCustomer } from "../domain/command/updateCustomer";
import customerQueries from "../domain/queries/customerQueries";

interface UpdateCustomerStateVariables {
  id: string;
  state: "ENABLED" | "DISABLED";
}

export default function useUpdateCustomerState() {
  return useMutation({
    meta: {
      successMessage: "Customer contact updated successfully",
    },
    mutationFn: (variables: UpdateCustomerStateVariables) =>
      updateCustomer({
        id: variables.id,
        updateSet: { state: variables.state },
      }),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: customerQueries.all,
      });
    },
  });
}
