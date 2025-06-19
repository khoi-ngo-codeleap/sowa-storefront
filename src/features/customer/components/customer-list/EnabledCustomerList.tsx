import { DataTable } from "@/components/ui/data-table";
import customerTableColumns from "./CustomerTableColumns";
import useCustomersQuery from "../../hooks/useCustomersQuery";

const EnabledCustomerList = () => {
  const { status, data: customers = [] } = useCustomersQuery({
    filters: {
      state: "ENABLED",
    },
  });

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="h-full flex items-center gap-4">
        <h1 className="font-extrabold text-2xl">All Enabled Customers</h1>
      </div>
      <DataTable
        columns={customerTableColumns}
        data={customers}
        isLoading={status === "pending"}
      />
    </div>
  );
};

export default EnabledCustomerList;
