import dayjs from "@/lib/dayjs";
import { Card, CardContent } from "@/components/ui/card";
import { useCustomerId } from "@/providers/CustomerIdContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import customerQueries from "@/features/customer/domain/queries/customerQueries";
import useRenderCount from "@/hooks/use-render-count";
import { useEffect } from "react";

const StatsBar = () => {
  // const { data: customer } = useCustomerDetailQuery();
  const customerId = useCustomerId();
  const { data: customer } = useSuspenseQuery({
    ...customerQueries.detail(customerId),
    select: (customer) => {
      return {
        orderAggregate: customer.orderAggregate,
        createdAt: customer.createdAt,
        rfmGroup: customer.rfmGroup,
      };
    },
  });
  useEffect(() => {
    console.log("customer", customerId);
  }, [customer]);

  const renderCount = useRenderCount();

  return (
    <Card className="w-full relative">
      <CardContent className="space-y-4">
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
          <div className="absolute -top-3 -right-3 h-6 w-6 bg-amber-600 text-white flex items-center justify-center rounded-full font-semibold text-sm">
            {renderCount}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsBar;
