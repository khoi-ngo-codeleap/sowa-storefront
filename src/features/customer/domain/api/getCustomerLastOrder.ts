import supabase from "@/api/client/supabase";

interface GetCustomerLastOrderVariable {
  id: string;
}

export const getCustomerLastOrder = async ({
  id,
}: GetCustomerLastOrderVariable) => {
  const { data, error } = await supabase
    .from("customer_order")
    .select(
      `
      id,
      quantity,
      price,
      tax,
      status,
      fulfilled,
      createdAt:created_at,
      product(
        name
      )`
    )
    .eq("customer_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
};
