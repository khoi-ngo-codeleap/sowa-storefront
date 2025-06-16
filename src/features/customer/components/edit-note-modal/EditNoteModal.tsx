import { useSetAtom, useAtomValue } from "jotai";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { closeModalAtom, modalAtom } from "../../domain/state/modal";
import { DialogDescription } from "@radix-ui/react-dialog";
import EditCustomerNoteForm from "../form/EditCustomerNoteForm";

const EditNoteModal = () => {
  const { type, payload: draftCustomer } = useAtomValue(modalAtom);
  const closeModal = useSetAtom(closeModalAtom);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  return (
    <Dialog open={type === "edit_note"} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit note</DialogTitle>
          <DialogDescription>Edit the customer note below.</DialogDescription>
        </DialogHeader>
        {type === "edit_note" && <EditCustomerNoteForm value={draftCustomer} />}
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteModal;
