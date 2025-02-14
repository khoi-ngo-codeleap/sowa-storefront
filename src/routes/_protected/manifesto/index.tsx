import { fetchManifesto } from "@/apis/manifesto";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { useAtom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { ChevronRight } from "lucide-react";
import { FC, HTMLAttributes, useState } from "react";

const manifestoAtom = atomWithQuery(() => ({
  queryKey: ["manifesto"],
  queryFn: fetchManifesto,
}));

export const Route = createFileRoute("/_protected/manifesto/")({
  component: RouteComponent,
});

type Node = {
  name: string;
  nodes?: Node[];
};

const FolderIcon: FC<Pick<HTMLAttributes<HTMLDivElement>, "className">> = ({
  className,
}) => {
  return (
    <div className={clsx("shirk-0 h-5 w-5 bg-red-50 rounded-md", className)} />
  );
};

const FileIcon = () => {
  return <div className="shirk-0 h-5 w-5 bg-neutral-400 rounded-md" />;
};

const nodes: Node[] = [
  {
    name: "Home",
    nodes: [
      {
        name: "Movies",
        nodes: [
          {
            name: "Action",
            nodes: [
              { name: "2000", nodes: [{ name: "Iron-man" }] },
              {
                name: "2025",
                nodes: [
                  { name: "Spider-man no way home" },
                  { name: "Dr.Strange in the multiverse of madness" },
                ],
              },
            ],
          },
          { name: "Comedy" },
        ],
      },
      { name: "Musics", nodes: [{ name: "Rock" }, { name: "Classical" }] },
      { name: "Pictures", nodes: [] },
    ],
  },
];

const FilesystemItem: FC<{ node: Node }> = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="my-1.5">
      <span className="flex items-center gap-1.5">
        {node.nodes && node.nodes.length > 0 && (
          <button onClick={() => setIsOpen(!isOpen)}>
            <ChevronRight
              className={clsx("size-4 transition", isOpen ? "rotate-90" : "")}
            />
          </button>
        )}

        {node.nodes ? (
          <FolderIcon
            className={clsx(node.nodes.length === 0 ? "ml-[22px]" : "")}
          />
        ) : (
          <FileIcon />
        )}

        {node.name}
      </span>

      {isOpen && (
        <ul className="pl-6">
          {node.nodes?.map((folder) => (
            <FilesystemItem key={folder.name} node={folder} />
          ))}
        </ul>
      )}
    </li>
  );
};

function RouteComponent() {
  const [{ isPending, isError }] = useAtom(manifestoAtom);
  // const { changeLocale } = useLanguage();

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error!</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Manifesto</h1>
      <ul>
        {nodes.map((folder) => (
          <FilesystemItem key={folder.name} node={folder} />
        ))}
      </ul>
    </div>
  );
}
