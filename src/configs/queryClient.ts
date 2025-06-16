import { toast } from "@/hooks/use-toast";
import {
  MutationCache,
  Query,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
import { isAxiosError } from "axios";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidateQuery?: Query;
      successMsg?: string;
      errorMsg?: string;
    };
  }
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (!isAxiosError(error)) {
        Sentry.captureException(error.message);
        return;
      }

      // all error should be logged on sentry
      Sentry.captureException(error);
      if ((error.response?.status ?? 0) >= 500) {
        toast({
          title: "Oops! Something went wrong.",
          description: "Please try again later.",
        });
      }
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const successMsg = mutation.meta?.successMsg;
      if (successMsg) {
        toast({ title: successMsg });
      }
    },
    onError: (_error, _variables, _context, mutation) => {
      const errorMsg = mutation.meta?.errorMsg;
      if (errorMsg) {
        toast({ title: errorMsg });
      }
    },
  })
});

export default queryClient;
