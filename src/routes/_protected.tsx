import { useAuth } from "@/auth";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  createFileRoute,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/_protected")({
  component: LayoutComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.user) {
      throw redirect({
        to: "/signin",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function Avatar() {
  const { logout } = useAuth();
  return (
    <div className="flex items-center gap-2">
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}

// simple ease-out for width increase
const easingProgress = (t: number) => 0.5 + 0.5 * Math.sin((Math.PI * t) / 2);

function ProgressBar() {
  // Latest ref to avoid stale closure issues why animating
  const state = useRouterState();
  const latestStatusRef = useRef<string>(state.status);
  useEffect(() => {
    latestStatusRef.current = state.status;
  }, [state.status]);

  // initial progress is 0
  const minVisibleTime = 300;
  const [progress, setProgress] = useState(0);
  const latestRunningRef = useRef<boolean>(false);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  function animateProgress(timestamp: number) {
    if (!latestRunningRef.current) {
      return;
    }

    const elapsed = timestamp - startTimeRef.current;
    const t = Math.min(elapsed / 2000, 1);
    const eased = easingProgress(t);
    setProgress(20 + eased * 70);

    rafRef.current = requestAnimationFrame(animateProgress);
  }

  // const runProgress = useCallback(() => {
  //   const status = latestStatusRef.current;
  //   if (status === "pending") {
  //     setProgress(0);
  //     startTimeRef.current = performance.now();

  //     // Begin animation on next tick
  //     rafRef.current = requestAnimationFrame(animateProgress);
  //   } else {
  //     latestRunningRef.current = false;
  //     cancelAnimationFrame(rafRef.current!);

  //     // Fill to 100%, then fade out after a delay
  //     setProgress(100);
  //     const timer = setTimeout(() => {
  //       setProgress(0);
  //     }, minVisibleTime);

  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  useEffect(() => {
    latestRunningRef.current = true;
    rafRef.current = requestAnimationFrame(animateProgress);

    return () => {
      latestRunningRef.current = false;
      cancelAnimationFrame(rafRef.current!);
    };
  }, []);

  return (
    <>
      <div className={cn("absolute left-0 -bottom-1 h-1 w-full bg-secondary")}>
        <span
          className={cn(
            "h-full w-full absolute bottom-0 left-0 bg-amber-600 transform-all"
          )}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </>
  );
}

function Nav({
  menu,
  avatar,
  progress,
}: {
  menu?: React.ReactNode;
  avatar?: React.ReactNode;
  progress?: React.ReactNode;
}) {
  return (
    <div className="relative border px-4 py-2 flex items-center justify-between">
      <div>{menu}</div>
      <div>{avatar}</div>
      {progress}
    </div>
  );
}

function LayoutComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative h-svh">
        <Nav avatar={<Avatar />} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
