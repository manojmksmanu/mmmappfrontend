import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "src/services/storage/authStore";
import { useTheme } from "@react-navigation/native";

const FileUploadForm = ({ setAllFiles }) => {
  const [files, setFiles] = useState<any[]>([]);
  const { colors } = useTheme();
  useEffect(() => {
    setAllFiles(files);
  }, [files]);

  // Request media and document access permissions
  const requestDocumentPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Permission to access documents and media was denied. Please allow it to upload files.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  // Handle file selection
  const handleFileSelect = async () => {
    const hasPermission = await requestDocumentPermissions();

    if (!hasPermission) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: true,
      });

      if (result.type === "cancel") {
        console.log("User canceled file selection");
        return;
      }

      const { assets } = result as {
        assets: DocumentPicker.DocumentPickerAsset[];
      };

      if (assets && assets.length > 0) {
        const selectedFiles = assets.map((file) => ({
          name: file.name,
          type: file.mimeType,
          size: file.size,
          uri: file.uri,
        }));

        const mergedFiles = [
          ...files,
          ...selectedFiles.filter(
            (newFile) => !files.some((file) => file.name === newFile.name)
          ),
        ];

        setFiles(mergedFiles);
      }
    } catch (error) {
      console.error("Failed to select a file:", error);
    }
  };

  // Handle file removal
  const handleFileRemove = (fileName) => {
    const filteredFiles = files.filter((file) => file.name !== fileName);
    setFiles(filteredFiles);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors?.text }]}>
        Upload Assignment Documents
      </Text>

      {/* File Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={handleFileSelect}>
        <Text style={styles.uploadButtonText}>Upload Documents</Text>
      </TouchableOpacity>

      {/* List of Selected Files */}
      <View>
        {files.map((item) => {
          const sizeInKb = parseFloat((item.size / 1000).toFixed(2));
          const sizeInMb = parseFloat((item.size / 1000000).toFixed(2));

          return (
            <View key={item.name} style={styles.fileItem}>
              <View>
                <Text style={styles.fileName}>
                  {item.name.length > 20
                    ? `${item.name.slice(0, 20)}...`
                    : item.name}
                </Text>
                <Text style={styles.fileSize}>
                  {sizeInMb >= 1 ? `${sizeInMb} MB` : `${sizeInKb} KB`}
                </Text>
              </View>

              <TouchableOpacity onPress={() => handleFileRemove(item.name)}>
                <Ionicons name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  title: {
    opacity: 0.6,
    marginBottom: 5,
    marginLeft:5,
    fontSize: 14,
  },
  uploadButton: {
    backgroundColor: "#059dc0",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  uploadButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  fileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  fileName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  fileSize: {
    fontSize: 12,
    color: "#555",
  },
});

export default FileUploadForm;
