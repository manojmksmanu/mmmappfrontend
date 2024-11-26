import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storage } from "./storage"; // Import the MMKV storage helper

// Define the store's interface
interface AuthStore {
  token: string | null; // Token can be string or null
  loggedUser: any | null; // User object can be any type or null
  setToken: (token: string) => void; // Function to set token
  setLoggedUser: (user: any) => void; // Function to set logged user
  removeLoggedUser: () => void; // Function to clear logged user
  removeToken: () => void; // Function to clear token and logged user
}

// Create the Zustand store with persistence
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: storage.getItem("token"), // Initialize token from MMKV
      loggedUser: storage.getItem("loggedUser")
        ? JSON.parse(storage.getItem("loggedUser")!)
        : null, // Initialize loggedUser from MMKV, parsed from JSON

      setToken: (token: string) => {
        set({ token });
        storage.setItem("token", token); // Save token in MMKV
      },

      setLoggedUser: (user: any) => {
        set({ loggedUser: user });
        storage.setItem("loggedUser", JSON.stringify(user)); // Save user as JSON in MMKV
      },

      removeLoggedUser: () => {
        set({ loggedUser: null });
        storage.removeItem("loggedUser"); // Remove loggedUser from MMKV
      },

      removeToken: () => {
        set({ token: null, loggedUser: null });
        storage.removeItem("token"); // Remove token from MMKV
        storage.removeItem("loggedUser"); // Remove loggedUser from MMKV
      },
    }),
    {
      name: "auth-storage", // Name for the persisted storage
      storage: {
        getItem: (key: string) => {
          return storage.getItem(key); // Use the MMKV getItem
        },
        setItem: (key: string, value: any) => {
          storage.setItem(key, value); // Use the MMKV setItem
        },
        removeItem: (key: string) => {
          storage.removeItem(key); // Use the MMKV removeItem
        },
      },
    }
  )
);
