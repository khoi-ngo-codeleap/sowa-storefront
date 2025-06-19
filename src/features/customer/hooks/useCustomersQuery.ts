import { useQuery } from "@tanstack/react-query";
import { GetCustomersVariable } from "../domain/queries/getCustomers";
import customerQueries from "../domain/queries/customerQueries";

export default function useCustomersQuery(variables?: GetCustomersVariable) {
  return useQuery(customerQueries.list(variables));
}
