import CustomerList from "../components/customer-list/CustomerList";
import DisabledCustomerList from "../components/customer-list/DisabledCustomerList";
import EnabledCustomerList from "../components/customer-list/EnabledCustomerList";

const CustomerIndex = () => {
  return (
    <div className="flex flex-col gap-4">
      <CustomerList />
      <DisabledCustomerList />
      <EnabledCustomerList />
    </div>
  );
};

export default CustomerIndex;
