import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types/domain";
import { DataTable } from "@/components/ui/data-table";
import { Link } from "@tanstack/react-router";
import useCustomersQuery from "../../domain/queries/useCustomersQuery";

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">
        <Link
          to="/customers/$customerId"
          params={{ customerId: row.original.id }}
        >
          {row.original.displayName}
        </Link>
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "address",
    header: "Location",
    cell: ({ row }) => {
      const [defaultAddress] = row.original.address;
      return (
        <span className="font-medium">
          {defaultAddress && defaultAddress.country}
        </span>
      );
    },
  },
  {
    accessorKey: "orders",
    header: "Orders",
    cell: ({ row }) => {
      const [aggregate] = row.original.orderAggregate;
      return <span className="font-medium">{aggregate?.count ?? 0}</span>;
    },
  },
  {
    accessorKey: "amount_spent",
    header: "Amount spent",
    cell: ({ row }) => {
      const [aggregate] = row.original.orderAggregate;
      return <span className="font-medium">{aggregate?.sum ?? 0}</span>;
    },
  },
];

const CustomerList = () => {
  const { status, data: customers = [] } = useCustomersQuery();

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="h-full flex items-center gap-4">
        <h1 className="font-extrabold text-2xl">All Customers</h1>
      </div>
      <DataTable
        columns={columns}
        data={customers}
        isLoading={status === "pending"}
      />
    </div>
  );
};

export default CustomerList;
