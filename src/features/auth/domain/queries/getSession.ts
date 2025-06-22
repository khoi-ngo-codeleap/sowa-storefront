import supabase from "@/api/client/supabase";

export default async function getSession() {
  const { data, error: _error } = await supabase.auth.getSession();

  if (!data.session) {
    return null;
  }

  return data.session;
}
