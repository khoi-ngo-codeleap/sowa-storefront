import { cn } from "@/lib/utils";
import {
  FileName,
  FormattedFileSize,
  UploadCard,
  UploadCardContent,
  UploadCardHeader,
} from "./UploadPrimitive";
import { Progress } from "@/components/ui/progress";

function UploadProgress({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <Progress value={value} className="flex-1" />
      <div className={cn("text-xs")}>{value}%</div>
    </div>
  );
}

export default function UploadingCard() {
  return (
    <UploadCard className={cn("px-3 py-3.5")}>
      <UploadCardHeader>
        <FileName>not-found.png</FileName>
        <FormattedFileSize size={2241000} className="text-xs" />
      </UploadCardHeader>
      <UploadCardContent>
        <UploadProgress value={50} />
      </UploadCardContent>
    </UploadCard>
  );
}
