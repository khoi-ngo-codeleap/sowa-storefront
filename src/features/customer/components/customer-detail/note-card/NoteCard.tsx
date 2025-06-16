import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import useCustomerQuery from "@/features/customer/domain/queries/useCustomerQuery";
import { Pencil } from "lucide-react";

const EmptyNoteMessage = () => (
  <div className="text-muted-foreground">You can add a note here 🚀</div>
);

const NoteCard = () => {
  const { data: customer } = useCustomerQuery();
  return (
    <Card className="w-full max-w-md rounded-2xl">
      <CardContent className="px-3 py-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <CardTitle>Note</CardTitle>
          <Button variant="ghost" size="iconSm">
            <Pencil className="w-4 h-4 cursor-pointer" />
          </Button>
        </div>
        {customer.note ? <div>{customer.note}</div> : <EmptyNoteMessage />}
      </CardContent>
    </Card>
  );
};

export default NoteCard;
