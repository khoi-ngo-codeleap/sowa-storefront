import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronRight, Ellipsis, X } from "lucide-react";
import { PropsWithChildren, ReactElement } from "react";

const MenuItemLayout: React.FC<{
  text: string;
  icon?: ReactElement;
  action?: ReactElement;
}> = ({ text, icon, action }) => {
  return (
    <div
      className={cn(
        "relative h-10 py-1.5 px-3 flex items-center gap-2 border rounded-lg overflow-hidden hover:bg-muted",
        action && "pr-9",
      )}
    >
      {icon}
      <div className="flex-1">{text}</div>
      {action && <div className="absolute right-1.5">{action}</div>}
    </div>
  );
};

export const CloseableMenuItem: React.FC<{
  text: string;
  icon?: ReactElement;
}> = (props) => {
  const TriggerButton = (
    <Button variant="ghost" size="iconSm">
      <X />
    </Button>
  );

  return <MenuItemLayout {...props} action={TriggerButton} />;
};

export const CollapsibleMenuItem: React.FC<
  PropsWithChildren<{
    text: string;
    icon?: ReactElement;
  }>
> = ({ children, ...props }) => {
  const TriggerButton = (
    <CollapsibleTrigger asChild>
      <Button variant="ghost" size="iconSm">
        <ChevronRight />
      </Button>
    </CollapsibleTrigger>
  );

  if (!children) {
    return <MenuItemLayout {...props} action={TriggerButton} />;
  }

  return (
    <Collapsible>
      <MenuItemLayout {...props} action={TriggerButton} />
      <CollapsibleContent>
        <div className="ml-3 mt-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const DropdownItem: React.FC<
  PropsWithChildren<{
    text: string;
    icon?: ReactElement;
    items?: { key: string; text: string; onClick?: () => void }[];
  }>
> = ({ children, items, ...props }) => {
  const TriggerButton = (
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="iconSm">
        <Ellipsis />
      </Button>
    </DropdownMenuTrigger>
  );

  if (!items?.length) {
    return <MenuItemLayout {...props} action={TriggerButton} />;
  }

  return (
    <DropdownMenu>
      <MenuItemLayout {...props} action={TriggerButton} />
      <DropdownMenuContent className="w-48 rounded-lg">
        {items.map(({ key, text, onClick }) => (
          <DropdownMenuItem key={key} onClick={onClick}>
            <span>{text}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
