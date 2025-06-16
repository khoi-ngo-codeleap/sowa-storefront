import { useMutation } from "@tanstack/react-query";
import { addComment } from "@/apis/supabase/customer";
import queryClient from "@/configs/queryClient";

export default function useAddComment() {

  return useMutation({
    meta: {
      successMsg: "Comment has been added successfully",
      errorMsg: "Opp!, something went wrong",
    },
    mutationFn: addComment,
    onSuccess: (_data, _variables) => {
      return queryClient.invalidateQueries({queryKey: ['customers', 'detail', _variables.id, 'events']});
    }
  });
};