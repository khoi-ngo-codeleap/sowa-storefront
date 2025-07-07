import { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  HeadContent,
  isMatch,
  Link,
  useMatches,
  useRouterState,
} from "@tanstack/react-router";

const ChildComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex gap-2">
      <Button onClick={() => setCount(count + 1)}>+</Button>
      <div className="text-2xl font-semibold">{count}</div>
      <Button onClick={() => setCount(Math.min(count - 1, 0))}>-</Button>
    </div>
  );
};

const ParentComponent: FC<PropsWithChildren> = ({ children }) => {
  const count = useCount();
  return (
    <div className="border p-4 space-y-1">
      <div className="text-xl text-orange-500">ParentComponent: {count}</div>
      {children}
    </div>
  );
};

const useCount = () => {
  const countRef = useRef(0);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);
  countRef.current = mount ? countRef.current + 1 : 0;
  return countRef.current;
};

const PageHeader = () => {
  const page = useMatches({
    select: (matches) => {
      const match = matches.find((match) => isMatch(match, "staticData.page"));
      return match?.staticData?.page;
    },
  });

  if (!page) return null;

  return (
    <div className="p-4 flex flex-col">
      <div className="text-2xl font-semibold">{page.title}</div>
      <div>{page.description}</div>
    </div>
  );
};

const PlayGroundIndex = () => {
  const state = useRouterState();
  return (
    <>
      <Link to="/customers" viewTransition={{ types: ["slide-left"] }}>
        Playground
      </Link>
      <PageHeader />
      <HeadContent />
      <ParentComponent>
        <ChildComponent />
      </ParentComponent>
    </>
  );
};

export default PlayGroundIndex;
