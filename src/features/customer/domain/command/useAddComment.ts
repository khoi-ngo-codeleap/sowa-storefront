import { useMutation } from "@tanstack/react-query";
import queryClient from "@/configs/queryClient";
import { addComment } from "../api/addComment";

export default function useAddComment() {
  return useMutation({
    meta: {
      successMsg: "Comment has been added successfully",
      errorMsg: "Opp!, something went wrong",
    },
    mutationFn: addComment,
    onSuccess: (_data, _variables) => {
      return queryClient.invalidateQueries({
        queryKey: ["customer", _variables.id, "events"],
      });
    },
  });
}
