import CustomerPlaygroundDetail from "@/features/customer-playground/tanstack-approach/pages/CustomerPlaygroundDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/customer-playground/tanstack/$customerId"
)({
  component: CustomerPlaygroundDetail,
});
