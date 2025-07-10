import { FC, PropsWithChildren, useState } from "react";
import { Button } from "@/components/ui/button";
import { HeadContent, isMatch, Link, useMatches } from "@tanstack/react-router";
import useRenderCount from "@/hooks/use-render-count";
import UploadingCard from "@/components/upload/components/UploadingCard";
import UploadSuccessCard from "@/components/upload/components/UploadSuccessCard";
import UploadErrorCard from "@/components/upload/components/UploadErrorCard";
import UploadArea from "@/components/upload/components/UploadArea";
import { Upload } from "@/components/upload/Upload";

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
  const count = useRenderCount();
  return (
    <div className="border p-4 space-y-1">
      <div className="text-xl text-orange-500">ParentComponent: {count}</div>
      {children}
    </div>
  );
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
  return <div className="max-w-[400px] flex flex-col gap-4"></div>;
};

export default PlayGroundIndex;
