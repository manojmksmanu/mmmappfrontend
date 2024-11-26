import { MMKV } from "react-native-mmkv";

export const mmkvStorage = new MMKV({
  id: "app-storage", // Storage identifier
  encryptionKey: "some-secret-key", // Optional encryption key
});

export const storage = {
  setItem: (key: string, value: any) => {
    mmkvStorage.set(key, JSON.stringify(value)); // Serialize before saving
  },
  getItem: (key: string) => {
    const value = mmkvStorage.getString(key); // Get string value
    return value ? JSON.parse(value) : null; // Parse JSON, return null if no value
  },
  removeItem: (key: string) => {
    mmkvStorage.delete(key); // Delete the item
  },
};
