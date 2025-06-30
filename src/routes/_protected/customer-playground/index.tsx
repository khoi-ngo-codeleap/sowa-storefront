import CustomerPlaygroundIndex from "@/features/customer-playground/pages/CustomerPlaygroundIndex";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/customer-playground/")({
  component: CustomerPlaygroundIndex,
});
