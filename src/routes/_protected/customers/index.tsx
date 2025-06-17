import CustomerIndex from "@/features/customer/pages/CustomerIndex";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/customers/")({
  component: CustomerIndex,
});
