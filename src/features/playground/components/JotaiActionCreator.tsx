import LoadingIndicator from "@/components/LoadingIndicator";
import QueryErrorBoundary from "@/components/QueryErrorBoundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import customerQueries from "@/features/customer/domain/queries/customerQueries";
import { Customer } from "@/features/customer/domain/types/customer";
import CustomerDetail from "@/features/customer/pages/CustomerDetail";
import { cn } from "@/lib/utils";
import { CustomerIdContext } from "@/providers/CustomerIdContext";
import { useQuery } from "@tanstack/react-query";
import { atom, Provider, useAtomValue, useSetAtom } from "jotai";
import { X } from "lucide-react";
import { Suspense } from "react";

export interface Tab {
  id: string;
  text: string;
}

export const createTabAtoms = () => {
  const activeTab = atom<string | null>(null);
  const tabsAtom = atom<Tab[]>([]);

  const setTabAtom = atom(null, (_get, set, tabId: string) => {
    set(activeTab, tabId);
  });

  const addTabAtom = atom(null, (get, set, newTab: Tab) => {
    const current = get(tabsAtom);
    // make sure no duplicates
    if (!current.some((tab) => tab.id === newTab.id)) {
      set(tabsAtom, [...current, newTab]);
      set(activeTab, newTab.id);
    }
  });

  const removeTabAtom = atom(null, (get, set, tabId: string) => {
    const currentTabs = get(tabsAtom);
    const currentActiveTab = get(activeTab);
    const updatedTabs = currentTabs.filter((tab) => tab.id !== tabId);

    set(tabsAtom, updatedTabs);

    if (currentActiveTab === tabId) {
      if (updatedTabs.length > 0) {
        const removedIndex = currentTabs.findIndex((tab) => tab.id === tabId);
        const newActiveIndex = Math.min(removedIndex, updatedTabs.length - 1);
        set(activeTab, updatedTabs[newActiveIndex].id);
      } else {
        set(activeTab, null);
      }
    }
  });

  return { tabsAtom, activeTab, addTabAtom, removeTabAtom, setTabAtom };
};

const {
  activeTab: customerActiveTabAtom,
  setTabAtom: setCustomerActiveTabAtom,
  tabsAtom: customerTabsAtom,
  addTabAtom: addCustomerTabAtom,
  removeTabAtom: removeCustomerTabAtom,
} = createTabAtoms();

const JotaiActionCreator = () => {
  const { status, data: customers = [] } = useQuery(customerQueries.list());

  return (
    <Provider>
      <div className="flex gap-4 h-full items-stretch">
        <div className="w-[300px] flex flex-col gap-2">
          {status === "pending"
            ? "Loading..."
            : customers.map((customer) => (
                <CustomerItem key={customer.id} customer={customer} />
              ))}
        </div>
        <div className="flex-1 border border-dashed">
          <CustomerTabs />
        </div>
      </div>
    </Provider>
  );
};

function CustomerItem({ customer }: { customer: Customer }) {
  const addProductTab = useSetAtom(addCustomerTabAtom);
  return (
    <Card
      className="py-1 hover:text-blue-400 cursor-pointer"
      onClick={() =>
        addProductTab({ id: customer.id, text: customer.displayName })
      }
    >
      <CardContent>{customer.displayName}</CardContent>
    </Card>
  );
}

function CustomerTabs({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const customerTabs = useAtomValue(customerTabsAtom);
  const customerActiveTab = useAtomValue(customerActiveTabAtom);
  const setCustomerActiveTab = useSetAtom(setCustomerActiveTabAtom);
  const removeCustomerTabs = useSetAtom(removeCustomerTabAtom);

  if (!customerTabs.length) {
    return (
      <div className="border border-dashed flex h-full w-full items-center justify-center">
        No customer selected
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col gap-6", className)} {...props}>
      <Tabs
        value={
          customerActiveTab ? `customer-tab-${customerActiveTab}` : undefined
        }
        onValueChange={(value) => {
          const tabId = value.replace("customer-tab-", "");
          setCustomerActiveTab(tabId);
        }}
      >
        <TabsList>
          {customerTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={`customer-tab-${tab.id}`}
              onClick={() => setCustomerActiveTab(tab.id)}
              className="pr-0!"
            >
              {tab.text}
              <Button
                size="iconSm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCustomerTabs(tab.id);
                }}
              >
                <X size={16} />
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
        {customerTabs.map((tab) => (
          <TabsContent key={tab.id} value={`customer-tab-${tab.id}`}>
            <CustomerTabContent customerId={tab.id} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function CustomerTabContent({ customerId }: { customerId: string }) {
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
export default JotaiActionCreator;
