import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./userContext";
import { useMessages } from "./messageContext";

interface ChatListUpdateInterface {
  handleFetchAgain: () => void;
  unreadCounts: { [key: string]: number };
  handleFetchAgainWhenScreenLoad: () => void;
  fetchLoading: boolean;
}

const ChatListUpdateContext = createContext<
  ChatListUpdateInterface | undefined
>(undefined);

export const ChatListUpdateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { chats, setChats, loggedUser, socket } = useAuth() as {
    selectedChat: any;
    loggedUser: any;
    socket: any;
    chats: any;
    setChats: any;
  };
  const { fetchAllMessages } = useMessages();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const handleFetchAgain = async () => {
    console.log("handlefetchingagain");
    const allMessages = await fetchAllMessages();
    const updatedUnreadCounts = await loadUnreadCounts();
    await updateChatListWithLatestMessages(allMessages);
    try {
      await AsyncStorage.setItem(
        "unreadCounts",
        JSON.stringify(updatedUnreadCounts)
      );
    } catch (error) {
      console.error("Failed to save unread counts to local storage:", error);
    }
  };

const handleFetchAgainWhenScreenLoad = async () => {
  console.log("Fetching messages and unread counts...");
  setFetchLoading(true); // Start loading state
  console.log("Setting fetchLoading to true");

  try {
    const allMessages = await fetchAllMessages(); // Fetch all messages
    const updatedUnreadCounts = await loadUnreadCounts(); // Get unread counts
    await updateChatListWithLatestMessages(allMessages); // Update chat list with latest messages

    // Store unread counts in AsyncStorage
    await AsyncStorage.setItem(
      "unreadCounts",
      JSON.stringify(updatedUnreadCounts)
    );
  } catch (error) {
    console.error("Error during fetching or saving data:", error);
  } finally {
    setFetchLoading(false); // Stop loading state
    console.log("Setting fetchLoading to false");
  }
};


  useEffect(() => {
    if (!socket) {
      console.log("Socket is not connected");
      return;
    }
    if (!chats) {
      console.log("No chats here yet");
      return;
    }
    socket.on("fetchAgain", (data) => {
      console.log(data, "data shfdhsdfhsdhf");
      const chatExists = chats.some((chat: any) => chat._id === data);
      if (chatExists) {
        handleFetchAgain();
      }
    });
    return () => {
      socket.off("fetchAgain");
    };
  }, [socket, chats]);

  useEffect(() => {
    const loadInitialUnreadCounts = async () => {
      try {
        const savedUnreadCounts = await AsyncStorage.getItem("unreadCounts");
        if (savedUnreadCounts) {
          setUnreadCounts(JSON.parse(savedUnreadCounts));
        }
      } catch (error) {
        console.error("Failed to load unread counts:", error);
      }
    };
    loadInitialUnreadCounts();
  }, []);
  const loadUnreadCounts = async () => {
    console.log('load unread counts')
    const counts = await countUnreadMessages();
    setUnreadCounts(counts);
    return counts;
  };

  const countUnreadMessages = async () => {
    const chatUnreadCount = new Map();
    const messagesJson = await AsyncStorage.getItem("globalMessages");
    const messages = messagesJson ? JSON.parse(messagesJson) : [];
    const loggedUserId = loggedUser?._id;
    messages.forEach((message: any) => {
      const { chatId, readBy } = message;
      if (!readBy?.includes(loggedUserId)) {
        chatUnreadCount.set(chatId, (chatUnreadCount.get(chatId) || 0) + 1);
      }
    });
    return Object.fromEntries(chatUnreadCount);
  };

  const updateChatListWithLatestMessages = async (allMessages) => {
    const latestMessagesByChatId = {};
    allMessages.forEach((message: any) => {
      const chatId = message.chatId;
      if (
        !latestMessagesByChatId[chatId] ||
        new Date(message.createdAt) >
          new Date(latestMessagesByChatId[chatId].createdAt)
      ) {
        latestMessagesByChatId[chatId] = message;
      }
    });
    const updatedChats = chats?.map((chat: any) => {
      const latestMessage = latestMessagesByChatId[chat._id];
      if (latestMessage) {
        return {
          ...chat,
          latestMessage: latestMessage,
          updatedAt: latestMessage.createdAt,
        };
      }
      return chat;
    });
    const sortedChats = updatedChats?.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    if (Array.isArray(sortedChats) && sortedChats.length > 0) {
      setChats(sortedChats);
      try {
        await AsyncStorage.setItem("chats", JSON.stringify(sortedChats));
      } catch (error) {
        console.error("Failed to update local storage:", error);
      }
    } else {
      console.warn("No chats available to update in AsyncStorage");
    }
  };

  return (
    <ChatListUpdateContext.Provider
      value={{
        unreadCounts,
        handleFetchAgain,
        handleFetchAgainWhenScreenLoad,
        fetchLoading,
      }}
    >
      {children}
    </ChatListUpdateContext.Provider>
  );
};
export const useUpdateChatList = () => {
  const context = useContext(ChatListUpdateContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a ContextProvider");
  }
  return context;
};
