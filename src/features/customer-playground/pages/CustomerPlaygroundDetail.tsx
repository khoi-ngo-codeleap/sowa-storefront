import { useParams, useRouter } from "@tanstack/react-router";
import { customerCollectionAtom } from "@/features/customer-playground/domain/state";
import { useMemo } from "react";
import jotaiStore from "@/configs/jotai";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  customerQueryVariable,
  useCustomersQuery,
} from "../domain/queries/useCustomersQuery";

const CustomerPlaygroundDetail = () => {
  const router = useRouter();
  const customerId = useParams({
    from: "/_protected/customer-playground/$customerId",
    select: (params) => params.customerId,
  });

  const { data: customersAtom, isPending } = useCustomersQuery(
    customerQueryVariable
  );

  const customer = useMemo(() => {
    const customerAtom = jotaiStore.get(customerCollectionAtom)[customerId];
    return customerAtom ? jotaiStore.get(customerAtom) : null;
  }, [customersAtom]);

  return (
    <div>
      <Button variant="ghost" size="icon" onClick={() => router.history.back()}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <pre>{JSON.stringify(customer, null, 2)}</pre>
      )}
    </div>
  );
};

export default CustomerPlaygroundDetail;
