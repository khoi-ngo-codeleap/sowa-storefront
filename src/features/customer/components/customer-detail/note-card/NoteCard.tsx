import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import useCustomerDetailQuery from "@/features/customer/hooks/useCustomerDetailQuery";
import { useModal } from "@/features/customer/state/modal";
import { Pencil } from "lucide-react";

const EmptyNoteMessage = () => (
  <div className="text-muted-foreground">You can add a note here 🚀</div>
);

export default function NoteCard() {
  const { data: customer } = useCustomerDetailQuery();
  const { open } = useModal("editContact");

  const handleEditNote = () => {
    open({
      type: "editNote",
      payload: { id: customer.id, note: customer.note },
    });
  };

  if (!customer) return null;

  return (
    <Card className="w-full max-w-md rounded-2xl">
      <CardContent className="px-3 py-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <CardTitle>Note</CardTitle>
          <Button variant="ghost" size="iconSm" onClick={handleEditNote}>
            <Pencil className="w-4 h-4 cursor-pointer" />
          </Button>
        </div>
        {customer.note ? <div>{customer.note}</div> : <EmptyNoteMessage />}
      </CardContent>
    </Card>
  );
}
