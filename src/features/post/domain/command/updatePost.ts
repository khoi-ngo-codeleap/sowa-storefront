import supabase from "@/api/client/supabase";
import { Tables } from "@/types/database.types";

interface UpdatePostVariable {
  id: string;
  updateSet: Partial<Tables<"post">>;
}

export const updatePost = async ({ id, updateSet }: UpdatePostVariable) => {
  const { data } = await supabase
    .from("post")
    .update(updateSet)
    .eq("id", id)
    .select(
      "id, title, content, createdAt:created_at, updatedAt:updated_at, isFeatured:is_featured",
    )
    .single()
    .throwOnError();

  return data;
};
