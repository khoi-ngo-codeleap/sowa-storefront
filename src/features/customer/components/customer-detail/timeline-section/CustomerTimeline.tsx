import useCustomerEventsQuery from "@/features/customer/domain/queries/useCustomerEventsQuery";
import TimeLineSkeleton from "./TimeLineSkeleton";
import { Timeline } from "@/components/ui/timeline";
import {
  CustomerCommentTimelineEvent,
  CustomerCreateOrderTimelineEvent,
  CustomerCreateTimelineEvent,
  CustomerCreditedTimelineEvent,
  CustomerEmailSentTimelineEvent,
  CustomerUpdateNoteTimelineEvent,
  CustomerUpdateTimelineEvent,
} from "./CustomerTimelineEvents";

const CustomerTimeline = () => {
  const { status, data: events = [] } = useCustomerEventsQuery();

  if (status === "pending") {
    return <TimeLineSkeleton />;
  }

  return (
    <Timeline>
      {events.map((event) => {
        switch (event.type) {
          case "create":
            return <CustomerCreateTimelineEvent key={event.id} {...event} />;
          case "comment":
            return <CustomerCommentTimelineEvent key={event.id} {...event} />;
          case "create_order":
            return (
              <CustomerCreateOrderTimelineEvent key={event.id} {...event} />
            );
          case "email_sent_confirming_order":
            return <CustomerEmailSentTimelineEvent key={event.id} {...event} />;
          case "update_note":
            return (
              <CustomerUpdateNoteTimelineEvent key={event.id} {...event} />
            );
          case "credited":
            return <CustomerCreditedTimelineEvent key={event.id} {...event} />;
          case "update":
            return <CustomerUpdateTimelineEvent key={event.id} {...event} />;
          default:
            return null;
        }
      })}
    </Timeline>
  );
};

export default CustomerTimeline;
