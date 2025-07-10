import { toast } from "sonner";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import classifyError, { ErrorType } from "@/lib/classifyError";
import * as Sentry from "@sentry/react";

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

export const queryCache = new QueryCache({
  onError: (error, query) => {
    Sentry.captureException(error);
    const toastMessage = handleGlobalToast({
      error,
      message: query.meta?.errorMessage,
      showErrorToast: query.meta?.showErrorToast,
      defaultToast: false, // ✅ Don't show toast unless explicitly opted-in
    });

    if (toastMessage) toast(toastMessage);
  },
});

const queryClient = new QueryClient({
  queryCache,
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const message = mutation.meta?.successMessage;
      if (message) {
        toast(message);
      }
    },
    onError: (error, _variables, _context, mutation) => {
      Sentry.captureException(error);
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
      retry: 0,
      staleTime: Infinity,
    },
  },
});

export default queryClient;
