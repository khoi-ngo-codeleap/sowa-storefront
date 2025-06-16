import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

import appIcon from "@/assets/jtl-logo.svg";
import CustomerTimeline from "@/features/customer/components/customer-detail/timeline-section/CustomerTimeline";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-svh flex flex-col">
      <header className="h-12 border flex items-center px-3">
        <div className="ml-auto">
          <Link
            to="/signin"
            className="inline-flex items-center justify-center h-9 px-4 py-2 text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
          <Button className="rounded-lg">Get start</Button>
        </div>
      </header>
      <div className="flex-1">
        <CustomerTimeline />
        <div className="max-w-screen-md mx-auto">
          {/* hero text */}
          <div className="flex flex-col py-6 gap-y-6 items-center justify-center">
            <h1 className="text-5xl font-extrabold text-center">
              ERP-System & E-Commerce-Lösungen aus einer Hand
            </h1>
            <p className="text-muted-foreground text-center max-w-screen-sm">
              Onlinehandel mit JTL-Software Über
              <b className="font-semibold"> 50.000 Versandhändler</b> setzen im
              E-Commerce auf die Software von JTL.
              {/* <AppIcon /> */}
              <img src={appIcon} className="logo" alt="app logo" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
