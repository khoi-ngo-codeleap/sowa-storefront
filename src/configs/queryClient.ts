import { toast } from "@/hooks/use-toast";
import { PostgrestError } from "@supabase/supabase-js";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
// - QueryClient:
// 	* Can already be implemented and config per the repo.
// 	* We can add stuffs like Sentry config here as well, and leave it in Internal React

// 	* We need to have data validation based on Zod Schema
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      successMsg?: string;
      errorMsg?: string | Record<string | number, string>;
    };
    queryMeta: {
      isToast?: boolean;
      errorMsg?: string | Record<string | number, string>;
    };
  }
}

const defaultMsg: Record<string, string> = {
  PGRST116: "Customer not found",
};

function getMessage(code: string, errorMsg: string | Record<string, string>) {
  const fallbackMsg = "Oops, something went wrong";

  if (typeof errorMsg === "string") {
    return errorMsg;
  }

  if (typeof errorMsg === "object") {
    return errorMsg[code] ?? defaultMsg[code];
  }

  return fallbackMsg;
}

const queryClient = new QueryClient({
  /** config query cache */
  queryCache: new QueryCache({
    onError: (error, query) => {
      const { isToast = true, errorMsg } = query.meta ?? {};
      if (!isToast) return;

      console.log(error.name);
      let message = "";
      if (error instanceof PostgrestError) {
        // handle postgrest error
      }

      if (isAxiosError(error)) {
        // handle axios error
      }

      // handle other errors
      console.log(error.message);
    },
  }),
  /** config mutation cache */
  mutationCache: new MutationCache({
    // ✅ show configured success message
    onSuccess: (_data, _variables, _context, mutation) => {
      const { successMsg } = mutation.meta ?? {};
      if (successMsg) {
        toast({ title: successMsg, variant: "success" });
      }
    },
    // ✅ show configured error message
    onError: (error, _variables, _context, mutation) => {
      const { errorMsg } = mutation.meta ?? {};

      if (error instanceof PostgrestError) {
        // handle postgrest error
      }

      if (isAxiosError(error)) {
        // handle axios error
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
