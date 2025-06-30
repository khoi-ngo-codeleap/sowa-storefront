// ts-nocheck
import LoadingIndicator from "@/components/LoadingIndicator";
import CustomerDetail from "@/features/customer/pages/CustomerDetail";
import { CustomerIdContext } from "@/providers/CustomerIdContext";
import { createFileRoute, useParams, useRouter } from "@tanstack/react-router";
import QueryErrorBoundary from "@/components/QueryErrorBoundary";
import { Suspense } from "react";
import { Provider } from "jotai";
import { useQuery } from "@tanstack/react-query";
import customerQueries from "@/features/customer/domain/queries/customerQueries";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_protected/customers/$customerId")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const customerId = useParams({
    from: "/_protected/customers/$customerId",
    select: (params) => params.customerId,
  });

  const { data, isPending } = useQuery({
    ...customerQueries.list(),
    select: (customers) =>
      customers.find((customer) => customerId === customer.id),
  });

  return (
    <div>
      <Button variant="ghost" size="icon" onClick={() => router.history.back()}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );

  // return (
  //   <Provider>
  //     <CustomerIdContext value={customerId}>
  //       <QueryErrorBoundary>
  //         <Suspense fallback={<LoadingIndicator />}>
  //           <CustomerDetail />
  //         </Suspense>
  //       </QueryErrorBoundary>
  //     </CustomerIdContext>
  //   </Provider>
  // );
}
