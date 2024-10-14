import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import mime from "react-native-mime-types";
import { showMessage } from "react-native-flash-message";
import { connect } from "socket.io-client";
import { Platform } from "react-native";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "@react-native-firebase/storage";
import type {
  DocumentPickerResult,
  DocumentPickerSuccessResult,
} from "expo-document-picker";
// Function to get file type from URI
const getFileTypeFromUri = (uri: string): string => {
  const extension = uri.split(".").pop()?.toLowerCase();
  if (extension) {
    const mimeType = mime.lookup(extension);
    return mimeType || "unknown";
  }
  return "unknown";
};

// Function to get real path from URI
const getRealPathFromUri = async (
  uri: string,
  fileType: any
): Promise<string | null> => {
  if (uri.startsWith("file://")) {
    return uri.replace("file://", "");
  }
  const fileData = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const extension = mime.extension(fileType) || "unknown";
  const newFilePath = `${
    FileSystem.documentDirectory
  }${new Date().getTime()}.${extension}`;
  await FileSystem.writeAsStringAsync(newFilePath, fileData, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return newFilePath;
};

// Function to open the document picker
export const openDocumentPicker = async (
  setSending: any,
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>,
  setSendingPercentage: any,
  checkAndSaveMessageLocally: any,
  chatId: any,
  sender: string,
  senderName: string,
  replyingMessage: any,
  messageId: any,
  socket: any
) => {
  const result: DocumentPickerResult = await DocumentPicker.getDocumentAsync({
    type: "*/*",
  });

  // Check if the result is successful
  if (result.type === "success") {
    const documentUri = (result as DocumentPickerSuccessResult).uri; // Type assertion
    const fileName = (result as DocumentPickerSuccessResult).name; // Type assertion
    const fileType = (result as DocumentPickerSuccessResult).mimeType; // Type assertion

    if (documentUri && fileName) {
      const decodedUri = await getRealPathFromUri(documentUri, fileType);
      if (decodedUri) {
        await uploadFileToFirebase(
          decodedUri,
          fileType,
          fileName,
          setSending,
          setIsSending,
          setSendingPercentage,
          checkAndSaveMessageLocally,
          chatId,
          sender,
          senderName,
          replyingMessage,
          messageId,
          socket
        );
      } else {
        console.warn("Failed to resolve URI to a file path");
      }
    } else {
      console.warn("No document URI or file name found");
    }
  } else {
    console.log("User canceled document picker");
  }
};

// Function to request camera permission
const requestCameraPermission = async () => {
  if (Platform.OS === "android") {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === "granted";
  }
  return true; // iOS permissions are granted automatically
};

// Function to open the camera
export const openCamera = async (
  setSending: any,
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>,
  setSendingPercentage: any,
  checkAndSaveMessageLocally: any,
  chatId: any,
  sender: string,
  senderName: string,
  replyingMessage: any,
  messageId: any,
  socket: any
) => {
  const hasPermission = await requestCameraPermission();
  if (hasPermission) {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const decodedUri = result.assets[0].uri;
      const fileType = result.assets[0].type || "image/jpeg";
      const fileName = result.assets[0].fileName || "image_upload.jpg";

      if (decodedUri) {
        await uploadFileToFirebase(
          decodedUri,
          fileType,
          fileName,
          setSending,
          setIsSending,
          setSendingPercentage,
          checkAndSaveMessageLocally,
          chatId,
          sender,
          senderName,
          replyingMessage,
          messageId,
          socket
        );
      }
    } else {
      console.log("User canceled camera");
    }
  } else {
    console.log("Camera permission denied");
  }
};

// Function to upload file to Firebase
const uploadFileToFirebase = async (
  fileUri: string,
  fileType: any,
  fileName: string,
  setSending: any,
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>,
  setSendingPercentage: any,
  checkAndSaveMessageLocally: any,
  chatId: any,
  sender: string,
  senderName: string,
  replyingMessage: any,
  messageId: any,
  socket: any
) => {
  const reference = storage().ref(`/uploads/${fileName}`);
  const uploadTask = reference.putFile(fileUri);

  const tempMessage = {
    chatId,
    sender,
    senderName,
    message: fileName,
    fileUrl: "",
    fileType,
    messageId,
    replyingMessage,
    status: "uploading",
  };

  checkAndSaveMessageLocally(tempMessage);

  uploadTask.on(
    "state_changed",
    (snapshot: any) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setSendingPercentage(`${progress.toFixed(2)}`);
      setSending(fileName);
      setIsSending(true);
    },
    async (error: any) => {
      console.error("Error uploading file:", error);
      showMessage({
        message: `Upload failed: ${error.message}`,
        type: "danger", // Use 'danger' for error messages
      });
      setIsSending(false);
    },
    async () => {
      try {
        const downloadURL = await reference.getDownloadURL();
        const newMessage = {
          ...tempMessage,
          fileUrl: downloadURL,
          status: "sent",
        };

        if (socket) {
          socket.emit("sendDocument", newMessage);
          await checkAndSaveMessageLocally(newMessage);
        }

        setIsSending(false);
        setSending("");
      } catch (error: any) {
        console.error("Error getting download URL:", error);
        showMessage({
          message: `Failed to retrieve URL: ${error.message}`,
          type: "danger", // Use 'danger' for error messages
        });
        setIsSending(false);
      }
    }
  );
};
