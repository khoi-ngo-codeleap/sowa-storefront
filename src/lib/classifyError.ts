import { PostgrestError } from "@supabase/supabase-js";
import { AxiosError, isAxiosError } from "axios";

export type ErrorType =
  | "JavaScriptError"
  | "UnknownError"
  | "NetworkError"
  | "Unauthorized"
  | "Forbidden"
  | "NotFound"
  | "UnprocessableEntity"
  | "BadRequest"
  | "Conflict"
  | "ClientError"
  | "ServerError"
  | "PostgrestError";

export type ClassifiedError = {
  type: ErrorType;
  message: string;
};

const definedMessages: Record<ErrorType, string> = {
  JavaScriptError: "Unexpected error occurred",
  UnknownError: "Unexpected error occurred",
  NetworkError: "Bad network connection",
  Unauthorized: "You are not authorized",
  Forbidden: "You do not have permission",
  NotFound: "Requested resource not found",
  UnprocessableEntity: "Validation failed",
  BadRequest: "Invalid request",
  Conflict: "Conflict occurred",
  ClientError: "A client-side error occurred",
  ServerError: "A server-side error occurred",
  PostgrestError: "Database error occurred",
};

function classifyAxiosStatus(error: AxiosError): ErrorType {
  const status = error.response?.status ?? 0;

  if (!status) return "NetworkError";
  if (status === 401) return "Unauthorized";
  if (status === 403) return "Forbidden";
  if (status === 404) return "NotFound";
  if (status === 422) return "UnprocessableEntity";
  if (status === 400) return "BadRequest";
  if (status === 409) return "Conflict";
  if (status >= 500) return "ServerError";
  if (status >= 400) return "ClientError";

  return "UnknownError";
}

function classifyPostgrestError(error: PostgrestError): ErrorType {
  switch (error.code) {
    case "PGRST116":
      return "NotFound";
    default:
      return "PostgrestError";
  }
}

export default function classifyError(error: unknown): ClassifiedError {
  if (error instanceof PostgrestError) {
    const type = classifyPostgrestError(error);
    return { type, message: definedMessages[type] };
  }

  if (isAxiosError(error)) {
    const type = classifyAxiosStatus(error);
    return { type, message: definedMessages[type] };
  }

  if (error instanceof Error) {
    return {
      type: "JavaScriptError",
      message: definedMessages["JavaScriptError"],
    };
  }

  return { type: "UnknownError", message: definedMessages["UnknownError"] };
}
