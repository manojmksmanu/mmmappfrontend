import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

// MMKV setup
const mmkv = new MMKV();
const mmkvStorage = {
  getItem: (key: string) => {
    const value = mmkv.getString(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: (key: string, value: any) => {
    mmkv.set(key, JSON.stringify(value));
  },
  removeItem: (key: string) => {
    mmkv.delete(key);
  },
};

// Zustand user store
interface UserStore {
  users: User[]; // Array to store all users
  setUsers: (users: User[]) => void; // Add all users
  removeAllUsers: () => void; // Remove all users
}

interface User {
  _id: string;
  name: string;
  email: string;
  [key: string]: any; // Additional optional fields
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      users: [],

      // Add all users to the store
      setUsers: (users) => {
        set({ users });
        mmkvStorage.setItem("users", users);
      },

      // Remove all users from the store
      removeAllUsers: () => {
        set({ users: [] });
        mmkvStorage.removeItem("users");
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
