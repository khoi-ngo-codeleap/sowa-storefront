import Signin from "@/features/auth/pages/Signin";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/signin")({
  component: Signin,
});
