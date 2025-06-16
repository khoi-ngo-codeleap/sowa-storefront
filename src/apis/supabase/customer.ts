import { CustomerEvent } from "@/types/event";
import supabase from "../supabase";
import { Tables } from "@/types/database.types";

export const getCustomers = async (filters: any) => {
  const { data, error } = await supabase.from("customer").select(
    `
      id,
      firstName:first_name,
      lastName:last_name,
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
  );

  if (error) throw error;

  return data;
};

type GetCustomerByIdParams = {
  id: string;
};
export const getCustomerById = async ({ id }: GetCustomerByIdParams) => {
  const { data, error } = await supabase
    .from("customer")
    .select(
      `
    id,
    email,
    firstName:first_name,
    lastName:last_name,
    locale,
    phone,
    displayName:display_name,
    rfmGroup:rfm_group,
    taxExempt:tax_exempt,
    createdAt:created_at,
    note,
    tags:customer_tag(*),
    marketingConsent:customer_marketing_consent(*),
    address:customer_address(
      id,
      formattedArea:formatted_area,
      country
    ),
    orderAggregate:customer_order(id.count(), price.sum())`
    )
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

type GetCustomerLastOrderParams = {
  id: string;
};
export const getCustomerLastOrder = async ({
  id,
}: GetCustomerLastOrderParams) => {
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

type GetCustomerEvents = {
  id: string;
};
export const getCustomerEvents = async ({ id }: GetCustomerEvents) => {
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
    `
    )
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as unknown as CustomerEvent[];
};

/**
 * update customer contact
 */
type CustomerContactSetInput = {
  id: string;
  display_name: string;
  first_name: string;
  last_name: string;
  locale: string;
  email: string;
  phone: string;
};

export const updateCustomerContact = async (input: CustomerContactSetInput) => {
  const { id, ...updateSet } = input;
  const { data, error } = await supabase
    .from("customer")
    .update(updateSet)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

type UpdateCustomerParams = {
  id: string;
  updateSet: Partial<Tables<"customer">>;
};
export const updateCustomer = async ({
  id,
  updateSet,
}: UpdateCustomerParams) => {
  const { data, error } = await supabase
    .from("customer")
    .update(updateSet)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

type AddCommentParams = {
  id: string;
  message: string;
}
export const addComment = async ({id, message}:AddCommentParams) => {
  const { data, error } = await supabase.from("customer_event").insert({
    customer_id: id,
    type: "comment",
    payload: { message },
  });

  if (error) throw error;
  return data;
};
