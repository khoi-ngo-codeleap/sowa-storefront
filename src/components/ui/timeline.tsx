import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleTriggerProps,
} from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import React, { createContext, PropsWithChildren, useContext } from "react";

type TimelineItemContextValue = {
  collapsible?: boolean;
};
const TimelineItemContext = createContext<TimelineItemContextValue>({});

type TimelineItemProps = PropsWithChildren<{
  collapsible?: boolean;
}>;

export const TimelineItem: React.FC<TimelineItemProps> = ({
  collapsible,
  children,
}) => {
  collapsible = ![false, undefined].includes(collapsible);
  const Slot = collapsible ? Collapsible : "div";
  return (
    <TimelineItemContext value={{ collapsible }}>
      <Slot className="text-md mb-4">{children}</Slot>
    </TimelineItemContext>
  );
};

export const TimelineItemHeader: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, className }) => {
  return (
    <div className="flex">
      <div className="relative w-4 h-4 shrink-0 rounded-md my-auto mx-8 bg-neutral-200 before:absolute before:w-2 before:h-2 before:rounded-sm before:bg-neutral-600 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2" />
      <div
        className={cn("flex-1 flex items-center justify-between", className)}
      >
        {children}
      </div>
    </div>
  );
};

export const TimelineItemContent: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, className }) => {
  const { collapsible } = useContext(TimelineItemContext);
  const Slot = collapsible ? CollapsibleContent : "div";
  return <Slot className={cn("pl-20 mt-4", className)}>{children}</Slot>;
};

export const TimelineItemContentTrigger: React.FC<CollapsibleTriggerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <CollapsibleTrigger
      className={cn("bg-transparent inline-flex items-center", className)}
      {...props}
    >
      {children} <ChevronDown className="w-4 h-4 mt-px" />
    </CollapsibleTrigger>
  );
};

export const Timeline = ({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "relative flex flex-col pt-14 *:z-10",
        "before:h-full before:w-1 before:absolute before:top-0 before:left-8 before:translate-x-1.5 before:bg-secondary",
        className
      )}
    >
      {children}
    </div>
  );
};
