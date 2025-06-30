import CustomerPlaygroundDetail from "@/features/customer-playground/pages/CustomerPlaygroundDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/customer-playground/$customerId"
)({
  component: CustomerPlaygroundDetail,
});
