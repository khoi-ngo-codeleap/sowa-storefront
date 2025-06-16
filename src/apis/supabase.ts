import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = "https://enigztrmecmnflztlngn.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuaWd6dHJtZWNtbmZsenRsbmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwOTY2NjcsImV4cCI6MjA2NDY3MjY2N30.bN2TlRe8QXl-Y9Zv48zM-zfkHFEWRdAis3BEy5oFtiY"; // Store in .env in production

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
