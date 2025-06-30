import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CustomerContactForm from "@/features/customer/components/form/CustomerContactForm";
import { useModal, useModalState } from "@/features/customer/state/modal";

const EditCustomerContactSheetTanstack = () => {
  const { isOpen, close, onChange } = useModal("editContactNew");
  const draftCustomer = useModalState("editContactNew");

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
          <CustomerContactForm
            customer={draftCustomer}
            onCompleted={close}
            featureFlag="new"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditCustomerContactSheetTanstack;
