import { DataTable } from "@/components/ui/data-table";
import useCustomersQuery from "../../hooks/useCustomersQuery";
import customerTableColumns from "./CustomerTableColumns";
import { Alert } from "@/components/ui/alert";

const CustomerList = () => {
  const { status, data: customers, error } = useCustomersQuery();

  if (error) {
    return <Alert variant="destructive">{error.message}</Alert>;
  }

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="h-full flex items-center gap-4">
        <h1 className="font-extrabold text-2xl">All Customers</h1>
      </div>
      <DataTable
        columns={customerTableColumns}
        data={customers}
        isLoading={status === "pending"}
      />
    </div>
  );
};

export default CustomerList;
