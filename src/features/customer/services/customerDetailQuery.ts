import { queryOptions } from "@tanstack/react-query";
import { getCustomerLastOrder } from "../domain/queries/getCustomerLastOrder";
import { getCustomerById } from "../domain/queries/getCustomerById";
import { getCustomerEvents } from "../domain/queries/getCustomerEvents";

/**
 * In case need to excute all queries at the same time
 * User can invalidate the queries by using queryClient.invalidateQueries({
 *   queryKey: customerDetailQueries.all,
 * })
 */
const customerDetailQueryServices = {
  all: ["customer"],
  detail: (id: string) =>
    queryOptions({
      queryKey: [...customerDetailQueryServices.all, id],
      queryFn: () => getCustomerById({ id }),
    }),
  events: (id: string) =>
    queryOptions({
      queryKey: [...customerDetailQueryServices.all, id, "events"],
      queryFn: () => getCustomerEvents({ id }),
    }),
  lastOrder: (id: string) =>
    queryOptions({
      queryKey: [...customerDetailQueryServices.all, id, "last-order"],
      queryFn: () => getCustomerLastOrder({ id }),
    }),
};

export default customerDetailQueryServices;
