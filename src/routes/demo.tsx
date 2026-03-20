import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/demo")({
  component: DemoLayout,
});

const DEMOS = [{ to: "/demo/bottom-sheet", label: "BottomSheet" }] as const;

function DemoLayout() {
  return (
    <div className="min-h-svh flex">
      <aside className="w-56 shrink-0 border-r flex flex-col gap-1 p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
          Components
        </p>
        {DEMOS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="text-sm px-3 py-1.5 rounded-md hover:bg-neutral-100 transition-colors"
            activeProps={{ className: "bg-neutral-100 font-medium" }}
          >
            {label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
