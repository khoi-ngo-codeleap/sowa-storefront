import { useQuery } from "@tanstack/react-query";
import customerListQueryServices from "../services/customerListQuery";
import { GetCustomersVariable } from "../domain/queries/getCustomers";

export default function useCustomersQuery(variables?: GetCustomersVariable) {
  return useQuery(customerListQueryServices.list(variables));
}
