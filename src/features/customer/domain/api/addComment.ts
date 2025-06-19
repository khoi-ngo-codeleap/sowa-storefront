import supabase from "@/api/client/supabase";

interface AddCommentVariable {
  id: string;
  message: string;
}

export const addComment = async ({ id, message }: AddCommentVariable) => {
  const { data, error } = await supabase.from("customer_event").insert({
    customer_id: id,
    type: "comment",
    payload: { message },
  });

  if (error) throw error;
  return data;
};
