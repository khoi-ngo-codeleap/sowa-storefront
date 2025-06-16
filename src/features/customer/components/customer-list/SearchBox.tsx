const SearchBox = () => {
  //   const customers = useAtomValue(customersAtom);
  //   const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  //   const setEditingCustomer = useSetAtom(editingCustomerAtom);

  //   const handleSearch = (searchText: string) => {
  //     if (!customers.isSuccess) {
  //       return;
  //     }

  //     setFilteredCustomers(
  //       searchText
  //         ? customers.data.filter((customer) =>
  //             customer.email.startsWith(searchText)
  //           )
  //         : []
  //     );
  //     setEditingCustomer(null);
  //   };

  //   const handleItemClick: CustomerListProps["onItemClick"] = (customer) => {
  //     setEditingCustomer(customer);
  //   };

  //   return (
  //     <div className="bg-red-50/20 flex flex-col gap-y-4 min-h-96">
  //       <Input
  //         placeholder="Find customer by email"
  //         onChange={(event) => handleSearch(event.target.value)}
  //       />
  //       <div className="flex flex-1">
  //         <div className="flex-1">
  //           <CustomerList
  //             customers={filteredCustomers}
  //             onItemClick={handleItemClick}
  //           />
  //         </div>
  //         <EditPanel />
  //       </div>
  //     </div>
  //   );
  return <div>Search box</div>;
};
