import { useMutation } from "@tanstack/react-query";
import { setCustomerState } from "@/api/customer";
import queryClient from "@/configs/queryClient";
import { customerListQueries } from "../queries/customerQueries";

export default function useUpdateCustomerState() {
  return useMutation({
    meta: {
      successMsg: "Comment has been added successfully",
      errorMsg: "Opp!, something went wrong",
    },
    mutationFn: setCustomerState,
    onSuccess: (_data, _variables) => {
      return queryClient.invalidateQueries({
        queryKey: customerListQueries.all,
      });
    },
  });
}
