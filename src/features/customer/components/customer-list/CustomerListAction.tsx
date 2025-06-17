import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Customer } from "@/types/domain";
import { Ellipsis, Loader } from "lucide-react";
import React from "react";
import useUpdateCustomerState from "../../domain/command/useUpdateCustomerState";
import { useSetAtom } from "jotai";
import { openModalAtom } from "../../domain/state/modal";

const EditCustomerContactButton: React.FC<{ customer: Customer }> = ({
  customer,
}) => {
  const openModal = useSetAtom(openModalAtom);
  const handleEditContact = () => {
    openModal({
      type: "edit_contact",
      payload: customer as any, // Using 'as any' since we're passing Customer instead of CustomerDetail
    });
  };

  return (
    <DropdownMenuItem onClick={handleEditContact}>
      <span>Edit contact information</span>
    </DropdownMenuItem>
  );
};

const ToggleCustomerStateButton: React.FC<{ customer: Customer }> = ({
  customer,
}) => {
  const { mutate, isPending } = useUpdateCustomerState();
  const handleToggleCustomerState = () => {
    mutate({
      id: customer.id,
      state: customer.state === "ENABLED" ? "DISABLED" : "ENABLED",
    });
  };
  return (
    <Button onClick={handleToggleCustomerState}>
      {isPending && <Loader className="h-4 w-4 animate-spin" />}
      {customer.state === "ENABLED" ? "Disable" : "Enable"}
    </Button>
  );
};

const CustomerListAction: React.FC<{
  customer: Customer;
}> = ({ customer }) => {
  return (
    <div className="flex gap-4 justify-end">
      <ToggleCustomerStateButton customer={customer} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="iconSm">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 rounded-lg">
          <EditCustomerContactButton customer={customer} />
          <DropdownMenuItem disabled>
            <span>Edit tax details</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <span>Add to company</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CustomerListAction;
