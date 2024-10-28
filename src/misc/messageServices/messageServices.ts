import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveMessageLocally = async (message: any, setMessages: any) => {
  try {
    const allMessages = await AsyncStorage.getItem("globalMessages");
    const messagesData = allMessages ? JSON.parse(allMessages) : [];
    const messageMap = new Map(messagesData.map((msg) => [msg.messageId, msg]));
    messageMap.set(message.messageId, {
      ...(messageMap.get(message.messageId) || {}),
      ...message,
    });

    const updatedMessages = Array.from(messageMap.values());
    await AsyncStorage.setItem(
      "globalMessages",
      JSON.stringify(updatedMessages)
    );

    setMessages((prevMessages) => {
      const messageMap = new Map(
        prevMessages.map((msg) => [msg.messageId, msg])
      );
      messageMap.set(message.messageId, message);
      return Array.from(messageMap.values());
    });
  } catch (error) {
    console.error("Error saving message locally:", error);
  }
};
