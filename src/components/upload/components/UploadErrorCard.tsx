import { cn } from "@/lib/utils";
import { FileName, UploadCard, UploadCardHeader } from "./UploadPrimitive";
import { CircleAlert, X } from "lucide-react";

export default function UploadErrorCard() {
  return (
    <UploadCard
      className={cn("px-3 py-3.5 bg-red-100/50 border-red-200 text-red-500")}
    >
      <UploadCardHeader>
        <div className="flex flex-row items-center gap-4">
          <CircleAlert size={16} />
          <FileName className="flex-1">
            not-found.png exceeds file size limit
          </FileName>
          <X className="cursor-pointer" size={16} />
        </div>
        <div className="pl-8 text">Please update a file smaller than 5MB.</div>
      </UploadCardHeader>
    </UploadCard>
  );
}
