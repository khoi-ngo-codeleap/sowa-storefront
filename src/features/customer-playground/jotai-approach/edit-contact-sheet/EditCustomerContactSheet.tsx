import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CustomerContactForm from "@/features/customer/components/form/CustomerContactForm";
import { useModal, useModalState } from "@/features/customer/state/modal";

const EditCustomerContactSheet = () => {
  const { isOpen, close, onChange } = useModal("editContact");
  const draftCustomer = useModalState("editContact");

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
            featureFlag="old"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditCustomerContactSheet;
