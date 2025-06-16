import { Skeleton } from "@/components/ui/skeleton";

const TimeLineSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-10 py-10 pl-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />

          {/* Right content */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" /> {/* Name or title */}
            <Skeleton className="h-4 w-2/3" /> {/* Main message line */}
            <Skeleton className="h-4 w-1/3" /> {/* Timestamp or extra */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeLineSkeleton;
