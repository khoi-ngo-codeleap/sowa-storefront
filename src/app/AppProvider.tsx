import { FC, PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { LanguageProvider } from "@/providers/LanguageProvider";
import queryClient from "@/configs/queryClient";
import { AuthProvider } from "@/auth";

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default AppProvider;
