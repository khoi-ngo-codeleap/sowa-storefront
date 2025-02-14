import { Customer } from "@/apis/customers";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { FC, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { customersAtom, editingCustomerAtom } from "@/features/customer/atoms";

export const Route = createFileRoute("/_protected/customers/")({
  component: RouteComponent,
});

type CustomerListProps = {
  customers: Customer[];
  onItemClick?: (customer: Customer) => void;
};
const CustomerList: FC<CustomerListProps> = ({ customers, onItemClick }) => {
  if (!customers.length) {
    return (
      <div className="h-12 border border-dashed flex items-center justify-center bg-red-50">
        Typing on the input above to find customer
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {customers.map((customer) => (
        <div
          key={customer.id}
          className="h-9 inline-flex items-center hover:bg-neutral-200/20 cursor-pointer px-4"
          onClick={() => onItemClick?.(customer)}
        >
          {customer.email}
        </div>
      ))}
    </div>
  );
};

const EditPanel = () => {
  const [editingCustomer, setEditingCustomer] = useAtom(editingCustomerAtom);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "Escape":
          setEditingCustomer(null);
          break;
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  if (!editingCustomer) {
    return null;
  }

  return (
    <div className="relative basis-80 bg-red-50 p-4">
      <span className="absolute right-4 bg-neutral-200 rounded-lg px-2 text-xs">
        ESC
      </span>
      <CustomerForm value={editingCustomer} onSubmit />
    </div>
  );
};

const SearchBox = () => {
  const customers = useAtomValue(customersAtom);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const setEditingCustomer = useSetAtom(editingCustomerAtom);

  const handleSearch = (searchText: string) => {
    if (!customers.isSuccess) {
      return;
    }

    setFilteredCustomers(
      searchText
        ? customers.data.filter((customer) =>
            customer.email.startsWith(searchText)
          )
        : []
    );
    setEditingCustomer(null);
  };

  const handleItemClick: CustomerListProps["onItemClick"] = (customer) => {
    setEditingCustomer(customer);
  };

  return (
    <div className="bg-red-50/20 flex flex-col gap-y-4 min-h-96">
      <Input
        placeholder="Find customer by email"
        onChange={(event) => handleSearch(event.target.value)}
      />
      <div className="flex flex-1">
        <div className="flex-1">
          <CustomerList
            customers={filteredCustomers}
            onItemClick={handleItemClick}
          />
        </div>
        <EditPanel />
      </div>
    </div>
  );
};

const formSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});
type CustomerFormValue = z.infer<typeof formSchema>;

const CustomerForm: FC<{ value?: CustomerFormValue }> = ({ value }) => {
  const form = useForm<CustomerFormValue>({
    values: value ?? {
      id: "",
      name: "",
      email: "",
    },
  });

  const onSubmit: SubmitHandler<CustomerFormValue> = (values) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input placeholder="Customer's ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer's name</FormLabel>
              <FormControl>
                <Input placeholder="e.g: Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

function RouteComponent() {
  const [{ data: customers, isPending, isError }] = useAtom(customersAtom);

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error!</div>;

  return (
    <div className="flex flex-col">
      <div className="min-h-60">
        {customers.map((customer) => (
          <div key={customer.id} className="h-9 flex items-center gap-2">
            <div className="basis-4">{customer.id}</div>
            <div className="flex-1">{customer.email}</div>
          </div>
        ))}
      </div>
      <SearchBox />
    </div>
  );
}
