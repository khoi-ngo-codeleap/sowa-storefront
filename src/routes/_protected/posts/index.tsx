import PostIndex from "@/features/post/pages/PostIndex";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/posts/")({
  component: PostIndex,
});
