import { toast } from "sonner";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import classifyError, { ErrorType } from "@/lib/classifyError";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      successMessage?: string;

      // 👇 specific error message as a string when you want to override the default
      errorMessage?: string | Partial<Record<ErrorType, string>>;
      showErrorToast?: boolean | ((type: ErrorType) => boolean);
    };
    queryMeta: {
      successMessage?: string;

      // 👇 specific error message as a string when you want to override the default
      errorMessage?: string | Partial<Record<ErrorType, string>>;
      showErrorToast?: boolean | ((type: ErrorType) => boolean);
    };
  }
}

// 👇 Shared utility for consistent toast logic
function handleGlobalToast({
  error,
  message,
  showErrorToast,
  defaultToast = false,
}: {
  error: Error;
  message?: string | Partial<Record<ErrorType, string>>;
  showErrorToast?: boolean | ((type: ErrorType) => boolean);
  defaultToast?: boolean;
}) {
  // ✅ Classify the error into a known type and get a safe default message
  const classified = classifyError(error);

  // ✅ Determine whether this error should show a toast
  const shouldToast =
    typeof showErrorToast === "function"
      ? showErrorToast(classified.type)
      : (showErrorToast ?? defaultToast);

  // 🫢 Silent fail
  if (!shouldToast) return null;

  // ✅ Determine the appropriate message to show
  const fallback = classified.message;
  const customMessage =
    typeof message === "string"
      ? message
      : typeof message === "object" && message[classified.type]
        ? message[classified.type]
        : fallback;

  return customMessage;
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (_error, query) => {
      console.warn(`[Query Error]:`, _error);

      const toastMessage = handleGlobalToast({
        error: _error,
        message: query.meta?.errorMessage,
        showErrorToast: query.meta?.showErrorToast,
        defaultToast: false, // ✅ Don't show toast unless explicitly opted-in
      });

      if (toastMessage) toast(toastMessage);
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const message = mutation.meta?.successMessage;
      if (message) {
        toast(message);
      }
    },
    onError: (error, _variables, _context, mutation) => {
      console.warn(`[Mutation Error]:`, error);

      const toastMessage = handleGlobalToast({
        error,
        message: mutation.meta?.errorMessage,
        showErrorToast: mutation.meta?.showErrorToast,
        defaultToast: true, // ✅ Show toast by default for mutations
      });

      if (toastMessage) toast(toastMessage);
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
