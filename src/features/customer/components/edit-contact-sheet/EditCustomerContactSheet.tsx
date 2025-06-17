import { useSetAtom, useAtomValue } from "jotai";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { closeModalAtom, modalAtom } from "../../domain/state/modal";
import EditCustomerContactForm from "../form/EditCustomerContactForm";

const EditCustomerContactSheet = () => {
  const { type, payload: customer } = useAtomValue(modalAtom);
  const isOpen = type === "edit_contact";
  const closeModal = useSetAtom(closeModalAtom);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit customer</SheetTitle>
          <SheetDescription>
            Edit customer name, email, phone number, and default address.
          </SheetDescription>
        </SheetHeader>
        {isOpen && <EditCustomerContactForm value={customer} />}
      </SheetContent>
    </Sheet>
  );
};

export default EditCustomerContactSheet;
