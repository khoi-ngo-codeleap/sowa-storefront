import supabase from "@/api/client/supabase";

export const getFeaturedPost = async () => {
  const { data } = await supabase
    .from("post")
    .select(
      "id, title, content, createdAt:created_at, updatedAt:updated_at, isFeatured:is_featured",
    )
    .order("created_at", { ascending: false })
    .throwOnError();

  return data;
};
