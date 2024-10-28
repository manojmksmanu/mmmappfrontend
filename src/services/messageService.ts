import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  _id: string;
  name: string;
  userType: any;
}
// const API_URL = "https://mmmappbackend.onrender.com/api";
const API_URL = "http://10.0.2.2:5000/api";
export const getMessages = async (chatId: string): Promise<any[]> => {
  const token = await AsyncStorage.getItem("token");
  const response = await axios.get(`${API_URL}/messages/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const getAllMessages = async (userId: any): Promise<any[]> => {
  console.log(userId, "on got");
  try {
    const token = await AsyncStorage.getItem("token");

    // Check if the token is available
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${API_URL}/messages/all/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data; // This already contains the parsed JSON data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error fetching all messages  messages:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching messages:", error);
    }

    // Return an empty array as a fallback
    return [];
  }
};
export const sendMessage = async (messageData: any): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    const response = await axios.post(
      `${API_URL}/message`,
      {
        chatId: messageData.chatId,
        sender: messageData.sender,
        senderName: messageData.senderName,
        message: messageData.message,
        fileUrl: messageData.fileUrl,
        fileType: messageData.fileType,
        messageId: messageData.messageId,
        replyingMessage: messageData.replyingMessage,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // console.log('Message sent successfully:', response.data);
  } catch (error: any) {
    // Log full error object
    console.error(
      "Error sending message:",
      error.response || error.message || error
    );
  }
};

export const forward = async (
  chatId: string,
  messagesToForward: any,
  loggedUserId: string,
  loggedUserName: string
): Promise<void> => {
  const token = await AsyncStorage.getItem("token");
  await axios.post(
    `${API_URL}/forwardMessages`,
    {
      chatId: chatId,
      messages: messagesToForward,
      loggedUserId: loggedUserId,
      loggedUserName: loggedUserName,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const markMessageRead = async (chatId: any, userId: any) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/message-mark-read`,
      { chatId, userId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("marked");
    return response.data; // Return the response data if needed
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error; // Rethrow the error for further handling if necessary
  }
};
