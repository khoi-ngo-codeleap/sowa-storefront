import { toast } from "@/hooks/use-toast";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
import { isAxiosError } from "axios";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      successMsg?: string;
      errorMsg?: string | Record<number, string>;
    };
  }
}

const queryClient = new QueryClient({
  /** config query cache */
  queryCache: new QueryCache({
    onError: (error) => {
      Sentry.captureException(error);
      if (isAxiosError(error) && error.response) {
        // only show toast for server error
        if (error.response.status >= 500) {
          toast({title: "Oops! Something went wrong."});
        }
      }
    },
  }),
  /** config mutation cache */
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const { successMsg } = mutation.meta || {};
      if (successMsg) {
        toast({ title: successMsg, variant: "success" });
      }
    },
    onError: (error, _variables, _context, mutation) => {
      Sentry.captureException(error);
      const { errorMsg } = mutation.meta || {};

      if (isAxiosError(error) && errorMsg) {
        // one message for every status
        if (typeof errorMsg === "string") {
          toast({ title: errorMsg , variant: "destructive" });
        }

        // delicate error messages base on status
        if (typeof errorMsg === "object" && error.response) {
          const message = errorMsg[error.response.status];
          if (message) {
            toast({ title: message , variant: "destructive" });
          }
        }
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

export default queryClient;
