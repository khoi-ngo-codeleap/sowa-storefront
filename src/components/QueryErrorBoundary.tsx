import { useNavigate } from "@tanstack/react-router";
import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

const QueryErrorBoundary: React.FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const fallbackRender = ({ resetErrorBoundary }: FallbackProps) => {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-4">
        <h1>Opp!, something went wrong</h1>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate({ to: "/" })}>
            Go home
          </Button>
          <Button onClick={() => resetErrorBoundary()}>Try again</Button>
        </div>
      </div>
    );
  };

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallbackRender={fallbackRender}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default QueryErrorBoundary;
