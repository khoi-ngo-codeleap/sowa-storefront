import supabase from "@/api/client/supabase";
import { CustomerEvent } from "../types/event";

interface GetCustomerEventsVariable {
  id: string;
}

export const getCustomerEvents = async ({
  id,
}: GetCustomerEventsVariable): Promise<CustomerEvent[]> => {
  const { data, error } = await supabase
    .from("customer_event")
    .select(
      `
      id,
      type,
      payload,
      author:user_profile(
        id,
        name,
        email
      ),
      createdAt:created_at
    `,
    )
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as unknown as CustomerEvent[];
};
