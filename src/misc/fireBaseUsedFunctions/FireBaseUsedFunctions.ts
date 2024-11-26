import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { showMessage } from "react-native-flash-message";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../fireBaseConfig/fireBaseConfig";
import * as MediaLibrary from "expo-media-library";
// --- request to access to filemanager of device --
export const requestDocumentPickerPermissions = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") {
    console.error("Permission to access media library was denied");
    return false;
  }
  return true;
};
// ---end here  request to access to filemanager of device --

export const openDocumentPicker = async (
  setSending: any,
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>,
  setSendingPercentage: any,
  chatId: any,
  sender: string,
  senderName: string,
  replyingMessage: any,
  messageId: any,
  socket: any,
  updateChat: any,
  updatedMessage: any
) => {
  const hasPermission = await requestDocumentPickerPermissions();
  if (!hasPermission) {
    return null;
  }

  try {
    const docRes = await DocumentPicker.getDocumentAsync({
      type: "*/*", // Allow all file types
    });
    console.log("Document Picker Response:", docRes);
    if (docRes.type === "cancel") {
      console.log("Document selection canceled");
      return null;
    }
    await uploadToFirebaseDocument(
      docRes,
      setSending,
      setIsSending,
      setSendingPercentage,
      chatId,
      sender,
      senderName,
      replyingMessage,
      messageId,
      socket,
      updateChat,
      updatedMessage
    );
    return docRes;
  } catch (err) {
    console.log("Error while picking document:", err);
    return null;
  }
};
export const uploadToFirebaseDocument = async (
  docRes: any,
  setSending: any,
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>,
  setSendingPercentage: any,
  chatId: any,
  sender: string,
  senderName: string,
  replyingMessage: any,
  messageId: any,
  socket: any,
  updateChat: any,
  updatedMessage: any
) => {
  if (!docRes || !docRes.assets || docRes.assets.length === 0) {
    console.error("Invalid document response");
    return;
  }

  const asset = docRes.assets[0];
  const { uri, name, mimeType } = asset;

  if (!uri) {
    console.error("No URI found for the selected document");
    return;
  }

  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `uploads/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    const tempMessage = {
      chatId,
      sender,
      senderName,
      message: name,
      fileUrl: "",
      fileType: mimeType,
      messageId,
      replyingMessage,
      status: "uploading",
      readBy: [sender],
    };
    await updateChat(chatId, tempMessage);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress monitoring (optional)
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        showMessage({
          message: "Error",
          description: "Upload Failed ",
          type: "danger",
        });
        console.error("Upload failed:", error);
      },
      async () => {
        // On successful upload
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", downloadURL);
          const newMessage = {
            ...tempMessage,
            fileUrl: downloadURL,
            status: "unsent",
          };

          if (socket) {
            socket.emit("sendDocument", newMessage);
            await updatedMessage(chatId, messageId, newMessage);
          }

          setIsSending(false);
          setSending("");
        } catch (error) {
          console.error("Error getting download URL:", error);
        }
      }
    );
  } catch (err) {
    console.log("Error while uploading document:", err);
  }
};

// --- request to access the camera ---
export const requestCameraPermissions = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    console.error("Permission to access camera was denied");
    return false;
  }
  return true;
};
// ---end here request to access the camera ---

export const openCamera = async (
  setSending: any,
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>,
  setSendingPercentage: any,
  chatId: any,
  sender: string,
  senderName: string,
  replyingMessage: any,
  messageId: any,
  socket: any,
  updateChat: any,
  updatedMessage: any
) => {
  const hasPermission = await requestCameraPermissions();
  if (!hasPermission) {
    return null;
  }

  try {
    // Open the camera and capture an image
    const docRes = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });

    // Log the result object to check its structure
    console.log("Camera result:", docRes);

    if (docRes.cancelled) {
      console.log("Camera capture canceled");
      return null;
    }

    // Extract the asset from the response
    const asset = docRes.assets?.[0];
    const uri = asset?.uri; // Extract the URI
    const fileName = asset?.fileName || `image_${Date.now()}.jpg`;
    if (!uri) {
      console.error("No URI found for the captured image");
      return;
    }
    await uploadToFirebaseCamera(
      uri,
      fileName,
      setSending,
      setIsSending,
      setSendingPercentage,
      chatId,
      sender,
      senderName,
      replyingMessage,
      messageId,
      socket,
      updateChat,
      updatedMessage
    );
    return docRes;
  } catch (err) {
    console.log("Error while capturing image:", err);
    return null;
  }
};
export const uploadToFirebaseCamera = async (
  uri: string,
  fileName: string,
  setSending: any,
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>,
  setSendingPercentage: any,
  chatId: any,
  sender: string,
  senderName: string,
  replyingMessage: any,
  messageId: any,
  socket: any,
  updateChat: any,
  updatedMessage: any
) => {
  if (!uri) {
    console.error("Invalid URI for upload");
    return;
  }

  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `uploads/${fileName}`); // Use the passed fileName
    const uploadTask = uploadBytesResumable(storageRef, blob);

    const tempMessage = {
      chatId,
      sender,
      senderName,
      message: fileName, // Use the fileName as message
      fileUrl: "",
      fileType: "image/jpeg", // You can set this based on the asset mimeType
      messageId,
      replyingMessage,
      status: "uploading",
    };
    updateChat(chatId, tempMessage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress monitoring (optional)
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        showMessage({
          message: "Error",
          description: "Upload Failed",
          type: "danger",
        });
        console.error("Upload failed:", error);
      },
      async () => {
        // On successful upload
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", downloadURL);
          const newMessage = {
            ...tempMessage,
            fileUrl: downloadURL,
            status: "sent",
          };

          if (socket) {
            socket.emit("sendDocument", newMessage);
            await updatedMessage(chatId, messageId, newMessage);
          }

          setIsSending(false);
          setSending("");
        } catch (error) {
          console.error("Error getting download URL:", error);
        }
      }
    );
  } catch (err) {
    console.log("Error while uploading document:", err);
  }
};
