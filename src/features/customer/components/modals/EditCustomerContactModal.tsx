// Removed direct jotai imports as we're using the adapter
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomerContactForm from "../form/CustomerContactForm";
import { useModal, useModalState } from "../../state/modal";

const EditCustomerContactModal = () => {
  const { isOpen, close, onChange } = useModal("editContact");
  const draftCustomer = useModalState("editContact");

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit customer</DialogTitle>
          <DialogDescription>
            Edit customer name, email, phone number, and default address.
          </DialogDescription>
        </DialogHeader>
        <CustomerContactForm customer={draftCustomer} onCompleted={close} />
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerContactModal;
