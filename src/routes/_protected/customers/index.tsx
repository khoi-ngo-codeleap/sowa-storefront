import CustomerList from "@/features/customer/components/customer-list/CustomerList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/customers/")({
  component: CustomerList,
});
