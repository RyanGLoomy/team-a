import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// We keep this nullable so the app can still run in "demo mode" without Supabase.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
