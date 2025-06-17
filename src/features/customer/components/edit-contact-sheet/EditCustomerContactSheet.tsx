import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useModal, useModalState } from "../../state/modal";
import CustomerContactForm from "../form/CustomerContactForm";

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
        <CustomerContactForm customer={draftCustomer} onCompleted={close} />
      </SheetContent>
    </Sheet>
  );
};

export default EditCustomerContactSheet;
