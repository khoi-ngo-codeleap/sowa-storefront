import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DevTools } from "jotai-devtools";
import "jotai-devtools/styles.css";
import supabase from "@/api/client/supabase";
import { User } from "@supabase/supabase-js";
import { AuthProvider } from "@/auth";

interface RouterContext {
  auth: { user: User | null };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async (): Promise<RouterContext> => {
    const { data } = await supabase.auth.getUser();
    return { auth: { user: data.user } };
  },
  component: () => (
    <AuthProvider>
      <Outlet />
      <DevTools
        position="top-left"
        options={{
          shouldShowPrivateAtoms: true,
          shouldExpandJsonTreeViewInitially: true,
        }}
      />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </AuthProvider>
  ),
});
