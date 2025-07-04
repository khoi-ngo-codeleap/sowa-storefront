import NotFoundComponent from "@/components/NotFoundComponent";
import { routeTree } from "@/routeTree.gen";
import { createRouter, ErrorComponent } from "@tanstack/react-router";

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }

  interface StaticDataRouteOption {
    page?: {
      title: string;
      description: string;
    };
  }
}

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  defaultNotFoundComponent: () => <NotFoundComponent />,
  defaultPreload: "intent",
  scrollRestoration: true,
  context: {
    auth: undefined!,
  },
});

export default router;
