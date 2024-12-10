import axios from "axios";
import { BASE_URL } from "../config";
import { Alert } from "react-native";

export const BlockUser = async (
  chatId,
  reportedUserId,
  token,
  updateSingleChat,
  setSelectedChat,
  setBlockUserLoading
) => {
  setBlockUserLoading(true);
  try {
    const response = await axios.post(
      `${BASE_URL}/api/block/block-user`,
      { chatId, reportedUserId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { updatedChatData } = response.data;

    updateSingleChat(chatId, updatedChatData);
    setSelectedChat(updatedChatData);
    setBlockUserLoading(false);
    Alert.alert("User blocked successfully", `${response.data.message}`, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  } catch (err: any) {
    if (err.response && err.response.data) {
      alert(`${err.response.data.error}`);
    } else if (err.request) {
      alert("No response received from the server. Please try again.");
    } else {
      alert("An error occurred while trying to block the user");
    }
  } finally {
    setBlockUserLoading(false);
  }
};
export const UnBlockUser = async (
  chatId,
  reportedUserId,
  token,
  updateSingleChat,
  setSelectedChat,
  setBlockUserLoading
) => {
  setBlockUserLoading(true);
  try {
    const response = await axios.post(
      `${BASE_URL}/api/block/unblock-user`,
      { chatId, reportedUserId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 200) {
      const { updatedChatData } = response.data;
      updateSingleChat(chatId, updatedChatData);
      setSelectedChat(updatedChatData);
      setBlockUserLoading(false);
      Alert.alert("User unblocked successfully", response.data.message);
    }
  } catch (err: any) {
    if (err.response && err.response.data) {
      Alert.alert("Failed to unblock user", err.response.data.error);
    } else {
      Alert.alert("Server or network error. Please try again.");
    }
  } finally {
    setBlockUserLoading(false);
  }
};
