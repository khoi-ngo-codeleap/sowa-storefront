import { getCustomers } from "@/features/customer/domain/queries/getCustomers";
import { atomWithQuery } from "jotai-tanstack-query";
import { useMemo } from "react";
import { customerCollectionAtom } from "../state";
import { atom, useAtomValue } from "jotai";
import queryClient from "@/configs/queryClient";

interface GetCustomersVariable {
  filter: {
    state: "ENABLED" | "DISABLED";
  };
}

export const customerQueryVariable = {} as unknown as GetCustomersVariable;

export function useCustomersQuery(variable?: GetCustomersVariable) {
  const queryAtom = useMemo(
    () =>
      atomWithQuery(
        () => ({
          queryKey: ["xxx-customers", variable],
          queryFn: async () => {
            const customers = await getCustomers();
            customerCollectionAtom.mapToAtoms(customers);
            return atom((get) =>
              customers
                .map((customer) => get(customerCollectionAtom)[customer.id])
                .filter(Boolean)
            );
          },
          staleTime: Infinity,
        }),
        () => queryClient
      ),
    [variable]
  );
  return useAtomValue(queryAtom);
}
