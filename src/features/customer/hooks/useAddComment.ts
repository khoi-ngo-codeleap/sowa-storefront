import { useMutation } from "@tanstack/react-query";
import queryClient from "@/configs/queryClient";
import { addComment } from "../domain/command/addComment";
import customerQueries from "../domain/queries/customerQueries";

export default function useAddComment() {
  return useMutation({
    meta: {
      successMsg: "Comment has been added successfully",
      errorMsg: "Opp!, something went wrong",
    },
    mutationFn: addComment,
    onSuccess: (_data, variables) => {
      return queryClient.invalidateQueries({
        queryKey: customerQueries.events(variables.id).queryKey,
      });
    },
  });
}
