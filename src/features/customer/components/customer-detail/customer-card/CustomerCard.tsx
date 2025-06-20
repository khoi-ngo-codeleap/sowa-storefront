import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Globe, Mail, MapPin, Phone, XCircle } from "lucide-react";
import useCustomerDetailQuery from "@/features/customer/hooks/useCustomerDetailQuery";
import CustomerCardAction from "./CustomerCardAction";

const CustomerCard = () => {
  const { data: customer } = useCustomerDetailQuery();
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
          <h3 className="font-medium">Marketing</h3>
          {customer.marketingConsent.map(({ type, status }) => {
            const icon =
              status === "SUBSCRIBED" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              );
            const text = `${type} ${status === "SUBSCRIBED" ? "subscribed" : "not subscribed"}`;

            return (
              <div key={type} className="flex items-center gap-2 mt-1">
                {icon}
                <span className="capitalize">{text}</span>
              </div>
            );
          })}
        </div>

        <div>
          <h3 className="font-medium">Tax details</h3>
          <div className="flex items-center gap-2 mt-1">
            <span>{customer.taxExempt ? "Collected" : "Collect tax"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
