import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllMessages, getMessages } from "src/services/messageService";
import { useAuth } from "./userContext";

interface MessageContextType {
  allMessages: Message[] | null;
  setAllMessages: React.Dispatch<React.SetStateAction<Message[] | null>>;
  fetchAllMessages: () => void;
}

interface Message {
  _id: string;
  chatId: string;
  sender: string;
  senderName: string;
  message: string;
  messageId: string;
  replyingMessage?: any;
}
interface loggedUser {
  _id: string;
}

const API_URL = "http://10.0.2.2:5000";
// const API_URL = "https://reactnativeassignment.onrender.com";

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const { selectedChat, loggedUser } = useAuth() as {
    selectedChat: any;
    loggedUser: loggedUser;
  };
  const [allMessages, setAllMessages] = useState<Message[] | null>(null);

  const fetchAllMessages = async () => {
    try {
      const response: any = await getAllMessages(loggedUser._id);
      if (!Array.isArray(response)) {
        throw new TypeError("Expected chatsData to be an array");
      }
      if (response) {
        await AsyncStorage.setItem("globalMessages", JSON.stringify(response));
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
    }
  };
  return (
    <MessageContext.Provider
      value={{ allMessages, setAllMessages, fetchAllMessages }}
    >
      {children}
    </MessageContext.Provider>
  );
};

// Custom hook to use the MessageContext
export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a ContextProvider");
  }
  return context;
};
