import { useMutation } from "@tanstack/react-query";
import { updateCustomer } from "../domain/command/updateCustomer";
import queryClient from "@/configs/queryClient";
import customerQueries from "../domain/queries/customerQueries";

export default function useUpdateCustomer() {
  return useMutation({
    meta: {
      successMessage: "Customer contact updated successfully",
    },
    mutationKey: ["update-customer"],
    mutationFn: updateCustomer,
    onSuccess: (data) => {
      /**
       * ✅ We can update the customer query cache quite simply and directly — it's not as hard as you might think.
       */
      queryClient.setQueryData(customerQueries.list().queryKey, (customers) =>
        customers?.map((customer) =>
          customer.id === data.id ? data : customer
        )
      );
    },
  });
}
