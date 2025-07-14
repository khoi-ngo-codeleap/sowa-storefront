import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { FormattedFileSize } from "./UploadPrimitive";
import { DropzoneRootProps } from "react-dropzone";

export default function UploadArea(props: DropzoneRootProps) {
  return (
    <div
      className={cn(
        "w-[500px] max-w-full flex flex-col items-center gap-6 p-6",
        "bg-background border border-dashed  rounded-lg",
        "transition-all transform duration-200",
        "hover:cursor-pointer",
        // isDragActive && "bg-[var(--base-info-background)]",
        // errorMessage && "border-[var(--base-danger-border)]"
      )}
      {...props}
    >
      <div
        className={cn(
          "size-12 flex items-center justify-center p-2",
          "border rounded-md bg-card shadow-sm",
        )}
      >
        <Upload size={24} />
      </div>
      <div className="flex flex-col gap-2">
        <div className={cn("text-center text-sm font-semibold")}>
          Drop your file here or <span className="text-primary">browse</span>
        </div>
        <div
          className={cn(
            "text-center text-muted-foreground text-sm whitespace-pre",
          )}
        >
          Pick a file up to <FormattedFileSize size={50000} />
        </div>
      </div>
    </div>
  );
}
