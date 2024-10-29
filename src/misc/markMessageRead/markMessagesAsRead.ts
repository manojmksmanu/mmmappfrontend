import AsyncStorage from "@react-native-async-storage/async-storage";
import { markMessageRead } from "src/services/messageService";

export const markMessagesAsRead = async (
  chatId: any,
  userId: any,
  setMessages: any
) => {
  try {
    const storedMessages = await AsyncStorage.getItem(`globalMessages`);
    const messagesData = storedMessages ? JSON.parse(storedMessages) : [];
    const updatedMessages = messagesData.map((message) => {
      if (!message?.readBy?.includes(userId)) {
        return {
          ...message,
          readBy: [...message.readBy, userId],
          status: "read",
        };
      }
      return message;
    });
    await AsyncStorage.setItem(
      `globalMessages`,
      JSON.stringify(updatedMessages)
    );
    await markMessageRead(chatId, userId);
    setMessages(updatedMessages);
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};
