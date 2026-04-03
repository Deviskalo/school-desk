import { create } from "zustand";
import { account } from "@appwrite/client";
import { syncEngine } from "@sync/syncEngine";
import type { Models } from "appwrite";

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  setUser: (user: Models.User<Models.Preferences> | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    try {
      syncEngine.stop();
      await account.deleteSession("current");
    } catch {
      // Session may already be expired — proceed anyway
    } finally {
      set({ user: null, loading: false });
    }
  },
}));
