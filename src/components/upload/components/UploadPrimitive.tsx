import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import formatFileSize from "../utils/formatFileSize";

export function UploadCard({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("text-sm flex flex-col gap-4 border rounded-lg", className)}
      {...props}
    />
  );
}

export function UploadCardHeader({
  className,
  ...props
}: ComponentProps<"div">) {
  return <div className={cn("flex flex-col", className)} {...props} />;
}

export function UploadCardContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return <div className={cn(className)} {...props} />;
}

export function FormattedFileSize({
  size,
  className,
  ...props
}: Omit<ComponentProps<"span">, "children"> & { size: number }) {
  return (
    <span className={cn(className)} {...props}>
      {formatFileSize(size)}
    </span>
  );
}

export function FileName({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("font-semibold break-all", className)} {...props}></div>
  );
}
