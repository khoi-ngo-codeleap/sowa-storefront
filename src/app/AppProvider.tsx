import { FC, PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { LanguageProvider } from "@/providers/LanguageProvider";
import queryClient from "@/configs/queryClient";
import { Provider } from "jotai";
import jotaiStore from "@/configs/jotai";

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider store={jotaiStore}>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </LanguageProvider>
    </Provider>
  );
};

export default AppProvider;
