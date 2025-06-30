import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import queryClient from "@/configs/queryClient";
import CustomerContactSection from "@/features/customer/components/form/CustomerContactSection";
import {
  customerContactSchema,
  CustomerContactValue,
} from "@/features/customer/components/form/schema";
import { updateCustomer } from "@/features/customer/domain/command/updateCustomer";
import { useModal, useModalState } from "@/features/customer/state/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

const EditCustomerContactSheet = () => {
  const { isOpen, close, onChange } = useModal("editContact");
  const draftCustomer = useModalState("editContact");

  console.log("draftCustomer ", draftCustomer);

  const { mutate, isPending } = useMutation({
    meta: {
      successMessage: "Customer contact updated successfully",
    },
    mutationFn: updateCustomer,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["xxx-customers"],
      });
    },
  });

  const form = useForm<CustomerContactValue>({
    defaultValues: draftCustomer
      ? {
          first_name: draftCustomer.firstName,
          last_name: draftCustomer.lastName,
          locale: draftCustomer.locale,
          email: draftCustomer.email,
          phone: draftCustomer.phone,
        }
      : undefined,
    resolver: zodResolver(customerContactSchema),
  });

  const onSubmit: SubmitHandler<CustomerContactValue> = (values) => {
    if (draftCustomer) {
      console.log(values);
      mutate(
        {
          id: draftCustomer.id,
          updateSet: {
            display_name: `${values.first_name} ${values.last_name}`,
            ...values,
          },
        },
        { onSuccess: close }
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onChange}>
      <SheetContent className="w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit customer</SheetTitle>
          <SheetDescription>
            Edit customer name, email, phone number, and default address.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CustomerContactSection />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={close} disabled={isPending}>
                  Cancel
                </Button>
                <Button disabled={isPending}>
                  {isPending && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditCustomerContactSheet;
