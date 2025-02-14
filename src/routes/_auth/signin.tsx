import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-semibold">JTL Hub Login</h1>
      <div>Login Form!</div>
    </div>
  );
}
