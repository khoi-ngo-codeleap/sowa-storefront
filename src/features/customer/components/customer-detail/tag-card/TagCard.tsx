import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useCustomerDetailQuery from "@/features/customer/hooks/useCustomerDetailQuery";
import { Pencil, XIcon } from "lucide-react";
import { useMemo } from "react";

interface TagItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
}

function TagItem({ name }: TagItemProps) {
  return (
    <Badge className="py-0 pr-1 hover:bg-primary">
      {name}
      <XIcon className="cursor-pointer hover:bg-slate-300" />
    </Badge>
  );
}

const TagCard = () => {
  const { data: customer } = useCustomerDetailQuery();
  const tags = useMemo(() => {
    return customer.tags.filter((tag) => tag.enabled);
  }, [customer]);
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Tags</CardTitle>
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
        <div className="space-y-4">
          <Input />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagItem
                key={tag.tagId}
                name={tag.tagId}
                onClick={() => alert(tag.tagId)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TagCard;
