import { QueriesObserver, useIsFetching } from "@tanstack/react-query";
import CustomerList from "../components/customer-list/CustomerList";
import DisabledCustomerList from "../components/customer-list/DisabledCustomerList";
import EnabledCustomerList from "../components/customer-list/EnabledCustomerList";
import EditCustomerContactSheet from "../components/edit-contact-sheet/EditCustomerContactSheet";

const CustomerIndex = () => {
  return (
    <div className="flex flex-col gap-4">
      <CustomerList />
      <DisabledCustomerList />
      <EnabledCustomerList />
      <EditCustomerContactSheet />
    </div>
  );
};

export default CustomerIndex;
