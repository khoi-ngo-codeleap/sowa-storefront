import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Pencil, ChevronRight } from "lucide-react";

const amount = 326;

const StoreCreditCard = () => {
  return (
    <Card className="w-full max-w-md rounded-2xl">
      <CardContent className="px-3 py-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <CardTitle>Store credit</CardTitle>
          <Button variant="ghost" size="iconSm">
            <Pencil className="w-4 h-4 cursor-pointer" />
          </Button>
        </div>
        <div className="flex items-center justify-between cursor-pointer">
          <div>${amount.toLocaleString()}</div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ChevronRight className="w-4 h-4 cursor-pointer" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreCreditCard;
