import EditCustomerContactSheetTanstack from "../customer-playground/tanstack-approach/edit-contact-sheet/EditCustomerContactSheetTanstack";
import EditCustomerContactSheet from "./jotai-approach/edit-contact-sheet/EditCustomerContactSheet";
import { CustomerList as CustomerListJotai } from "./jotai-approach/pages/CustomerPlaygroundIndex";
import { CustomerNewList } from "./tanstack-approach/pages/CustomerPlaygroundIndex";

const CustomerPlaygroundIndex = () => {
  return (
    <>
      <div className="flex gap-4">
        <div className="space-y-4 flex-1">
          <h2 className="font-semibold text-xl">Current approach</h2>
          <div>
            <CustomerListJotai />
            <EditCustomerContactSheet />
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <h2 className="font-semibold text-xl">New approach</h2>
          <div>
            <CustomerNewList />
            <EditCustomerContactSheetTanstack />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerPlaygroundIndex;
