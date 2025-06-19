import { queryOptions } from "@tanstack/react-query";
import {
  getCustomers,
  GetCustomersVariable,
} from "../domain/queries/getCustomers";

/**
 * if we have tenantId for each query just pass it to the query key like
 * list: (tenantId: string, filters?: CustomerFilters) =>
 *   queryOptions({
 *     queryKey: [tenantId, ...customerListQueries.all,  filters],
 *     queryFn: () => getCustomers(tenantId, filters ?? {}),
 *   }),
 */
const customerListQueryServices = {
  all: ["customer-list"],
  list: (variables?: GetCustomersVariable) =>
    queryOptions({
      queryKey: [...customerListQueryServices.all, variables],
      queryFn: () => getCustomers(variables),
    }),
};

export default customerListQueryServices;
