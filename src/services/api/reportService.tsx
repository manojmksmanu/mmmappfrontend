import axios from "axios";
import { BASE_URL } from "../config";
import { Alert } from "react-native";

export const ReportMessages = async (
  reporterId,
  selectedMessages,
  setSelectedMessages,
  reason,
  setReason,
  token
) => {
  if (!token) {
    console.error("No authentication token provided");
    alert("User token not found. Please log in again.");
    return;
  }
  console.log(token);

  try {
    const reportData = {
      reporterId,
      reports: selectedMessages.map((messageId) => ({
        reportedMessageId: messageId,
        reason,
      })),
    };

    const response = await axios.post(
      `${BASE_URL}/api/report/report-messages`,
      reportData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Server Response:", response.data.message);
    Alert.alert("Message Reported", `${response.data.message}`, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
    setSelectedMessages([]);
    setReason("");
  } catch (err: any) {
    if (err.response) {
      // Server responded with a status code outside the 2xx range
      console.error("API Error Response:", err.response.data);
      alert(`Server Error: ${err.response.data.message || "Unknown Error"}`);
    } else if (err.request) {
      // No response was received from the server
      console.error("No response from server", err.request);
      alert("No response received from the server. Please try again.");
    } else {
      console.error("Request Error:", err.message);
      alert("An error occurred while trying to report the message.");
    }
  }
};
