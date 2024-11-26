import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";
import { useAuthStore } from "../storage/authStore";
const API_URL = `${BASE_URL}/api`;

export const getAllChats = async (
  userId: string,
  setChats: any
): Promise<any> => {
  const token = await useAuthStore.getState().token;
  console.log(token);
  try {
    const response = await axios.get(`${API_URL}/chat/${userId}/chats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // await setChats(response.data);
  } catch (err: any) {
    console.error(
      "Failed to fetch users:",
      err.response ? err.response.data : err.message
    );
    throw err;
  }
};

export const getAllUsers = async (currentUserType: string,setUsers:any, token: any) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      params: { currentUserType },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = response.data;
    setUsers(users);
    return users;
  } catch (error: any) {
    console.error("Error fetching users for chat:", error);
    const errorMessage =
      error.response?.data?.error || "Failed to fetch users.";
    throw new Error(errorMessage);
  }
};

export const createGroupChat = async (users: any, groupName: string,token:any) => {
  if (!token) {
    console.error("No token found");
    return;
  }
  try {
    const response = await axios.post(
      `${API_URL}/chat/creategroup`,
      {
        users,
        groupName,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = response.data;
    return data;
  } catch (error: any) {
    console.error("Error fetching users for chat:", error);
    const errorMessage =
      error.response?.data?.error || "Failed to fetch users.";
    throw new Error(errorMessage);
  }
};

export const removeUserFromGroup = async (chatId: any, userId: any) => {
  console.log(chatId, userId);
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await axios.patch(
      `${API_URL}/chat/removeuserfromgroup`,
      {
        chatId,
        userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log(error, "errorrrr");
    console.error(error, "error");
    const errorMessage = error.response?.data?.error || "something went wrong";
    throw new Error(errorMessage);
  }
};
export const addUserToGroupChat = async (chatId: any, users: any) => {
  console.log(chatId, users);
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await axios.patch(
      `${API_URL}/chat/adduserstogroup`,
      {
        chatId,
        users,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log(error, "errorrrr");
    console.error(error, "error");
    const errorMessage = error.response?.data?.error || "something went wrong";
    throw new Error(errorMessage);
  }
};

export const renameGroupName = async (chatId: any, newGroupName: string) => {
  console.log(chatId, newGroupName);
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await axios.patch(
      `${API_URL}/chat/grouprename`,
      {
        chatId,
        newGroupName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log(error, "errorrrr");
    console.error(error, "error");
    const errorMessage = error.response?.data?.error || "something went wrong";
    throw new Error(errorMessage);
  }
};
