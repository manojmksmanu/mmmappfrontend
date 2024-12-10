import axios from "axios";
import { BASE_URL } from "../config";
import { Alert } from "react-native";

export const BlockUser = async (chatId, reportedUserId, token) => {
  //   setReportLoading(true);
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
    // setReportLoading(false);
    Alert.alert("User blocked successfully", `${response.data.message}`, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  } catch (err: any) {
    if (err.response && err.response.data) {
      console.error("Error:", err.response.data.error);
      console.log("Chat state:", err.response.data.chat);

      alert(`${err.response.data.error}`);
    } else if (err.request) {
      alert("No response received from the server. Please try again.");
    } else {
      alert("An error occurred while trying to report the message.");
    }
  } finally {
    // setReportLoading(false);
  }
};
