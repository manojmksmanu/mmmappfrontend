import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { AppState } from "react-native";
import io, { Socket } from "socket.io-client";
import { useAuthStore } from "src/services/storage/authStore";
import { BASE_URL } from "src/services/config";

interface SocketContextType {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
  onlineUsers: any;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { loggedUser } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    const socketInstance = io(BASE_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    setSocket(socketInstance);

    // Cleanup function to disconnect when the component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !loggedUser?._id) return;

    // Emit online status when the socket is ready and the user is logged in
    socket.emit("userOnline", loggedUser._id);

    socket.on("getOnlineUsers", (users: any) => {
      setOnlineUsers(users); // Update online users state
    });

    const handleAppStateChange = (nextAppState: string) => {
      console.log("App State changed:", nextAppState); // Log app state changes for debugging

      if (nextAppState === "background" && socket && loggedUser?._id) {
        socket.emit("userOffline", loggedUser._id); // Notify server user is offline
      } else if (nextAppState === "active" && socket && loggedUser?._id) {
        socket.emit("userOnline", loggedUser._id); // Notify server user is online
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Cleanup app state subscription on unmount
    return () => {
      subscription.remove();
    };
  }, [socket, loggedUser?._id]);

  return (
    <SocketContext.Provider value={{ socket, setSocket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
