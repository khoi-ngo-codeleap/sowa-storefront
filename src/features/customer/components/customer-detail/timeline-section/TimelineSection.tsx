import CustomerTimeline from "./CustomerTimeline";
import CommentInput from "./CommentInput";

const TimelineSection = () => {
  return (
    <div>
      <div className="font-semibold leading-none tracking-tight mb-4">
        Timeline
      </div>
      <div>
        <CommentInput />
        <CustomerTimeline />
      </div>
    </div>
  );
};

export default TimelineSection;
