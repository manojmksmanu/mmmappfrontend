import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { useAuth } from "src/context/userContext";

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

// Zustand store
interface ChatStore {
  chats: Chat[];
  messages: Record<string, Message[]>; // Store messages as an object of arrays by chatId
  selectedChatMMKV: any | null; // To store selected chatId
  setChats: (chats: Chat[]) => void;
  updateChat: (chatId: string, newMessage: Message, loggedUserId: any) => void;
  noUnreadCountUpdateChat: (
    chatId: string,
    newMessage: Message,
    loggedUserId: any
  ) => void;
  updateMessage: (
    chatId: string,
    messageId: string,
    updatedMessage: Message
  ) => void;
  removeAllMessages: any;
  markAsRead: (chatId: string, userId: any) => void;
  setSelectedChatMMKV: (any) => void; // Action to set selected chat
  deleteSelectedChatMMKV: () => void; // Action to delete selected chat
}

interface Chat {
  _id: string;
  name: string;
  latestMessage: Message;
  users: any;
  unreadCount: number;
  isGroup: boolean;
  updatedAt: any;
}

type Message = {
  sender?: string;
  text?: string;
  timestamp?: number;
  seen?: boolean;
  sent?: boolean;
  chatId: string;
  messageId: string;
  fileUrl?: string | null;
  fileType?: string;
  replyingMessage?: string;
  status: any;
  readBy: string[];
  createdAt: any;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      messages: {},
      selectedChatMMKV: null, // Initialize selectedChat as null
      setChats: (chats) => {
        set({ chats });
        mmkvStorage.setItem("chats", chats);
      },

      updateChat: (chatId, newMessage, loggedUserId) => {
        const { createdAt, messageId, ...restOfMessage } = newMessage;
        const messageWithCreatedAt = {
          ...restOfMessage,
          createdAt: createdAt || newMessage.timestamp || Date.now(),
          messageId,
        };

        const updatedChats = get().chats.map((chat) => {
          if (chat._id === chatId) {
            const incrementUnreadCount =
              messageWithCreatedAt.sender !== loggedUserId
                ? chat.unreadCount + 1
                : chat.unreadCount;

            return {
              ...chat,
              latestMessage: messageWithCreatedAt,
              unreadCount: incrementUnreadCount,
              updatedAt: Date.now(),
            };
          }
          return chat;
        });

        set({ chats: updatedChats.sort((a, b) => b.updatedAt - a.updatedAt) });

        const currentMessages = get().messages[chatId] || [];
        const messageExists = currentMessages.some(
          (message) => message.messageId === messageId
        );

        const updatedMessages = messageExists
          ? currentMessages
          : [...currentMessages, messageWithCreatedAt];

        mmkvStorage.setItem("messages", {
          ...get().messages,
          [chatId]: updatedMessages,
        });

        set({
          messages: {
            ...get().messages,
            [chatId]: updatedMessages,
          },
        });
      },
      noUnreadCountUpdateChat: (chatId, newMessage, loggedUserId) => {
        const { createdAt, messageId, ...restOfMessage } = newMessage;
        const messageWithCreatedAt = {
          ...restOfMessage,
          createdAt: createdAt || newMessage.timestamp || Date.now(),
          messageId,
        };

        const updatedChats = get().chats.map((chat) => {
          if (chat._id === chatId) {
            return {
              ...chat,
              latestMessage: messageWithCreatedAt,
              updatedAt: Date.now(),
            };
          }
          return chat;
        });

        set({ chats: updatedChats.sort((a, b) => b.updatedAt - a.updatedAt) });

        const currentMessages = get().messages[chatId] || [];
        const messageExists = currentMessages.some(
          (message) => message.messageId === messageId
        );

        const updatedMessages = messageExists
          ? currentMessages
          : [...currentMessages, messageWithCreatedAt];

        mmkvStorage.setItem("messages", {
          ...get().messages,
          [chatId]: updatedMessages,
        });

        set({
          messages: {
            ...get().messages,
            [chatId]: updatedMessages,
          },
        });
      },

      updateMessage: (chatId, messageId, updatedMessage) => {
        const chatMessages = get().messages[chatId] || [];
        const updatedMessages = chatMessages.map((message) =>
          message.messageId === messageId
            ? { ...message, ...updatedMessage }
            : message
        );

        mmkvStorage.setItem("messages", {
          ...get().messages,
          [chatId]: updatedMessages,
        });

        set({
          messages: {
            ...get().messages,
            [chatId]: updatedMessages,
          },
        });
      },

      removeAllMessages: () => {
        const updatedMessages = {};
        set({ messages: updatedMessages });
        mmkvStorage.setItem("messages", updatedMessages);
      },

      markAsRead: (chatId, userId) => {
        const updatedChats = get().chats.map((chat) =>
          chat._id === chatId ? { ...chat, unreadCount: 0 } : chat
        );
        set({ chats: updatedChats });

        const updatedMessages = (get().messages[chatId] || []).map(
          (message) => {
            const updatedReadBy = message.readBy?.includes(userId)
              ? message.readBy
              : [...(message.readBy || []), userId];

            const allUsersRead = get()
              .chats.find((chat) => chat._id === chatId)
              ?.users.every((user) => updatedReadBy.includes(user._id));

            const updatedMessageStatus = allUsersRead ? "read" : message.status;

            return {
              ...message,
              readBy: updatedReadBy,
              status: updatedMessageStatus,
            };
          }
        );

        mmkvStorage.setItem("messages", {
          ...get().messages,
          [chatId]: updatedMessages,
        });

        set({
          messages: {
            ...get().messages,
            [chatId]: updatedMessages,
          },
        });
      },

      setSelectedChatMMKV: (chat: any | null) => {
        if (chat) {
          set({ selectedChatMMKV: chat });
          mmkvStorage.setItem("selectedChatMMKV", chat);
        } else {
          console.log("Error: Chat object is null or undefined");
        }
      },

      deleteSelectedChatMMKV: () => {
        const { selectedChatMMKV } = get();
        if (selectedChatMMKV) {
          mmkvStorage.removeItem("selectedChatMMKV"); // Remove from MMKV storage
          set({ selectedChatMMKV: null }); // Reset Zustand state to null
        }
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
