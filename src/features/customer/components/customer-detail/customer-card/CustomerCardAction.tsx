import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useSetAtom } from "jotai";
import useCustomerDetailQuery from "@/features/customer/domain/queries/useCustomerDetailQuery";
import { openModalAtom } from "@/features/customer/domain/state/modal";

const CustomerCardAction = () => {
  const { data: customer } = useCustomerDetailQuery();
  const editCustomer = useSetAtom(openModalAtom);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="iconSm">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 rounded-lg">
        <DropdownMenuItem
          onClick={() =>
            editCustomer({ type: "edit_contact", payload: customer })
          }
        >
          <span>Edit contact information</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <span>Manage addresses</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <span>Edit tax details</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <span>Add to company</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomerCardAction;
