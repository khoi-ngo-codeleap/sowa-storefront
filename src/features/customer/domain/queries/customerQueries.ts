import { queryOptions } from "@tanstack/react-query";
import { getCustomers, GetCustomersVariable } from "./getCustomers";
import { getCustomerById } from "./getCustomerById";
import { getCustomerEvents } from "./getCustomerEvents";
import { getCustomerLastOrder } from "./getCustomerLastOrder";

const customerQueries = {
  all: ["customers"],
  list: (variables?: GetCustomersVariable) =>
    queryOptions({
      queryKey: [...customerQueries.all, "list", variables],
      queryFn: () => getCustomers(variables),
      staleTime: 5 * 60 * 1000,
    }),
  detail: (customerId: string) =>
    queryOptions({
      queryKey: [...customerQueries.all, "detail", customerId],
      queryFn: () => getCustomerById({ id: customerId }),
    }),
  events: (customerId: string) =>
    queryOptions({
      queryKey: [...customerQueries.all, "detail", customerId, "events"],
      queryFn: () => getCustomerEvents({ id: customerId }),
    }),
  lastOrder: (customerId: string) =>
    queryOptions({
      queryKey: [...customerQueries.all, "detail", customerId, "last-order"],
      queryFn: () => getCustomerLastOrder({ id: customerId }),
    }),
};

export default customerQueries;
