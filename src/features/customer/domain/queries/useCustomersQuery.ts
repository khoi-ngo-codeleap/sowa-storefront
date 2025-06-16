import { useQuery } from "@tanstack/react-query";
import { customerQueries } from "./customerQueries";

export default function useCustomersQuery() {
  return useQuery(customerQueries.list());
}
