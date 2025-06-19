import { queryOptions } from "@tanstack/react-query";
import { getCustomerLastOrder } from "../domain/queries/getCustomerLastOrder";
import { getCustomerById } from "../domain/queries/getCustomerById";
import { getCustomerEvents } from "../domain/queries/getCustomerEvents";
import { getCustomers, GetCustomersVariable } from "../domain/queries/getCustomers";

export const customerDetailQueries = {
  all: ["customer"],
  detail: (id: string) =>
    queryOptions({
      queryKey: [...customerDetailQueries.all, id],
      queryFn: () => getCustomerById({ id }),
    }),
  events: (id: string) =>
    queryOptions({
      queryKey: [...customerDetailQueries.all, id, "events"],
      queryFn: () => getCustomerEvents({ id }),
    }),
  lastOrder: (id: string) =>
    queryOptions({
      queryKey: [...customerDetailQueries.all, id, "last-order"],
      queryFn: () => getCustomerLastOrder({ id }),
    }),
};

/**
 * if we have tenantId for each query just pass it to the query key like
 * list: (tenantId: string, filters?: CustomerFilters) =>
 *   queryOptions({
 *     queryKey: [tenantId, ...customerListQueries.all,  filters],
 *     queryFn: () => getCustomers(tenantId, filters ?? {}),
 *   }),
 */
export const customerListQueries = {
  all: ["customer-list"],
  list: (variables?: GetCustomersVariable) =>
    queryOptions({
      queryKey: [...customerListQueries.all, variables],
      queryFn: () => getCustomers(variables),
    }),
};
