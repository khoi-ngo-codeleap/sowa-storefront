import CustomerList from "../components/customer-list/CustomerList";
import EditCustomerContactSheet from "../components/edit-contact-sheet/EditCustomerContactSheet";

const CustomerIndex = () => {
  return (
    <div className="flex flex-col gap-4">
      <CustomerList />
      <EditCustomerContactSheet />
    </div>
  );
};

export default CustomerIndex;
