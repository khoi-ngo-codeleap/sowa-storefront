import Signin from "@/features/auth/pages/Signin";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/signin")({
  validateSearch: searchSchema,
  component: Signin,
});
