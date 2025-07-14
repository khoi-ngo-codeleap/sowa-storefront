import supabase from "@/api/client/supabase";
import { CustomerDetail } from "../types/customer";

interface GetCustomerByIdVariable {
  id: string;
}

/**
 * Get a customer by ID.
 * @param {GetCustomerByIdVariable} variables
 * @returns {Promise<CustomerDetail>} The customer with the given ID.
 */

export const getCustomerById = async ({
  id,
}: GetCustomerByIdVariable): Promise<CustomerDetail> => {
  const response = await supabase
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
    tags:customer_tag(
      tagId:tag_id, 
      enabled
    ),
    marketingConsent:customer_marketing_consent(
      type,
      status
    ),
    address:customer_address(
      id,
      formattedArea:formatted_area,
      country
    ),
    orderAggregate:customer_order(id.count(), price.sum())`,
    )
    .eq("id", id)
    .single()
    .throwOnError();

  return response.data;
};
