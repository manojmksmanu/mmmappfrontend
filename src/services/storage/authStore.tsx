import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storage } from "./storage";
// Define the store's interface
interface AuthStore {
  token: string | null;
  loggedUser: any | null;
  setToken: (token: string) => void;
  setLoggedUser: (user: any) => void;
  removeLoggedUser: () => void;
  removeToken: () => void;
}

// Create the Zustand store with persistence
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: storage.getItem("token"),
      loggedUser: storage.getItem("loggedUser")
        ? JSON.parse(storage.getItem("loggedUser")!)
        : null,

      setToken: (token: string) => {
        set({ token });
        storage.setItem("token", token);
      },

      setLoggedUser: (user: any) => {
        set({ loggedUser: user });
        storage.setItem("loggedUser", JSON.stringify(user));
      },

      removeLoggedUser: () => {
        set({ loggedUser: null });
        storage.removeItem("loggedUser");
      },

      removeToken: () => {
        set({ token: null, loggedUser: null });
        storage.removeItem("token");
        storage.removeItem("loggedUser");
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (key: string) => {
          return storage.getItem(key);
        },
        setItem: (key: string, value: any) => {
          storage.setItem(key, value);
        },
        removeItem: (key: string) => {
          storage.removeItem(key);
        },
      },
    }
  )
);
