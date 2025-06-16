import { useSetAtom, useAtomValue } from "jotai";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { closeModalAtom, modalAtom } from "../../domain/state/modal";
import EditCustomerContactForm from "../form/EditCustomerContactForm";

const EditCustomerContactModal = () => {
  const { type, payload: draftCustomer } = useAtomValue(modalAtom);
  const closeModal = useSetAtom(closeModalAtom);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  return (
    <Dialog open={type === "edit_contact"} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit customer</DialogTitle>
        </DialogHeader>
        {type === "edit_contact" && (
          <EditCustomerContactForm value={draftCustomer} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerContactModal;
