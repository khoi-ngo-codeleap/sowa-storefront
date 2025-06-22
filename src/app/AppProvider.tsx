import { FC, PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { LanguageProvider } from "@/providers/LanguageProvider";
import queryClient from "@/configs/queryClient";

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </LanguageProvider>
  );
};

export default AppProvider;
