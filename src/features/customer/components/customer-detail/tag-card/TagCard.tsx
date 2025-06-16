import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useCustomerQuery from "@/features/customer/domain/queries/useCustomerQuery";
import { Pencil, XIcon } from "lucide-react";
import { useMemo } from "react";

interface TagItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
}

function TagItem({ name, ...props }: TagItemProps) {
  return (
    <Badge className="py-0 pr-0 hover:bg-primary">
      {name}
      <Button size="iconXs" {...props}>
        <XIcon className="cursor-pointer hover:bg-slate-300" />
      </Button>
    </Badge>
  );
}

const TagCard = () => {
  const { data: customer } = useCustomerQuery();
  const tags = useMemo(() => {
    return customer.tags.filter((tag) => tag.enabled);
  }, [customer]);
  return (
    <Card className="w-full max-w-md rounded-2xl">
      <CardContent className="px-3 py-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <CardTitle>Tags</CardTitle>
          <Button variant="ghost" size="iconSm">
            <Pencil className="w-4 h-4 cursor-pointer" />
          </Button>
        </div>
        <div className="mb-1 space-y-2">
          <Input />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagItem
                key={tag.tag_id}
                name={tag.tag_id}
                onClick={() => alert("ê")}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TagCard;
