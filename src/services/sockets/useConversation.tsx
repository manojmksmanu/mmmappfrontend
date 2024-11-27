import { useEffect } from "react";
import { useSocket } from "src/context/useSocketContext";
import { useChatStore } from "../storage/chatStore";
import { useAuthStore } from "../storage/authStore";

export const useConversation = () => {
  const updatedMessage = useChatStore((state) => state.updateMessage);
  const updateChat = useChatStore((state) => state.updateChat);
  const noUnreadCountUpdateChat = useChatStore(
    (state) => state.noUnreadCountUpdateChat
  );
  const { loggedUser } = useAuthStore();
  const { socket } = useSocket();
  const chats = useChatStore((state) => state.chats);
  const selectedChatMMKV = useChatStore((state) => state.selectedChatMMKV);
  const chatsIds = chats.map((chat) => chat?._id);

  useEffect(() => {
    if (chatsIds.length > 0 && socket) {
      socket.emit("joinRoom", chatsIds);
    }
    const handleReceiveMessage = (newMessage) => {
      if (newMessage.sender === loggedUser._id) {
        updatedMessage(newMessage.chatId, newMessage.messageId, newMessage);
      } else {
        selectedChatMMKV?._id === newMessage.chatId
          ? noUnreadCountUpdateChat(
              newMessage.chatId,
              newMessage,
              loggedUser._id
            )
          : updateChat(newMessage.chatId, newMessage, loggedUser._id);
      }
    };
    const handleReceiveDocuments = (newMessage) => {
      if (newMessage.sender === loggedUser._id) {
        updatedMessage(newMessage.chatId, newMessage.messageId, newMessage);
      } else {
        selectedChatMMKV?._id === newMessage.chatId
          ? noUnreadCountUpdateChat(
              newMessage.chatId,
              newMessage,
              loggedUser._id
            )
          : updateChat(newMessage.chatId, newMessage, loggedUser._id);
      }
    };
    const handleForwardMessageReceived = (newMessage) => {
      if (newMessage.sender === loggedUser._id) {
        updatedMessage(newMessage.chatId, newMessage.messageId, newMessage);
      } else {
        selectedChatMMKV?._id === newMessage.chatId
          ? noUnreadCountUpdateChat(
              newMessage.chatId,
              newMessage,
              loggedUser._id
            )
          : updateChat(newMessage.chatId, newMessage, loggedUser._id);
      }
    };
    socket?.on("receiveMessage", handleReceiveMessage);
    socket?.on("receiveDocument", handleReceiveDocuments);
    socket?.on("forwarMessageReceived", handleForwardMessageReceived);

    return () => {
      socket?.off("receiveMessage", handleReceiveMessage);
      socket?.off("receiveDocument", handleReceiveDocuments);
      socket?.off("forwarMessageReceived", handleForwardMessageReceived);
    };
  }, [socket, chatsIds, updatedMessage]);

  return null; // Since this is a hook, return nothing here
};
