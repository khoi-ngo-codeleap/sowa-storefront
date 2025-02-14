import { AuthContextValue } from "@/providers/AuthProvider";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface RouterContext {
  auth: AuthContextValue;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-x-2 h-12 bg-neutral-800 text-white rounded-full px-8 py-1.5 z-50">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/playground" className="[&.active]:font-bold">
          Playground
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/customers" className="[&.active]:font-bold">
          Customer
        </Link>
        <Link to="/manifesto" className="[&.active]:font-bold">
          Manifesto
        </Link>
        <Link to="/signin" className="[&.active]:font-bold">
          Signin
        </Link>
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
