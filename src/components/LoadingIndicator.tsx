import { Loader } from "lucide-react";

const LoadingIndicator = () => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-3">
      <Loader className="h-4 w-4 animate-spin" />
      <span>Skeleton</span>
    </div>
  );
};

export default LoadingIndicator;
