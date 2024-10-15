import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Camera from "expo-camera";
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
  checkAndSaveMessageLocally: any,
  chatId: any,
  sender: string,
  senderName: string,
  replyingMessage: any,
  messageId: any,
  socket: any
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
      checkAndSaveMessageLocally,
      chatId,
      sender,
      senderName,
      replyingMessage,
      messageId,
      socket
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
  checkAndSaveMessageLocally: any,
  chatId: any,
  sender: string,
  senderName: string,
  replyingMessage: any,
  messageId: any,
  socket: any
) => {
  if (!docRes || !docRes.assets || docRes.assets.length === 0) {
    console.error("Invalid document response");
    return;
  }

  const asset = docRes.assets[0];
  const { uri, name, mimeType } = asset;

  console.log("Extracted URI:", uri);
  console.log("Extracted Name:", name);
  console.log("Extracted type:", mimeType);

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
    };
    checkAndSaveMessageLocally(tempMessage);
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
            status: "sent",
          };

          if (socket) {
            socket.emit("sendDocument", newMessage);
            await checkAndSaveMessageLocally(newMessage);
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

// ✌✌✌✌✌✌ combined open document and upload document
// export const openDocumentPickerupload = async () => {
//   const hasPermission = await requestDocumentPickerPermissions();
//   if (!hasPermission) {
//     return; // Exit if permission is not granted
//   }
//   try {
//     // Pick a document
//     const docRes = await DocumentPicker.getDocumentAsync({
//       type: "*/*", // Allow all file types
//     });

//     console.log("Document Picker Response:", docRes); // Log the response

//     // Check if the user canceled the document picker
//     if (docRes.type === "cancel") {
//       console.log("Document selection canceled");
//       return;
//     }

//     // Ensure the response contains a valid document in assets array
//     if (!docRes.assets || docRes.assets.length === 0) {
//       console.error("No assets found in the document picker response");
//       return;
//     }

//     // Extract the first asset
//     const asset = docRes.assets[0]; // Get the first asset
//     const { uri, name, mimeType } = asset; // Destructure properties

//     // Log the extracted values
//     console.log("Extracted URI:", uri);
//     console.log("Extracted Name:", name);
//     console.log("Extracted MIME Type:", mimeType);

//     // Ensure `uri` is valid
//     if (!uri) {
//       console.error("No URI found for the selected document");
//       return;
//     }

//     // Fetch the file data directly from the URI
//     const response = await fetch(uri);
//     const blob = await response.blob(); // Convert response to a Blob

//     // Create a reference to Firebase Storage
//     const storageRef = ref(storage, `uploads/${name}`);

//     // Upload the file to Firebase Storage using `uploadBytesResumable`
//     const uploadTask = uploadBytesResumable(storageRef, blob);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         // Progress monitoring (optional)
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log(`Upload is ${progress}% done`);
//       },
//       (error) => {
//         console.error("Upload failed:", error);
//       },
//       async () => {
//         // On successful upload
//         try {
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           console.log("File available at:", downloadURL);
//         } catch (error) {
//           console.error("Error getting download URL:", error);
//         }
//       }
//     );
//   } catch (err: any) {
//     console.log("Error while uploading document:", err);
//   }
// };
// end here ✌✌✌✌✌✌ combined open document and upload document

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
  checkAndSaveMessageLocally: any,
  chatId: any,
  sender: string,
  senderName: string,
  replyingMessage: any,
  messageId: any,
  socket: any
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
    const fileName = asset?.fileName || `image_${Date.now()}.jpg`; // Use the provided fileName or generate a new one

    console.log("Captured URI:", uri);
    console.log("Generated Filename:", fileName); // Ensure filename is logged
    console.log("Image type:", asset?.mimeType);

    if (!uri) {
      console.error("No URI found for the captured image");
      return;
    }

    // Call uploadToFirebase with the asset
    await uploadToFirebaseCamera(
      uri, // Pass the URI directly
      fileName, // Pass the filename for Firebase
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

    return docRes; // Return asset for further use if needed
  } catch (err) {
    console.log("Error while capturing image:", err);
    return null;
  }
};

export const uploadToFirebaseCamera = async (
  uri: string, // Expect URI as input
  fileName: string, // Expect filename as input
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
    checkAndSaveMessageLocally(tempMessage);

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
            await checkAndSaveMessageLocally(newMessage);
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
