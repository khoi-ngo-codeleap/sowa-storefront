import { useMutation } from "@tanstack/react-query";
import { updateCustomer } from "../domain/command/updateCustomer";
import queryClient from "@/configs/queryClient";
import customerQueries from "../domain/queries/customerQueries";
import { useCustomerId } from "@/providers/CustomerIdContext";

export default function useUpdateCustomer() {
  const customerId = useCustomerId();

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
      queryClient.setQueryData(
        customerQueries.detail(customerId).queryKey,
        (customer) => {
          console.log("Updating customer list cache with new data:", data);

          console.log("Current customers:", customer);

          // const newArray = customers?.map((customer) =>
          //   customer.id === data.id ? data : customer,
          // );

          // console.log('Updated customers:', newArray);

          return data ? { ...customer, ...data } : customer;
        },
      );
    },
  });
}
