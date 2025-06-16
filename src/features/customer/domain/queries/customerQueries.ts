import {
  getCustomerById,
  getCustomerEvents,
  getCustomerLastOrder,
  getCustomers,
} from "@/apis/supabase/customer";
import { queryOptions } from "@tanstack/react-query";

type CustomerFilters = {
  name: string;
};

export const customerQueries = {
  all: ["customers"],
  list: (filters?: CustomerFilters) =>
    queryOptions({
      queryKey: [...customerQueries.all, "list", filters],
      queryFn: () => getCustomers(filters ?? {}),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...customerQueries.all, "detail", id],
      queryFn: () => getCustomerById({ id }),
    }),
  events: (id: string) =>
    queryOptions({
      queryKey: [...customerQueries.all, "detail", id, "events"],
      queryFn: () => getCustomerEvents({ id }),
    }),
  lastOrder: (id: string) =>
    queryOptions({
      queryKey: [...customerQueries.all, "detail", id, "last-order"],
      queryFn: () => getCustomerLastOrder({ id }),
    }),
};
