import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useModal, useModalState } from "../../state/modal";
import CustomerNoteForm from "../form/CustomerNoteForm";

const EditNoteModal = () => {
  const { isOpen, close, onChange } = useModal("editNote");
  const draftCustomer = useModalState("editNote");

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit note</DialogTitle>
          <DialogDescription>Edit the customer note below.</DialogDescription>
        </DialogHeader>
        <CustomerNoteForm customer={draftCustomer} onCompleted={close} />
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteModal;
