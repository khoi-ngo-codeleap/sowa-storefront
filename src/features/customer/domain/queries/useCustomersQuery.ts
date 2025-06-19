import { useQuery } from "@tanstack/react-query";
import { customerListQueries } from "./customerQueries";
import { GetCustomerVariable } from "../api/getCustomers";

export default function useCustomersQuery(filters?: GetCustomerVariable) {
  return useQuery(customerListQueries.list(filters));
}
