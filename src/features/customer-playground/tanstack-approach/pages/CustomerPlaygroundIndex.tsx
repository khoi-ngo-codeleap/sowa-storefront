import { Customer } from "@/features/customer/domain/types/customer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { useModal } from "@/features/customer/state/modal";
import { memo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import customerQueries from "@/features/customer/domain/queries/customerQueries";

const useCount = () => {
  const countRef = useRef(0);
  countRef.current += 1;
  return countRef.current;
};

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

const CustomerNewCard: React.FC<{ customer: Customer }> = memo(
  ({ customer }) => {
    const count = useCount();

    return (
      <div className="flex flex-row gap-3 border rounded-xl px-2 items-center">
        <div className="flex-1 flex items-center">
          <Link
            className="hover:text-blue-500 flex-1"
            to="/customer-playground/tanstack/$customerId"
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

export { CustomerNewList };
