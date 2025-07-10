import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePostModal, usePostModalState } from "../states/modal";
import PostForm from "./PostForm";

const EditPostSheet = () => {
  const { isOpen, close, onChange } = usePostModal("edit");
  const draftPost = usePostModalState("edit");

  return (
    <Sheet open={isOpen} onOpenChange={onChange}>
      <SheetContent className="w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit post</SheetTitle>
          <SheetDescription>
            Edit customer name, email, phone number, and default address.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <PostForm post={draftPost} onCompleted={close} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditPostSheet;
