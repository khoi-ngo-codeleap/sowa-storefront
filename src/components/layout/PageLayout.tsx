import { PropsWithChildren } from "react";

export function PageHeader({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}

export function PageContent({ children }: React.PropsWithChildren) {
  return <div className="flex flex-wrap gap-4">{children}</div>;
}

export function PageWrapper({ children }: React.PropsWithChildren) {
  return (
    <div className="h-full">
      <div className="max-w-(--breakpoint-lg) mx-auto flex flex-col gap-4 py-4">
        {children}
      </div>
    </div>
  );
}
