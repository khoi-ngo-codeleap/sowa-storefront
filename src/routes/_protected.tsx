import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  component: LayoutComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.auth) {
      throw redirect({
        to: "/signin",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function LayoutComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
