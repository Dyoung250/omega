import { create } from "zustand";
import { supabase, type Profile } from "../lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

export type AuthView = "login" | "register" | "forgot";

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  showAuthModal: boolean;
  authView: AuthView;
  authError: string | null;

  initSession: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  setShowAuthModal: (show: boolean) => void;
  setAuthView: (view: AuthView) => void;
  clearAuthError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  showAuthModal: false,
  authView: "login",
  authError: null,

  initSession: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user) {
        set({ user: null, session: null, profile: null, loading: false });
        return;
      }
      const session = data.session;
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      set({
        user: session.user,
        session,
        profile: profileData ?? null,
        loading: false,
      });
    } catch {
      set({ user: null, session: null, profile: null, loading: false });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, authError: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        set({ loading: false, authError: error.message });
        return;
      }
      const session = data.session;
      const user = data.user;
      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        set({
          user,
          session: session ?? null,
          profile: profileData ?? null,
          loading: false,
          showAuthModal: false,
        });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false, authError: "Errore di connessione. Riprova." });
    }
  },

  signUp: async (email, password, displayName) => {
    set({ loading: true, authError: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName ?? email.split("@")[0] },
        },
      });
      if (error) {
        set({ loading: false, authError: error.message });
        return;
      }
      const user = data.user;
      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        set({
          user,
          session: data.session ?? null,
          profile: profileData ?? null,
          loading: false,
          showAuthModal: false,
          authView: "login",
        });
      } else {
        set({ loading: false, authView: "login", authError: "Registrazione inviata. Verifica la tua email." });
      }
    } catch {
      set({ loading: false, authError: "Errore di connessione. Riprova." });
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
    set({ user: null, session: null, profile: null, loading: false });
  },

  setShowAuthModal: (show) => set({ showAuthModal: show }),
  setAuthView: (view) => set({ authView: view, authError: null }),
  clearAuthError: () => set({ authError: null }),
}));
