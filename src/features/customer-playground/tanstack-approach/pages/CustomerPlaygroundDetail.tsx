import { createFileRoute, useParams, useRouter } from "@tanstack/react-router";
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
    from: "/_protected/customer-playground/tanstack/$customerId",
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
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
