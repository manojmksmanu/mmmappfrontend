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
  setMessages: (chatId: string, newMessages: Message[]) => Promise<void>;
  clearChatData: () => void;
  deleteSelectedChatMMKV: () => void; // Action to delete selected chat
}

interface Chat {
  _id: string;
  name: string;
  latestMessage: Message;
  users: any;
  unreadCounts: any;
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
      selectedChatMMKV: null,
      setChats: (chats) => {
        set({ chats });
        mmkvStorage.setItem("chats", chats);
      },

      updateChat: (chatId, newMessage, loggedUserId) => {
        console.log("hitted this");
        const { createdAt, messageId, ...restOfMessage } = newMessage;
        const messageWithCreatedAt = {
          ...restOfMessage,
          createdAt: createdAt || newMessage.timestamp || Date.now(),
          messageId,
        };

        const updatedChats = get().chats.map((chat) => {
          if (chat._id === chatId) {
            const updatedUnreadCounts = { ...chat.unreadCounts };

            if (newMessage.sender !== loggedUserId) {
              updatedUnreadCounts[loggedUserId] =
                (updatedUnreadCounts[loggedUserId] || 0) + 1;
            }
            return {
              ...chat,
              latestMessage: messageWithCreatedAt,
              unreadCounts: updatedUnreadCounts,
              updatedAt: new Date().toISOString(),
            };
          }
          return chat;
        });
        const sortedChats = updatedChats.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        set({ chats: sortedChats });
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
              updatedAt: new Date().toISOString(),
            };
          }
          return chat;
        });
        const sortedChats = updatedChats.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        set({ chats: sortedChats });

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
        const updatedChats = get().chats.map((chat) => {
          const updatedUnreadCounts = { ...chat.unreadCounts };
          if (userId) {
            updatedUnreadCounts[userId] = 0;
          }
          if (chat._id === chatId) {
            return { ...chat, unreadCounts: updatedUnreadCounts };
          }
          return chat;
        });

        // Update the state with the new chats
        set({ chats: updatedChats });

        const updatedMessages = (get().messages[chatId] || []).map(
          (message) => {
            const updatedReadBy = message.readBy?.includes(userId)
              ? message.readBy
              : [...(message.readBy || []), userId];

            const allUsersRead = get()
              .chats.find((chat) => chat._id === chatId)
              ?.users.every((user) => updatedReadBy.includes(user.user._id));

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
      setMessages: async (chatId, newMessages) => {
        try {
          // Retrieve the existing messages from MMKV storage
          const storedMessages = mmkvStorage.getItem("messages") || {};
          const currentMessages = storedMessages[chatId] || [];

          // Update or add messages based on `messageId`
          const updatedMessagesMap = new Map();
          currentMessages.forEach((msg) =>
            updatedMessagesMap.set(msg.messageId, msg)
          );

          newMessages.forEach((newMsg) => {
            updatedMessagesMap.set(newMsg.messageId, {
              ...updatedMessagesMap.get(newMsg.messageId),
              ...newMsg,
            });
          });

          // Convert the Map back to an array and sort by `createdAt`
          const updatedMessages = Array.from(updatedMessagesMap.values()).sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          // Update the Zustand state
          set({
            messages: {
              ...get().messages,
              [chatId]: updatedMessages,
            },
          });

          // Save the updated messages back to MMKV storage
          mmkvStorage.setItem("messages", {
            ...storedMessages,
            [chatId]: updatedMessages,
          });
        } catch (error) {
          console.error("Error updating messages:", error);
        }
      },

      clearChatData: () => {
        // Clear in Zustand state
        set({
          chats: [],
          messages: {},
          selectedChatMMKV: null,
        });

        // Clear in MMKV storage
        mmkvStorage.removeItem("chats");
        mmkvStorage.removeItem("messages");
        mmkvStorage.removeItem("selectedChatMMKV");
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
