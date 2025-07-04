import PlayGroundIndex from "@/features/playground/pages/PlayGroundIndex";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/playground/")({
  staticData: {
    page: {
      title: "Playground",
      description: "Interactive Playground for testing features",
    },
  },
  head: () => ({
    meta: [
      {
        title: "Sowa - Playground",
      },
    ],
  }),
  component: PlayGroundIndex,
});
