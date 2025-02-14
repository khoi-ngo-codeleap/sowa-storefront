import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div className="flex min-h-svh">
      <div className="hidden md:flex items-center justify-center flex-1 bg-red-50">
        <Link to="/">
          <div className="border-spacing-3 border-2 border-dashed  rounded-lg  size-96" />
        </Link>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
