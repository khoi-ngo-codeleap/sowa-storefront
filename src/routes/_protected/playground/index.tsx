import PlayGroundIndex from "@/features/playground/pages/PlayGroundIndex";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/playground/")({
  component: PlayGroundIndex,
});
