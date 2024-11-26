import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useChatStore } from "src/services/storage/chatStore";

interface User {
  _id: string;
  name: string;
  userType: any;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
}

interface Chat {
  _id: string;
  users: User[];
  chatType: any;

  // Add other properties as needed
}
interface AuthContextType {
  selectedChat: Chat[] | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat[] | null>>;
}

type RootStackParamList = {
  ChatList: undefined;
  ChatWindow: { chatId: string };
  Login: undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [selectedChat, setSelectedChat] = useState<Chat[] | null>(null);
  const { selectedChatMMKV, setSelectedChatMMKV } = useChatStore();
  // useEffect(() => {
  //   console.log(selectedChat?._id,'setted')
  //   setSelectedChatMMKV(selectedChat || null);
  // }, [selectedChat]);
  return (
    <AuthContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
