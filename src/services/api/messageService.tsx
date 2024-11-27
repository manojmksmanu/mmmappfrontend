import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";
interface User {
  _id: string;
  name: string;
  userType: any;
}
// const API_URL = "https://mmmappbackend-yrsy.onrender.com/api";

const API_URL = `${BASE_URL}/api`;

export const getMessages = async (
  chatId: string,
  setMessages: any,
  token: any,
  setLoadingMessages: any
): Promise<any[]> => {
  setLoadingMessages(true);
  try {
    const response = await axios.get(`${API_URL}/messages/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(chatId, response.data);
    setLoadingMessages(false);
    return response.data;
  } catch (error: any) {
    setLoadingMessages(false);
    return [];
  } finally {
    setLoadingMessages(false);
  }
};

export const forward = async (
  chatId: string,
  messagesToForward: any,
  loggedUserId: string,
  loggedUserName: string,
  token: any
): Promise<void> => {
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

export const markMessageRead = async (
  chatId: any,
  userId: any,
  token: any
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/message-mark-read`,
      { chatId, userId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data; // Return the response data if needed
  } catch (error) {
    throw error; // Rethrow the error for further handling if necessary
  }
};
