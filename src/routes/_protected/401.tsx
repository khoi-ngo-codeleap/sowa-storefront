import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/401")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_protected/401"!</div>;
}
