import { Customer, fetchCustomer, fetchCustomers } from "@/apis/customers";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import {loadable} from "jotai/utils"

export const priceAtom = atom(0);
export const doublePriceAtom = atom((get) => get(priceAtom) * 2);

const asyncCustomerAtom = atom(fetchCustomer);
export const loadableCustomer = loadable(asyncCustomerAtom);

export const editingCustomerAtom = atom<Customer | null>(null);

export const customersAtom = atomWithQuery(() => ({
  queryKey: ["customers"],
  queryFn: fetchCustomers,
  staleTime: Infinity,
}));