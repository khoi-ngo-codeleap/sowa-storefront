import { useMutation } from "@tanstack/react-query";
import { updateCustomerContact } from "@/apis/supabase/customer";

export const useUpdateCustomerContact = () => {
  return useMutation({
    meta: {
      successMsg: "Customer contact updated successfully",
      errorMsg: "Opp!, something went wrong",
    },
    mutationFn: updateCustomerContact,
  });
};

