import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerDetail } from "@/types/domain";
import { customerNoteSchema, CustomerNoteValue } from "./schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import useUpdateCustomer from "../../domain/command/useUpdateCustomer";
import { useSetAtom } from "jotai";
import { closeModalAtom } from "../../domain/state/modal";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface EditCustomerNoteFormProps {
  value: CustomerDetail;
}

const EditCustomerNoteForm: React.FC<EditCustomerNoteFormProps> = ({
  value,
}) => {
  const closeModal = useSetAtom(closeModalAtom);
  const { mutate, isPending } = useUpdateCustomer();

  const form = useForm<CustomerNoteValue>({
    defaultValues: {
      note: value.note ?? "",
    },
    resolver: zodResolver(customerNoteSchema),
  });

  const onSubmit: SubmitHandler<CustomerNoteValue> = (values) => {
    mutate(
      {
        id: value.id,
        updateSet: values,
      },
      {
        onSuccess: () => closeModal(),
      }
    );
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
                  rows={4}
                  placeholder="Write your notes here..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeModal} disabled={isPending}>
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
