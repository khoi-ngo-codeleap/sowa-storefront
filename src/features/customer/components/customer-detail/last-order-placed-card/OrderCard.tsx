import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import useCustomerLastOrderQuery from "@/features/customer/hooks/useCustomerLastOrderQuery";
import { SupportedFormats } from "@/lib/dayjs";
import dayjs from "dayjs";
import { CheckCircle2Icon } from "lucide-react";

const OrderCard = () => {
  const { status, data } = useCustomerLastOrderQuery();

  if (status === "error") {
    return (
      <Alert variant="error">
        <CheckCircle2Icon size={16} />
        <AlertTitle>Opp! something went wrong</AlertTitle>
        <AlertDescription>Please try gain later</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert
        variant="secondary"
        className="flex  items-center justify-center h-24"
      >
        No results.
      </Alert>
    );
  }

  return (
    <div className="rounded-lg border px-4 py-3">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <a href="#" className="text-blue-600 font-medium">
            #{data.id.split("-")[0]}
          </a>
          {data.status === "PAID" && <Badge variant="secondary">Paid</Badge>}
          {!data.fulfilled && (
            <Badge className="bg-yellow-400 text-black hover:bg-yellow-500">
              Unfulfilled
            </Badge>
          )}
        </div>
        <p className="text-lg font-semibold">
          {data.price}
          {/* {Math.trunc((data.price + data.price * data.tax) * 100) / 100}$ */}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        {dayjs(data.createdAt).local().format(SupportedFormats.DATE_AT_TIME)}{" "}
        from Draft Orders
      </p>

      {data.product && (
        <div className="flex items-center gap-4 mt-4 p-2 rounded-md">
          <img
            src="https://picsum.photos/80/80"
            alt={data.product.name}
            className="w-12 h-12 shrink-0 border rounded-md object-cover"
          />
          <div className="flex justify-between w-full">
            <p className="font-medium">{data.product.name}</p>
            <div className="text-right text-sm text-muted-foreground">
              <p>x {data.quantity}</p>
              <p>
                $
                {Math.trunc(
                  ((data.price * (1 - data.tax)) / data.quantity) * 100
                ) / 100}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
