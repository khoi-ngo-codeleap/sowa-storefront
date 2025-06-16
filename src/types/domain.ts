import { getCustomerById, getCustomers } from "@/apis/supabase/customer";

export interface ITenant {
  name: string;
  slug: string;
  setupStatus: any;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Customer = Awaited<ReturnType<typeof getCustomers>>[0];

export type CustomerDetail = Awaited<ReturnType<typeof getCustomerById>>;