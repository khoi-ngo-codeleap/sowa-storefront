import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { ListItem } from "@/types/common";
import { getFeaturedPost } from "../domain/queries/getFeaturedPost";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import useUpdatePost from "../domain/hooks/useUpdatePost";

export const postSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().nullable(),
  is_featured: z.boolean(),
});

export type CustomerContactValue = z.infer<typeof postSchema>;

interface PostFormProps {
  post?: ListItem<Awaited<ReturnType<typeof getFeaturedPost>>>;
  onCompleted?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onCompleted }) => {
  const { mutate: updatePost, isPending } = useUpdatePost();

  const form = useForm<CustomerContactValue>({
    defaultValues: post
      ? {
          title: post.title,
          content: post.content,
          is_featured: !!post.isFeatured,
        }
      : undefined,
    resolver: zodResolver(postSchema),
  });

  const onSubmit: SubmitHandler<CustomerContactValue> = (values) => {
    if (post) {
      updatePost(
        {
          id: post.id,
          updateSet: values,
        },
        { onSuccess: onCompleted }
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="is_featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(Boolean(checked))
                  }
                />
              </FormControl>
              <FormLabel className="font-normal">Mark as Featured</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={6}
                  placeholder="Write something..."
                  className="resize-none"
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCompleted} disabled={isPending}>
            Cancel
          </Button>
          <Button disabled={isPending}>
            {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
