import LoadingIndicator from "@/components/LoadingIndicator";
import CustomerDetail from "@/features/customer/pages/CustomerDetail";
import { CustomerIdContext } from "@/providers/CustomerIdContext";
import { ErrorBoundary } from "@sentry/react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/_protected/customers/$customerId")({
  component: () => {
    const customerId = useParams({
      from: "/_protected/customers/$customerId",
      select: (params) => params.customerId,
    });

    return (
      <CustomerIdContext value={customerId}>
        <ErrorBoundary
          fallback={({ error, resetError }) => (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-3">
              <div>You have encountered an error</div>
              <button onClick={resetError}>Click here to reset!</button>
            </div>
          )}
        >
          <Suspense fallback={<LoadingIndicator />}>
            <CustomerDetail />
          </Suspense>
        </ErrorBoundary>
      </CustomerIdContext>
    );
  },
});
