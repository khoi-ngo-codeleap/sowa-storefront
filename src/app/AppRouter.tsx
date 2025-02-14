import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "@/routeTree.gen";
import { useAuth } from "@/providers/AuthProvider";
import { useMemo } from "react";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { auth: { isAuthenticated: false } },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const AppRouter = () => {
  const auth = useAuth();
  const routeContextValue = useMemo(
    () => ({
      auth,
    }),
    [auth]
  );

  return <RouterProvider router={router} context={routeContextValue} />;
};

export default AppRouter;
