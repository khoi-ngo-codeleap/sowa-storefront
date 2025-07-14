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
  const { data } = await supabase
    .from("customer")
    .update(updateSet)
    .eq("id", id)
    .select(
      `
      id,
      firstName:first_name,
      lastName:last_name,
      state,
      phone,
      email,
      locale,
      displayName:display_name,
      address:customer_address(
        id,
        formattedArea:formatted_area,
        country
      ),
      orderAggregate:customer_order(id.count(), price.sum())`,
    )
    .single()
    .throwOnError();

  return data;
};
