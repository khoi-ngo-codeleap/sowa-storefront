import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import useCustomerDetailQuery from "@/features/customer/hooks/useCustomerDetailQuery";

const Nav = () => {
  const router = useRouter();
  const { data: customer } = useCustomerDetailQuery();
  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" onClick={() => router.history.back()}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="font-extrabold text-2xl">{customer.displayName}</h1>
    </div>
  );
};

export default Nav;
