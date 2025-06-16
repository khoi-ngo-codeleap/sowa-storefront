import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthContext } from "../auth";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DevTools } from "jotai-devtools";
import "jotai-devtools/styles.css";

interface RouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <DevTools
        position="top-right"
        options={{
          shouldShowPrivateAtoms: true,
          shouldExpandJsonTreeViewInitially: true,
        }}
      />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  ),
});
