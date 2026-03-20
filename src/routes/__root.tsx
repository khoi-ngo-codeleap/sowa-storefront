import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRouteWithContext()({
  component: () => (
    <div className="min-h-svh">
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});
