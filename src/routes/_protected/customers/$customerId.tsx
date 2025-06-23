import LoadingIndicator from "@/components/LoadingIndicator";
import CustomerDetail from "@/features/customer/pages/CustomerDetail";
import { CustomerIdContext } from "@/providers/CustomerIdContext";
// import { ErrorBoundary } from "@sentry/react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { PropsWithChildren, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

export const Route = createFileRoute("/_protected/customers/$customerId")({
  component: RouteComponent,
});

function CustomErrorBoundary({ children }: PropsWithChildren) {
  const fallbackRender = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-4">
        <h1>
          You have encountered an error{" "}
          {"code" in error && <strong>code: {error.code}</strong>}
        </h1>
        <div className="flex items-center gap-3">
          {/* <Button
          variant="secondary"
          onClick={() => navigate({ to: "/customers" })}
        >
          Go back
        </Button> */}
          <Button onClick={() => resetErrorBoundary()}>Try again</Button>
        </div>
      </div>
    );
  };

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallbackRender={fallbackRender}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function RouteComponent() {
  const customerId = useParams({
    from: "/_protected/customers/$customerId",
    select: (params) => params.customerId,
  });

  return (
    <CustomerIdContext value={customerId}>
      <CustomErrorBoundary>
        <Suspense fallback={<LoadingIndicator />}>
          <CustomerDetail />
        </Suspense>
      </CustomErrorBoundary>
    </CustomerIdContext>
  );
}
