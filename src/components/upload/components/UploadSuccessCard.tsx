import { cn } from "@/lib/utils";
import {
  FileName,
  FormattedFileSize,
  UploadCard,
  UploadCardHeader,
} from "./UploadPrimitive";
import { Download, File, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

function FileIcon() {
  return (
    <div
      className={cn(
        "size-9 shrink-0 flex items-center justify-center p-1 rounded-md bg-green-100 text-green-600"
      )}
    >
      <File size={16} />
    </div>
  );
}

function DeleteButton() {
  return (
    <Button variant="ghost" size="icon">
      <Trash size={16} />
    </Button>
  );
}

function DownloadButton() {
  return (
    <Button variant="ghost" size="icon">
      <Download size={16} />
    </Button>
  );
}

export default function UploadSuccessCard() {
  return (
    <UploadCard className={cn("px-3 py-3.5")}>
      <UploadCardHeader className="flex-row items-center gap-4">
        <FileIcon />
        <div className="flex-1 flex-col">
          <FileName>not-found.png</FileName>
          <FormattedFileSize size={2241000} className="text-xs" />
        </div>
        <div className="flex items-center gap-2">
          <DownloadButton />
          <DeleteButton />
        </div>
      </UploadCardHeader>
    </UploadCard>
  );
}
