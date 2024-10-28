import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MessageContextType {
  allMessages: Message[] | null;
  setAllMessages: React.Dispatch<React.SetStateAction<Message[] | null>>;
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

// const API_URL = "http://10.0.2.2:5000";
const API_URL = "https://reactnativeassignment.onrender.com";

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [allMessages, setAllMessages] = useState<Message[] | null>(null);

  // Function to fetch new messages (or perform your desired update)
  const fetchNewMessages = async () => {
    try {
      // Replace this URL with your API endpoint for fetching messages
      const response = await fetch(`${API_URL}/messages`);
      const data = await response.json();
      setAllMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchNewMessages(); // Fetch messages initially
    const intervalId = setInterval(() => {
      fetchNewMessages(); // Fetch messages every 1 minute (60000 milliseconds)
    }, 60000);
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <MessageContext.Provider value={{ allMessages, setAllMessages }}>
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
