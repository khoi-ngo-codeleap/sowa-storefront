import { useMutation } from "@tanstack/react-query";
import queryClient from "@/configs/queryClient";
import { customerListQueries } from "../queries/customerQueries";
import { updateCustomer } from "../api/updateCustomer";

interface UpdateCustomerStateVariables {
  id: string;
  state: "ENABLED" | "DISABLED";
}

export default function useUpdateCustomerState() {
  return useMutation({
    meta: {
      successMsg: "Comment has been added successfully",
      errorMsg: "Opp!, something went wrong",
    },
    mutationFn: (variables: UpdateCustomerStateVariables) =>
      updateCustomer({
        id: variables.id,
        updateSet: { state: variables.state },
      }),
    onSuccess: (_data, _variables) => {
      return queryClient.invalidateQueries({
        queryKey: customerListQueries.all,
      });
    },
  });
}
