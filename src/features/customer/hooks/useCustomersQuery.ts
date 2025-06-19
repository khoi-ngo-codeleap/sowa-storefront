import { useQuery } from "@tanstack/react-query";
import { customerListQueries } from "./queryKeyFactories";
import { GetCustomersVariable } from "../domain/queries/getCustomers";

export default function useCustomersQuery(variables?: GetCustomersVariable) {
  return useQuery(customerListQueries.list(variables));
}
