import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerDetail } from "@/types/domain";
import { customerContactSchema, CustomerContactValue } from "./schema";
import { Form } from "@/components/ui/form";
import { SelectOption } from "@/types/select";
import CustomerContactSection from "./CustomerContactSection";
import { useSetAtom } from "jotai";
import { closeModalAtom } from "../../domain/state/modal";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import useUpdateCustomer from "../../domain/command/useUpdateCustomer";

const localeOptions: SelectOption[] = [
  { label: "United States", value: "en-US" },
  { label: "China", value: "zh-CN" },
  { label: "Saudi Arabia", value: "ar-SA" },
  { label: "South Korea", value: "ko-KR" },
  { label: "Mexico", value: "es-MX" },
  { label: "Vietnam", value: "vi-VN" },
  { label: "United Kingdom", value: "en-GB" },
];

interface CustomerContactFormProps {
  value: CustomerDetail;
}

const EditCustomerContactForm: React.FC<CustomerContactFormProps> = ({
  value,
}) => {
  const closeModal = useSetAtom(closeModalAtom);
  const { mutate, isPending } = useUpdateCustomer();

  const form = useForm<CustomerContactValue>({
    defaultValues: value
      ? {
          first_name: value.firstName,
          last_name: value.lastName,
          locale: value.locale,
          email: value.email,
          phone: value.phone,
        }
      : undefined,
    resolver: zodResolver(customerContactSchema),
  });
  const onSubmit: SubmitHandler<CustomerContactValue> = (values) => {
    mutate(
      {
        id: value.id,
        updateSet: {
          display_name: `${values.first_name} ${values.last_name}`,
          ...values,
        },
      },
      {
        onSuccess: () => closeModal(),
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomerContactSection localeOptions={localeOptions} />
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

export default EditCustomerContactForm;
