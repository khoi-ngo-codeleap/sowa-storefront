import { Customer } from "@/features/customer/domain/types/customer";
import {
  customerQueryVariable,
  useCustomersQuery,
} from "../domain/queries/useCustomersQuery";
import useAtomValueOptional, { EntityAtom } from "../domain/state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { useModal } from "@/features/customer/state/modal";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";

const useCount = () => {
  const countRef = useRef(0);
  countRef.current += 1;
  return countRef.current;
};

const CustomerList = () => {
  const { data: customersAtom, isPending } = useCustomersQuery(
    customerQueryVariable
  );
  const listOfCustomerAtom = useAtomValueOptional(customersAtom);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 w-full">
      {listOfCustomerAtom?.map((at, index) => (
        <CustomerCard key={index} customerAtom={at} />
      ))}
    </div>
  );
};

// still need to memo no optimization benefit from jotai
const CustomerCard: React.FC<{ customerAtom: EntityAtom<Customer> }> = ({
  customerAtom,
}) => {
  const count = useCount();
  const customer = useAtomValue(customerAtom);

  return (
    <div className="flex flex-row gap-3 border rounded-xl px-2 items-center">
      <div className="flex-1 flex items-center">
        <Link
          className="hover:text-blue-500 flex-1"
          to="/customer-playground/jotai/$customerId"
          params={{ customerId: customer.id }}
        >
          {customer.displayName}{" "}
        </Link>
        <span className="font-semibold text-orange-500">{count}</span>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="iconSm">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 rounded-lg">
            <EditCustomerContactButton customer={customer} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const EditCustomerContactButton: React.FC<{ customer: Customer }> = ({
  customer,
}) => {
  const { open } = useModal("editContact");
  const handleEditContact = () => {
    open({
      type: "editContact",
      payload: customer,
    });
  };

  return (
    <DropdownMenuItem onClick={handleEditContact}>
      <span>Edit contact information</span>
    </DropdownMenuItem>
  );
};

export { CustomerList };
