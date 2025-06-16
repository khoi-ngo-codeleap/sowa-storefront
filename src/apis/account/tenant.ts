import { ITenant } from "@/types/domain";
import client from "../client";

export const getTenants = async () => {
  const response = await client.get<ITenant[]>("/account/tenants");
  return response.data;
};
