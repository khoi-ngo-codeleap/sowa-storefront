import supabase from "@/api/client/supabase";
import { Tables } from "@/types/database.types";

interface UpdateCustomerVariable {
  id: string;
  updateSet: Partial<Tables<"customer">>;
}

export const updateCustomer = async ({
  id,
  updateSet,
}: UpdateCustomerVariable) => {
  const { data, error } = await supabase
    .from("customer")
    .update(updateSet)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};
