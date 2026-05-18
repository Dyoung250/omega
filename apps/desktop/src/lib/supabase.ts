/// <reference types="vite/client" />
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ?? "";

function createNoOpClient(): SupabaseClient {
  const noop = () => Promise.resolve({ data: null, error: null as any });
  return {
    auth: {
      getSession: noop,
      signInWithPassword: noop,
      signUp: noop,
      signOut: noop,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: noop }), order: () => ({ limit: () => ({ data: [], error: null }) }) }),
      insert: () => ({ select: () => ({ single: noop }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: noop }) }) }),
      delete: () => ({ eq: () => noop }),
    }),
  } as any;
}

export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : createNoOpClient();

export type Profile = {
  id: string;
  email: string;
  display_name: string | null;
  company: string | null;
  role: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};
