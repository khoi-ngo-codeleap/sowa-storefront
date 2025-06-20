import dayjs from "@/lib/dayjs";
import { Card, CardContent } from "@/components/ui/card";
import useCustomerDetailQuery from "@/features/customer/hooks/useCustomerDetailQuery";

const StatsBar = () => {
  const { data: customer } = useCustomerDetailQuery();
  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="font-medium">Amount spent</p>
            <p>{customer.orderAggregate[0].sum ?? 0}</p>
          </div>
          <div>
            <p className="font-medium">Orders</p>
            <p>{customer.orderAggregate[0].count ?? 0}</p>
          </div>
          <div>
            <p className="font-medium">Customer since</p>
            <p>{dayjs(customer.createdAt).local().fromNow()}</p>
          </div>
          <div>
            <p className="font-medium">RFM group</p>
            <p>{customer.rfmGroup}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsBar;
