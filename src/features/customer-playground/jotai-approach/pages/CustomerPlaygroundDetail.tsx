import { useParams, useRouter } from "@tanstack/react-router";
import useAtomValueOptional from "@/features/customer-playground/jotai-approach/domain/state";
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
    from: "/_protected/customer-playground/jotai/$customerId",
    select: (params) => params.customerId,
  });

  const { data: customersAtom, isPending } = useCustomersQuery(
    customerQueryVariable
  );
  const customerAtoms = useAtomValueOptional(customersAtom);

  const customer = useMemo(() => {
    if (!customerAtoms) return null;
    const customerAtom = customerAtoms
      ? customerAtoms.find((at) => jotaiStore.get(at)?.id === customerId)
      : null;
    return customerAtom ? jotaiStore.get(customerAtom) : null;
  }, [customerAtoms, customerId]);

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
