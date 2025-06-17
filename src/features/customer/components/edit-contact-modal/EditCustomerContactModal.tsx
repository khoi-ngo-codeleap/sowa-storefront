import { useSetAtom, useAtomValue } from "jotai";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { closeModalAtom, modalAtom } from "../../domain/state/modal";
import EditCustomerContactForm from "../form/EditCustomerContactForm";
import { DialogDescription } from "@radix-ui/react-dialog";

const EditCustomerContactModal = () => {
  const { type, payload: draftCustomer } = useAtomValue(modalAtom);
  const isOpen = type === "edit_contact";
  const closeModal = useSetAtom(closeModalAtom);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit customer</DialogTitle>
          <DialogDescription>
            Edit customer name, email, phone number, and default address.
          </DialogDescription>
        </DialogHeader>
        {isOpen && <EditCustomerContactForm value={draftCustomer} />}
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerContactModal;
