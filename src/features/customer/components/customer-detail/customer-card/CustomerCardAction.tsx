import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import useCustomerDetailQuery from "@/features/customer/hooks/useCustomerDetailQuery";
import { useModal } from "@/features/customer/state/modal";

const CustomerCardAction = () => {
  const { data: customer } = useCustomerDetailQuery();
  const { open } = useModal("editContact");

  const handleEditCustomer = () => {
    open({ type: "editContact", payload: customer });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="iconSm">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 rounded-lg">
        <DropdownMenuItem onClick={handleEditCustomer}>
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
