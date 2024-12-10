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
  // Normalize `selectedMessages` to extract `messageId`
  const normalizedMessages = selectedMessages.map((item) => {
    if (typeof item === "string") {
      return item;
    } else if (typeof item === "object" && item.messageId) {
      return item.messageId;
    } else {
      throw new Error("Invalid message structure in selectedMessages");
    }
  });

  if (!token) {
    console.error("No authentication token provided");
    alert("User token not found. Please log in again.");
    return;
  }

  setReportLoading(true);

  try {
    const reportData = {
      reporterId,
      reports: normalizedMessages.map((messageId) => ({
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

    console.log(response.data, "updated chat");
    setReportLoading(false);
    Alert.alert("Message Reported", `${response.data.message}`, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
    setSelectedMessages([]);
    setReason("");
  } catch (err: any) {
    if (err.response) {
      //   alert(`Server Error: ${err.response.data || "Unknown Error"}`);
      alert(`Something went wrong. Please try again."}`);
    } else if (err.request) {
      alert("Something went wrong. Please try again.");
    } else {
      alert("Something went wrong. Try again later.");
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
      //   alert(`Server Error: ${err.response.data.message || "Unknown Error"}`);
      alert(`Something went wrong. Please try again."}`);
    } else if (err.request) {
      alert("Something went wrong. Please try again.");
    } else {
      alert("Something went wrong please try again after some time.");
    }
  } finally {
    setReportLoading(false);
  }
};
