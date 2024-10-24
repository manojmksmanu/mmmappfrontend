import AsyncStorage from "@react-native-async-storage/async-storage";
import { markMessageRead } from "src/services/messageService";

export const markMessagesAsRead = async (
  chatId: any,
  userId: any,
  setMessages: any
) => {
  try {
    // Fetch messages for the chat from local storage
    const storedMessages = await AsyncStorage.getItem(`messages-${chatId}`);
    const messagesData = storedMessages ? JSON.parse(storedMessages) : [];

    // Update local messages to mark them as read
    const updatedMessages = messagesData.map((message) => {
      if (!message?.readBy.includes(userId)) {
        return {
          ...message,
          readBy: [...message.readBy, userId], // Add userId to readBy
          status: "read", // Update status if necessary
        };
      }
      return message;
    });

    // Save updated messages to local storage
    await AsyncStorage.setItem(
      `messages-${chatId}`,
      JSON.stringify(updatedMessages)
    );

    await markMessageRead(chatId, userId);
    // Update state
    setMessages(updatedMessages);
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};
