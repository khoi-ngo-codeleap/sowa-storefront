// ts-nocheck
import LoadingIndicator from "@/components/LoadingIndicator";
import CustomerDetail from "@/features/customer/pages/CustomerDetail";
import { CustomerIdContext } from "@/providers/CustomerIdContext";
import { createFileRoute, useParams } from "@tanstack/react-router";
import QueryErrorBoundary from "@/components/QueryErrorBoundary";
import { Suspense } from "react";
import { Provider } from "jotai";

export const Route = createFileRoute("/_protected/customers/$customerId")({
  component: RouteComponent,
});

function RouteComponent() {
  const customerId = useParams({
    from: "/_protected/customers/$customerId",
    select: (params) => params.customerId,
  });

  return (
    <Provider>
      <CustomerIdContext value={customerId}>
        <QueryErrorBoundary>
          <Suspense fallback={<LoadingIndicator />}>
            <CustomerDetail />
          </Suspense>
        </QueryErrorBoundary>
      </CustomerIdContext>
    </Provider>
  );
}
