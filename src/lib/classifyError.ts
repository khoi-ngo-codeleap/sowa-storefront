import { PostgrestError } from "@supabase/supabase-js";
import { isAxiosError } from "axios";

function classifyAxiosStatus(status: number) {
  if (status === 401) return "Unauthorized";
  if (status === 403) return "Forbidden";
  if (status === 404) return "NotFound";
  if (status >= 500) return "ServerError";
  if (status >= 400) return "ClientError";
  return "NetworkError";
}

function classifyPostgrestError(error: PostgrestError) {
  const code = error.code;
  switch (code) {
    case "PGRST116":
      return "NotFound";
  }

  return "PostgrestError";
}

export type ClassifiedError = {
  type:
    | "JavaScriptError"
    | "UnknownError"
    | ReturnType<typeof classifyAxiosStatus>
    | ReturnType<typeof classifyPostgrestError>;
  message: string;
};

export default function classifyError(error: unknown): ClassifiedError {
  if (error instanceof PostgrestError) {
    return { type: classifyPostgrestError(error), message: error.message };
  }

  if (isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const type = classifyAxiosStatus(status);
    const message = error.response?.data?.message || error.message;
    return { type, message };
  }

  if (error instanceof Error) {
    return { type: "JavaScriptError", message: error.message };
  }

  return { type: "UnknownError", message: "Unexpected error occurred" };
}
