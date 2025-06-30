import EditCustomerContactSheet from "../components/edit-contact-sheet/EditCustomerContactSheet";
import useCustomersQuery from "../hooks/useCustomersQuery";
import { Card, CardContent } from "@/components/ui/card";
import CustomerListAction from "../components/customer-list/CustomerListAction";
import { Customer } from "../domain/types/customer";
import { PrimitiveAtom, useAtomValue } from "jotai";
import customerTableColumns from "../components/customer-list/CustomerTableColumns";
import { DataTable } from "@/components/ui/data-table";
import { useMemo } from "react";
import jotaiStore from "@/configs/jotai";

const CustomerCard: React.FC<{ customerAtom: PrimitiveAtom<Customer> }> = ({
  customerAtom,
}) => {
  const customer = useAtomValue(customerAtom);
  if (customer.displayName === "Ivy Brown") {
    console.log("render: Ivy Brown");
  }

  return (
    <Card>
      <CardContent>
        {customer.displayName}
        <CustomerListAction customer={customer} />
      </CardContent>
    </Card>
  );
};

const CustomerList = () => {
  const { status, data: customers } = useCustomersQuery();

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="h-full flex items-center gap-4">
        <h1 className="font-extrabold text-2xl">All Customers</h1>
      </div>
      {/* <DataTable
        columns={customerTableColumns}
        data={customers}
        isLoading={status === "pending"}
      /> */}
      {/* {customers && (
        <div className="flex flex-col gap-2">
          {customers?.map((customer) => (
            <CustomerCard customerAtom={customer} />
          ))}
        </div>
      )} */}
    </div>
  );
};

const CustomerIndex = () => {
  return (
    <div className="flex flex-col gap-4">
      <CustomerList />
      <EditCustomerContactSheet />
    </div>
  );
};

export default CustomerIndex;
