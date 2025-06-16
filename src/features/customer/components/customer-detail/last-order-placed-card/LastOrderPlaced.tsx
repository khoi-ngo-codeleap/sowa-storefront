import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderCard from "./OrderCard";

const LastOrderPlacedCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Last order placed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <OrderCard />
        <div className="flex justify-end gap-2">
          <Button variant="outline">View all orders</Button>
          <Button>Create order</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LastOrderPlacedCard;
