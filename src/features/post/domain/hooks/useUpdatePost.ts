import { useMutation } from "@tanstack/react-query";
import queryClient from "@/configs/queryClient";
import { updatePost } from "../command/updatePost";
import postQueries from "../queries/postQueries";

export default function useUpdatePost() {
  return useMutation({
    meta: {
      successMessage: "Post updated successfully",
    },
    mutationFn: updatePost,
    onSuccess: (data) => {
      /**
       * ✅ We can update the customer query cache quite simply and directly — it's not as hard as you might think.
       */
      queryClient.setQueryData(postQueries.list().queryKey, (posts) =>
        posts?.map((post) => (post.id === data.id ? data : post))
      );
    },
  });
}
