import { Alert } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import postQueries from "../domain/queries/postQueries";
import { Loader, MoreVertical } from "lucide-react";
import { PropsWithChildren, useEffect } from "react";
import { ListItem } from "@/types/common";
import { getFeaturedPost } from "../domain/queries/getFeaturedPost";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FormattedTime from "@/components/FormattedTime";
import { usePostModal } from "../states/modal";
import supabase from "@/api/client/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import queryClient from "@/configs/queryClient";
import useRenderCount from "@/hooks/use-render-count";

function LoadingContainer({
  loading,
  children,
}: PropsWithChildren & { loading?: boolean }) {
  if (loading) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center">
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return children;
}

interface PostCardProps {
  post: ListItem<Awaited<ReturnType<typeof getFeaturedPost>>>;
}
function PostCardAction({ post }: PostCardProps) {
  const { open } = usePostModal("edit");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            open({
              type: "edit",
              payload: post,
            })
          }
        >
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const PostCard = ({ id }: { id: string }) => {
  const renderCount = useRenderCount();

  console.log("PostCard render count: ", renderCount, "for id:", id);

  const { data: post } = useQuery({
    ...postQueries.list(),
    select: (posts) => {
      const post = posts.find((p) => p.id === id);

      if (!post) {
        throw new Error("Post not found");
      }

      return post;
    },
  });


  // This should not happen, just here for typescript.
  if (!post) {
    return null;
  }

  return (
    <Card className="relative w-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            <FormattedTime time={post.createdAt} />
          </p>
        </div>
        <PostCardAction post={post} />
      </CardHeader>

      <CardContent>
        {post.isFeatured && (
          <Badge className="mb-2" variant="secondary">
            Featured
          </Badge>
        )}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.content || "No content available."}
        </p>
      </CardContent>
    </Card>
  );
};

function FeatureNote() {
  return (
    <div className="gap-2">
      <div className="space-y-2">
        <p className="font-bold text-2xl">
          💡 TanStack Query Real-world Playground
        </p>
        <p className="text-muted-foreground">
          This sample was created to demonstrate how{" "}
          <span className="font-semibold">TanStack Query</span> can efficiently
          handle real-world data synchronization scenarios Including mutations,
          cache updates, and real-time integration without needing Jotai atoms
          or manual state mapping.
        </p>
      </div>
      <div className="py-4 space-y-3">
        <div>
          ✅ A new Command was added
          <p className="text-muted-foreground">
            PATCH /post/id which returns the newest post entity version
          </p>
        </div>
        <div>
          ✅ A new Query was added
          <p className="text-muted-foreground">
            GET /posts/featured which returns the featured posts, which should
            be keep updated if another Command gets used
          </p>
        </div>
        <div>
          ✅ We add a Realtime-Background service (Supabase Realtime), which
          get's post updates pushed via Realtime connection. In this case the UI
          should also stay in sync
        </div>
      </div>
    </div>
  );
}

export default function PostList() {
  const {
    status,
    data: posts = [],
    error,
  } = useQuery({
    ...postQueries.list(),
    select: (posts) => {
      return posts.map((post) => post.id);
    },
  });

  useEffect(() => {
    let postChannel: RealtimeChannel;
    async function subscribeChanges() {
      postChannel = supabase.channel("post_channel", {
        config: { private: true },
      });

      const channelState = postChannel.state;
      if (channelState === "closed") {
        postChannel.on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "post",
          },
          (payload, ...args) => {
            // For this example we only present the update but we probably could implement a delete or create too
            if (payload.eventType === "UPDATE") {
              const newPost = {
                ...payload.new,
                id: payload.old.id,
                createdAt: payload.new.created_at,
                updatedAt: payload.new.updated_at,
                isFeatured: payload.new.is_featured,
              } as ListItem<Awaited<ReturnType<typeof getFeaturedPost>>>;

              queryClient.setQueryData(postQueries.list().queryKey, (posts) =>
                posts?.map((post) => (post.id === newPost.id ? newPost : post)),
              );
            }

            console.log(payload, ...args);
          },
        );
        postChannel.subscribe();
      }
    }

    subscribeChanges();

    // Cleanup function to unsubscribe from the channel when the component unmounts
    return () => {
      if (postChannel) {
        postChannel.unsubscribe();
      }
    };
  }, []);

  if (error) {
    return <Alert variant="destructive">{error.message}</Alert>;
  }

  return (
    <div className="flex flex-col gap-2 py-4 pr-[460px]">
      <div className="h-full flex items-center gap-4">
        <h1 className="font-extrabold text-2xl">Post List</h1>
      </div>
      <div className="flex gap-3 ">
        <div className="flex-1 flex flex-col gap-3">
          <LoadingContainer loading={status === "pending"}>
            {posts.map((post) => (
              <PostCard key={post} id={post} />
            ))}
          </LoadingContainer>
        </div>
        <div className="absolute right-0 top-[54px] bottom-0 w-[460px] bg-white p-4 text-sm">
          <FeatureNote />
        </div>
      </div>
    </div>
  );
}
