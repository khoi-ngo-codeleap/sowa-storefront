import CustomerPlaygroundDetail from "@/features/customer-playground/jotai-approach/pages/CustomerPlaygroundDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/customer-playground/jotai/$customerId"
)({
  component: CustomerPlaygroundDetail,
});
