import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerNoteSchema } from "./schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import useUpdateCustomer from "../../hooks/useUpdateCustomer";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";

interface EditCustomerNoteFormProps {
  customer?: { id: string; note: string | null };
  onCompleted?: () => void;
}

const EditCustomerNoteForm: React.FC<EditCustomerNoteFormProps> = ({
  customer,
  onCompleted,
}) => {
  const { mutate, isPending } = useUpdateCustomer();

  const form = useForm<z.infer<typeof customerNoteSchema>>({
    defaultValues: customer
      ? {
          note: customer.note,
        }
      : undefined,
    resolver: zodResolver(customerNoteSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof customerNoteSchema>> = (
    values,
  ) => {
    if (customer) {
      mutate(
        {
          id: customer.id,
          updateSet: values,
        },
        { onSuccess: onCompleted },
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Write your notes here..."
                  className="resize-none"
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCompleted} disabled={isPending}>
            Cancel
          </Button>
          <Button disabled={isPending}>
            {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditCustomerNoteForm;
