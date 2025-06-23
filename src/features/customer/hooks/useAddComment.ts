import { useMutation } from "@tanstack/react-query";
import queryClient from "@/configs/queryClient";
import { addComment } from "../domain/command/addComment";
import customerQueries from "../domain/queries/customerQueries";

export default function useAddComment() {
  return useMutation({
    meta: {
      successMessage: "Comment has been added successfully",
    },
    mutationFn: addComment,
    onSuccess: (_data, variables) => {
      return queryClient.invalidateQueries({
        queryKey: customerQueries.events(variables.id).queryKey,
      });
    },
  });
}
