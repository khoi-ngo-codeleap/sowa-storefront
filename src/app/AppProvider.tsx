import { FC, PropsWithChildren } from "react";
import { Provider as JotaiProvider } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHydrateAtoms } from "jotai/react/utils";
import { queryClientAtom } from "jotai-tanstack-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { LanguageProvider } from "@/providers/LanguageProvider";
import { AuthProvider } from "@/providers/AuthProvider";
const queryClient = new QueryClient();

const HydrateAtoms: FC<PropsWithChildren> = ({ children }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return children;
};

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <HydrateAtoms>{children}</HydrateAtoms>
          </JotaiProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default AppProvider;
