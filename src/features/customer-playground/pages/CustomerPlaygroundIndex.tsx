import { Customer } from "@/features/customer/domain/types/customer";
import {
  customerQueryVariable,
  useCustomersQuery,
} from "../domain/queries/useCustomersQuery";
import useAtomValueOptional, {
  customerCollectionAtom,
  EntityAtom,
} from "../domain/state";
import jotaiStore from "@/configs/jotai";
import useCustomersOriginalQuery from "@/features/customer/hooks/useCustomersQuery";
import { selectAtom } from "jotai/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import EditCustomerContactSheet from "@/features/customer/components/edit-contact-sheet/EditCustomerContactSheet";
import { useModal } from "@/features/customer/state/modal";
import { memo, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import EditCustomerContactSheetNew from "@/features/customer/components/edit-contact-sheet/EditCustomerContactSheetNew";
import { useQuery } from "@tanstack/react-query";
import customerQueries from "@/features/customer/domain/queries/customerQueries";
import { useAtom, useAtomValue } from "jotai";

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

const EditCustomerContactButtonNew: React.FC<{ customer: Customer }> = ({
  customer,
}) => {
  const { open } = useModal("editContactNew");
  const handleEditContact = () => {
    open({
      type: "editContactNew",
      payload: customer,
    });
  };

  return (
    <DropdownMenuItem onClick={handleEditContact}>
      <span>Edit contact information</span>
    </DropdownMenuItem>
  );
};

const useCount = () => {
  const countRef = useRef(0);
  countRef.current += 1;
  return countRef.current;
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
          to="/customer-playground/$customerId"
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

const CustomerNewCard: React.FC<{ customer: Customer }> = memo(
  ({ customer }) => {
    const count = useCount();

    return (
      <div className="flex flex-row gap-3 border rounded-xl px-2 items-center">
        <div className="flex-1 flex items-center">
          <Link
            className="hover:text-blue-500 flex-1"
            to="/customers/$customerId"
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
              <EditCustomerContactButtonNew customer={customer} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
);

const CustomerNewList = () => {
  const { data: customers, isPending } = useQuery(customerQueries.list());

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 w-full">
      {customers?.map((customer) => (
        <CustomerNewCard key={customer.id} customer={customer} />
      ))}
    </div>
  );
};

const CustomerPlaygroundIndex = () => {
  console.log("render: CustomerPlaygroundIndex");
  return (
    <>
      <div className="flex gap-4">
        <div className="space-y-4 flex-1">
          <h2 className="font-semibold text-xl">Current approach</h2>
          <div>
            <CustomerList />
            <EditCustomerContactSheet />
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <h2 className="font-semibold text-xl">New approach</h2>
          <div>
            <CustomerNewList />
            <EditCustomerContactSheetNew />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerPlaygroundIndex;
