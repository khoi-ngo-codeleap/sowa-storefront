import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, ChevronRight } from "lucide-react";

const amount = 326;

const StoreCreditCard = () => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Store credit</CardTitle>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="iconSm">
              <Pencil className="w-4 h-4 cursor-pointer" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Coming soon</p>
          </TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent>
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
