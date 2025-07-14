import z from "zod";

export const customerContactSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  locale: z.string(),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
});

export type CustomerContactValue = z.infer<typeof customerContactSchema>;

export const customerNoteSchema = z.object({
  note: z.string().nullable(),
});
