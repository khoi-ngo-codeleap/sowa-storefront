import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Actions = () => {
  return (
    <div className="flex gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="items-center pr-3 rounded-lg">
            More actions <ChevronDown size={16} className="mt-px" />
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>
      <Button variant="secondary" size="icon" disabled className="rounded-lg">
        <ChevronUp size={16} />
      </Button>
      <Button variant="secondary" size="icon" disabled className="rounded-lg">
        <ChevronDown size={16} />
      </Button>
    </div>
  );
};

export default Actions;
