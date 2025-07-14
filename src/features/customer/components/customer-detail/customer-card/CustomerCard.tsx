import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Globe, Mail, MapPin, Phone, XCircle } from "lucide-react";
import CustomerCardAction from "./CustomerCardAction";
import { useCustomerId } from "@/providers/CustomerIdContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import customerQueries from "@/features/customer/domain/queries/customerQueries";
import useRenderCount from "@/hooks/use-render-count";

const CustomerCard = () => {
  const customerId = useCustomerId();

  const { data: customer } = useSuspenseQuery({
    ...customerQueries.list(),
    select: (customers) => {
      const customer = customers.find((c) => c.id === customerId);

      if (!customer) {
        throw new Error("Customer not found");
      }

      return customer;
    },
  });

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Customer</CardTitle>
        <CustomerCardAction />
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="font-medium">Contact information</h3>
          <div className="flex items-center gap-2 mt-1">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href="mailto:jinseimelody@gmail.com"
              className="text-blue-600 hover:underline"
            >
              {customer.email}
            </a>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span>Will receive notifications in English</span>
          </div>
        </div>

        <div>
          <h3 className="font-medium">Default address</h3>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>
              {customer.firstName} {customer.lastName},{" "}
              {customer.address[0].formattedArea}
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-medium">Tax details</h3>
          <div className="flex items-center gap-2 mt-1"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
