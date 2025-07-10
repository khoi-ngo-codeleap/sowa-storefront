import React from "react";
import { customerContactSchema, CustomerContactValue } from "./schema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomerContactSection from "./CustomerContactSection";
import { Button } from "@/components/ui/button";
import useUpdateCustomer from "../../hooks/useUpdateCustomer";
import { Loader } from "lucide-react";

interface CustomerContactFormProps {
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    locale: string;
    email: string;
    phone: string;
  };
  onCompleted?: () => void;
}

const CustomerContactForm: React.FC<CustomerContactFormProps> = ({
  customer,
  onCompleted,
}) => {
  const { mutate: updateCustomer, isPending } = useUpdateCustomer();

  const form = useForm<CustomerContactValue>({
    defaultValues: customer
      ? {
          first_name: customer.firstName,
          last_name: customer.lastName,
          locale: customer.locale,
          email: customer.email,
          phone: customer.phone,
        }
      : undefined,
    resolver: zodResolver(customerContactSchema),
  });

  const onSubmit: SubmitHandler<CustomerContactValue> = (values) => {
    if (customer) {
      updateCustomer(
        {
          id: customer.id,
          updateSet: {
            display_name: `${values.first_name} ${values.last_name}`,
            ...values,
          },
        },
        { onSuccess: onCompleted }
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomerContactSection />
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

export default CustomerContactForm;
