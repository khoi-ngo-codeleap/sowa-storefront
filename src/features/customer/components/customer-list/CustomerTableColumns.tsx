import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CustomerListAction from "./CustomerListAction";
import { Customer } from "../../domain/types/customer";

const customerTableColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      if (row.original.displayName === "Ivy Brown") {
        console.log("render: Ivy Brown");
      }
      return (
        <span className="font-medium">
          <Link
            to="/customers/$customerId"
            params={{ customerId: row.original.id }}
          >
            {row.original.displayName}
          </Link>
        </span>
      );
    },
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
    accessorKey: "state",
    header: "Status",
    cell: ({ row }) => {
      const variants: Record<string, string> = {
        DISABLED:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ENABLED: "bg-green-100 text-green-600 hover:bg-green-200",
      };
      return (
        <Badge className={cn("cursor-pointer", variants[row.original.state])}>
          {row.original.state}
        </Badge>
      );
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
  {
    accessorKey: "action",
    size: 160,
    header: () => <div className="text-right pr-4">Actions</div>,
    cell: ({ row }) => {
      return <CustomerListAction customer={row.original} />;
    },
  },
];

export default customerTableColumns;
