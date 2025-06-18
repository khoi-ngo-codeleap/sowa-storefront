import {
  CustomerFilters,
  getCustomerById,
  getCustomerEvents,
  getCustomerLastOrder,
  getCustomers,
} from "@/api/customer";
import { queryOptions } from "@tanstack/react-query";

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
  list: (filters?: CustomerFilters) =>
    queryOptions({
      queryKey: [...customerListQueries.all, filters],
      queryFn: () => getCustomers(filters ?? {}),
    }),
};
