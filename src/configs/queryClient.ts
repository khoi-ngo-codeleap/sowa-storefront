import { toast } from "sonner";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import classifyError, { ClassifiedError } from "@/lib/classifyError";
// - QueryClient:
// 	* Can already be implemented and config per the repo.
// 	* We can add stuffs like Sentry config here as well, and leave it in Internal React

// 	* We need to have data validation based on Zod Schema

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      successMsg?: string;
      errorMsg?: Record<string | keyof ClassifiedError, string>;
    };
    queryMeta: {
      errorMsg?: Record<string | keyof ClassifiedError, string>;
    };
  }
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const { errorMsg } = query.meta ?? {};

      // ✅ classify error
      const { type, message } = classifyError(error);

      // ✅ show error to console or sent it to sentry
      console.warn(`[Query Error - ${type}]:`, message);

      // ✅ show configured error message
      if (typeof errorMsg === "object" && type in errorMsg) {
        toast(errorMsg[type]);
      }
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      // ✅ show configured success message
      const { successMsg } = mutation.meta ?? {};
      successMsg && toast(successMsg);
    },
    // ✅ show configured error message
    onError: (error, _variables, _context, mutation) => {
      const { errorMsg } = mutation.meta ?? {};
      const { type, message } = classifyError(error);

      // ✅ show error to console or sent it to sentry
      console.warn(`[Mutation Error - ${type}]:`, message);

      // ✅ show configured error message
      if (typeof errorMsg === "object" && type in errorMsg) {
        toast(errorMsg[type]);
      }
    },
  }),
  // 👇 we should remove this line i just setup this for debug
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

export default queryClient;
