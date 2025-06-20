import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { FC, HTMLAttributes, useState } from "react";

type MenuNode = {
  name: string;
  nodes?: MenuNode[];
};

const SomeIcon: FC<Pick<HTMLAttributes<HTMLDivElement>, "className">> = ({
  className,
}) => {
  return (
    <div className={clsx("shirk-0 h-5 w-5 bg-red-50 rounded-md", className)} />
  );
};

const Icon = () => {
  return <div className="shirk-0 h-5 w-5 bg-neutral-400 rounded-md" />;
};

const nodes: MenuNode[] = [
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

const MenuItem: FC<{ node: MenuNode }> = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="my-1.5">
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        {node.nodes ? (
          <SomeIcon
            className={clsx(node.nodes.length === 0 ? "ml-[22px]" : "")}
          />
        ) : (
          <Icon />
        )}

        <div className="flex-1">{node.name}</div>

        {node.nodes && node.nodes.length > 0 && (
          <button onClick={() => setIsOpen(!isOpen)}>
            <ChevronRight
              className={clsx("size-4 transition", isOpen ? "rotate-90" : "")}
            />
          </button>
        )}
      </div>

      {isOpen && (
        <ul className="pl-6">
          {node.nodes?.map((folder) => (
            <MenuItem key={folder.name} node={folder} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function Manifesto() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Manifesto</h1>
      <div className="border w-[300px]">
        <ul>
          {nodes.map((folder) => (
            <MenuItem key={folder.name} node={folder} />
          ))}
        </ul>
        <ul>
          {nodes.map((folder) => (
            <MenuItem key={folder.name} node={folder} />
          ))}
        </ul>
      </div>
    </div>
  );
}
