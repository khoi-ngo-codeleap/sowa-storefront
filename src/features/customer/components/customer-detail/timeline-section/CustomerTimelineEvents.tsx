import {
  TimelineItem,
  TimelineItemHeader,
  TimelineItemContent,
  TimelineItemContentTrigger,
} from "@/components/ui/timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CustomerEvent } from "@/features/customer/domain/types/event";
import FormattedTime from "@/components/FormattedTime";

export function CustomerCreateTimelineEvent(
  event: Extract<CustomerEvent, { type: "create" }>,
) {
  return (
    <TimelineItem>
      <TimelineItemHeader>
        <div className="mr-4">
          {event.author?.name ?? "John doe"} created this customer
        </div>
        <FormattedTime time={event.createdAt} />
      </TimelineItemHeader>
    </TimelineItem>
  );
}

export function CustomerCommentTimelineEvent(
  event: Extract<CustomerEvent, { type: "comment" }>,
) {
  return (
    <TimelineItem>
      <Card>
        <CardContent className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-muted" />
          <div className="flex-1">
            <div className="inline-flex items-center space-x-2">
              <span>{event.author?.name ?? "John doe"} </span>
              <span className="text-muted-foreground">
                <FormattedTime time={event.createdAt} />
              </span>
            </div>
            <div>{event.payload.message}</div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <Trash2 size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Coming soon</p>
            </TooltipContent>
          </Tooltip>
        </CardContent>
      </Card>
    </TimelineItem>
  );
}

export function CustomerCreateOrderTimelineEvent(
  event: Extract<CustomerEvent, { type: "create_order" }>,
) {
  return (
    <TimelineItem>
      <TimelineItemHeader>
        <div className="mr-4">
          {event.author?.name ?? "John doe"} created order{" "}
          <Badge>#{event.payload.orderId}</Badge> for this customer from draft
          order <Badge>#{event.payload.draftOrderId}</Badge>
        </div>
        <FormattedTime time={event.createdAt} />
      </TimelineItemHeader>
    </TimelineItem>
  );
}

export function CustomerEmailSentTimelineEvent(
  event: Extract<CustomerEvent, { type: "email_sent_confirming_order" }>,
) {
  return (
    <TimelineItem>
      <TimelineItemHeader>
        <div className="mr-4">
          Order Confirmation email for order{" "}
          <Badge>#{event.payload.orderId}</Badge> sent to{" "}
          {event.author?.name ?? "John doe"}
        </div>
        <FormattedTime time={event.createdAt} />
      </TimelineItemHeader>
      <TimelineItemContent>
        <Button variant="outline">View email</Button>
      </TimelineItemContent>
    </TimelineItem>
  );
}

export function CustomerUpdateNoteTimelineEvent(
  event: Extract<CustomerEvent, { type: "update_note" }>,
) {
  return (
    <TimelineItem collapsible>
      <TimelineItemHeader>
        <TimelineItemContentTrigger>
          {event.author?.name ?? "John doe"}
          {event.payload.original ? "changed" : "created"} this customer's note.
        </TimelineItemContentTrigger>
        <FormattedTime time={event.createdAt} />
      </TimelineItemHeader>
      <TimelineItemContent>
        <div className="py-2">
          <div className="font-semibold">New note:</div>
          <div>{event.payload.new}</div>
        </div>
        {event.payload.original && (
          <div>
            <div className="font-semibold">Old note:</div>
            <div>{event.payload.original}</div>
          </div>
        )}
      </TimelineItemContent>
    </TimelineItem>
  );
}

export function CustomerUpdateTimelineEvent(
  event: Extract<CustomerEvent, { type: "update" }>,
) {
  return (
    <TimelineItem>
      <TimelineItemHeader>
        {event.author?.name ?? "John doe"} changed customer's{" "}
        {event.payload.field} from {event.payload.original} to{" "}
        {event.payload.new}.
        <FormattedTime time={event.createdAt} />
      </TimelineItemHeader>
    </TimelineItem>
  );
}

export function CustomerCreditedTimelineEvent(
  event: Extract<CustomerEvent, { type: "credited" }>,
) {
  return (
    <TimelineItem>
      <TimelineItemHeader>
        <div className="mr-4">
          {event.author?.name ?? "John doe"} credited this customer ₫
          {event.payload.credit} VND in store credit.
        </div>
        <FormattedTime time={event.createdAt} />
      </TimelineItemHeader>
    </TimelineItem>
  );
}
