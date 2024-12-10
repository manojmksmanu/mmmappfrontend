import axios from "axios";
import { BASE_URL } from "../config";
import { Alert } from "react-native";

export const ReportMessages = async (
  reporterId,
  selectedMessages,
  setSelectedMessages,
  reason,
  setReason,
  token,
  setReportLoading
) => {
  if (!token) {
    console.error("No authentication token provided");
    alert("User token not found. Please log in again.");
    return;
  }
  setReportLoading(true);
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
    setReportLoading(false);
    Alert.alert("Message Reported", `${response.data.message}`, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
    setSelectedMessages([]);
    setReason("");
  } catch (err: any) {
    if (err.response) {
      alert(`Server Error: ${err.response.data.message || "Unknown Error"}`);
    } else if (err.request) {
      alert("No response received from the server. Please try again.");
    } else {
      alert("An error occurred while trying to report the message.");
    }
  } finally {
    setReportLoading(false);
  }
};

export const ReportUser = async (
  reporterId,
  reportedUserId,
  reason,
  setReason,
  token,
  setReportLoading
) => {
  setReportLoading(true);
  try {
    const response = await axios.post(
      `${BASE_URL}/api/report/report-user`,
      { reporterId, reportedUserId, reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setReportLoading(false);
    Alert.alert("User reported successfully", `${response.data.message}`, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
    setReason("");
  } catch (err: any) {
    if (err.response) {
      alert(`Server Error: ${err.response.data.message || "Unknown Error"}`);
    } else if (err.request) {
      alert("No response received from the server. Please try again.");
    } else {
      alert("An error occurred while trying to report the message.");
    }
  } finally {
    setReportLoading(false);
  }
};
