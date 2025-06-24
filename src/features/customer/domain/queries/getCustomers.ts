import supabase from "@/api/client/supabase";
import { Customer } from "../types/customer";

interface CustomerFilters {
  state?: "ENABLED" | "DISABLED";
}

export interface GetCustomersVariable {
  filters?: CustomerFilters;
}

export const getCustomers = async ({
  filters,
}: GetCustomersVariable = {}): Promise<Customer[]> => {
  const query = supabase
    .from("customer")
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
      {
        count: "exact",
      }
    )
    .order("email", { ascending: false })
    .throwOnError();

  if (filters?.state) {
    query.eq("state", filters.state);
  }

  const { data } = await query;

  return data;
};
