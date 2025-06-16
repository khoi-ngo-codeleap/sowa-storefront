import LoadingIndicator from "@/components/LoadingIndicator";
import CustomerDetail from "@/features/customer/pages/CustomerDetail";
import { CustomerIdContext } from "@/providers/CustomerIdContext";
import { ErrorBoundary } from "@sentry/react";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_protected/customers/$customerId")({
  component: () => {
    const customerId = useParams({
      from: "/_protected/customers/$customerId",
      select: (params) => params.customerId,
    });
    const navigate = useNavigate({ from: "/customers/$customerId" });

    // 22P02: invalid uuid
    // PGRST116: user not found
    return (
      <CustomerIdContext value={customerId}>
        <ErrorBoundary
          fallback={({ error }) => {
            return (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-3">
                <div>You have encountered an error</div>
                <Button
                  variant="secondary"
                  onClick={() => navigate({ to: "/customers" })}
                >
                  Click here to reset!
                </Button>
                <pre>{JSON.stringify(error, null, 2)}</pre>
              </div>
            );
          }}
        >
          <Suspense fallback={<LoadingIndicator />}>
            <CustomerDetail />
          </Suspense>
        </ErrorBoundary>
      </CustomerIdContext>
    );
  },
});
