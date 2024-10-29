import React, { useState } from "react";
import moment from "moment";
import {
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Pdf from "react-native-pdf";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useAuth } from "../../context/userContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const RenderMessage = ({
  item,
  loggedUserId,
  onLeftSwipe,
  onRightSwipe,
}: {
  item: any;
  loggedUserId: string;
  onLeftSwipe: any;
  onRightSwipe: any;
}) => {
  const isSender = item.sender === loggedUserId;
  const { fileType, fileUrl, message } = item;
  const translateX = useSharedValue(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const { selectedChat } = useAuth() as {
    selectedChat: any;
  };

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    if (isSender) {
      translateX.value = Math.min(event.nativeEvent.translationX, 0);
    } else {
      translateX.value = Math.max(event.nativeEvent.translationX, 0);
    }
  };

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      if (isSender) {
        if (event.nativeEvent.translationX < -100) {
          translateX.value = withSpring(SCREEN_WIDTH / 2);
          onLeftSwipe();
          translateX.value = withSpring(0);
        } else {
          translateX.value = withSpring(0);
        }
      } else {
        if (event.nativeEvent.translationX > 100) {
          translateX.value = withSpring(SCREEN_WIDTH / 2);
          onRightSwipe();
          translateX.value = withSpring(0);
        } else {
          translateX.value = withSpring(0);
        }
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const requestStoragePermission = async () => {
    console.log("Permission request triggered");

    // Request permissions for both Android and iOS
    try {
      // Check for existing permission status
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === "granted") {
        console.log("Media access granted");
        return true;
      } else {
        console.log("Media access denied");
        return false;
      }
    } catch (err) {
      console.warn("Error requesting permissions", err);
      return false;
    }
  };

  const downloadFile = async (url: string, message: string) => {
    const permissionGranted = await requestStoragePermission();

    if (!permissionGranted) {
      Alert.alert(
        "Permission Denied",
        "Storage permission is required to download files."
      );
      return;
    }

    const sanitizedMessage = message.replace(/\s+/g, "_");
    const downloadDir =
      FileSystem.documentDirectory || `${FileSystem.cacheDirectory}`;
    const path = `${downloadDir}${sanitizedMessage}`;

    try {
      setIsDownloading(true);
      setDownloadProgress(0);

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        path,
        {},
        (progress) => {
          const progressPercentage =
            (progress.totalBytesWritten / progress.totalBytesExpectedToWrite) *
            100;
          setDownloadProgress(progressPercentage);
        }
      );

      const { uri }: any = await downloadResumable.downloadAsync();
      Alert.alert(
        "Download Complete",
        `File downloaded successfully to: ${uri}`
      );
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert(
        "Download Failed",
        "There was an error downloading the file."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const renderRepyingMessage = (repliedMessage: any) => {
    if (!repliedMessage) return null;

    const { fileType, fileUrl, message, senderName } = repliedMessage;

    return (
      <View style={styles.renderRepyingMessage}>
        <Text style={{ color: "#25d366" }}>
          {senderName ? senderName : "You"}
        </Text>
        {fileType === "image/png" ||
        fileType === "image/jpeg" ||
        fileType === "image/jpg" ? (
          <View style={{ backgroundColor: "red" }}>
            <Image
              source={{ uri: fileUrl }}
              style={{ width: 100, height: 100, resizeMode: "contain" }}
            />
            <Text>{item.progress}</Text>
            <Text style={{ color: "grey" }}>{item.status}</Text>
          </View>
        ) : (
          <Text style={{ color: "grey" }}>{message}</Text>
        )}
      </View>
    );
  };

  const renderFileContent = (
    fileType: string,
    fileUrl: string,
    message: string,
    isSender: boolean
  ) => {
    // -----Image Message----
    if (fileType?.startsWith("image/")) {
      return (
        <TouchableOpacity onPress={() => openFileModal(fileUrl, fileType)}>
          <View style={{ width: 200, height: 200 }}>
            {item.status === "uploading" ? (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <>
                  <ActivityIndicator size="large" />
                  <Text>{item.fileName}</Text>
                </>
              </View>
            ) : fileUrl ? (
              <>
                <Image
                  source={{ uri: fileUrl }}
                  style={{ width: 200, height: 200, resizeMode: "contain" }}
                />
                {isDownloading && (
                  <View style={{ position: "absolute", top: 10, left: 10 }}>
                    <Text
                      style={{
                        color: "#fff",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        padding: 5,
                        borderRadius: 20,
                      }}
                    >
                      {Math.round(downloadProgress)}%
                    </Text>
                    <ActivityIndicator size="small" />
                  </View>
                )}
              </>
            ) : null}
          </View>
        </TouchableOpacity>
      );
    }

    // -----pdf message----
    if (fileType === "application/pdf" || fileType?.startsWith("application/")) {
      return (
        <TouchableOpacity onPress={() => openFileModal(fileUrl, fileType)}>
          <View
            style={{
              width: 200,
              height: 100,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {item.status === "uploading" ? (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" />
              </View>
            ) : (
              <>
                <View>
                  <Text style={{ color: "grey", textAlign: "center" }}>
                    {item.message}
                  </Text>
                  <Text
                    style={{
                      color: "blue",
                      opacity: 0.5,
                      textAlign: "center",
                    }}
                  >
                    {item.fileType}
                  </Text>
                </View>

                {isDownloading && (
                  <View style={{ position: "absolute", top: 10, left: 10 }}>
                    <Text
                      style={{
                        color: "#fff",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        padding: 5,
                        borderRadius: 20,
                      }}
                    >
                      {Math.round(downloadProgress)}%
                    </Text>
                    <ActivityIndicator size="small" />
                  </View>
                )}
              </>
            )}
          </View>
          {item.status === "uploading" && (
            <>
              <Text style={{ fontSize: 20 }}>{item.progress}</Text>
              <Text style={styles.documentText}>{item.fileType}</Text>
            </>
          )}
        </TouchableOpacity>
      );
    }

    // ------video message ------
    if (fileType === "video/mp4" || String(fileType)?.startsWith("video/")) {
      return (
        <TouchableOpacity onPress={() => openFileModal(fileUrl, fileType)}>
          <View
            style={{
              width: 200,
              height: 200,
            }}
          >
            {item.status === "uploading" ? (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" />
                <Text>{item.fileName}</Text>
              </View>
            ) : fileUrl ? (
              <>
                <WebView
                  source={{
                    html: `
              <video controls autoplay style="width:85%;height:80%;" playsinline muted="false">
                <source src="${fileUrl}" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            `,
                  }}
                  style={{ width: "100%", height: "90%" }}
                  allowsInlineMediaPlayback={true}
                  javaScriptEnabled={true}
                />

                {isDownloading && (
                  <View style={{ position: "absolute", top: 10, left: 10 }}>
                    <Text
                      style={{
                        color: "#fff",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        padding: 5,
                        borderRadius: 20,
                      }}
                    >
                      {Math.round(downloadProgress)}%
                    </Text>
                    <ActivityIndicator size="small" />
                  </View>
                )}
              </>
            ) : null}
          </View>
        </TouchableOpacity>
      );
    }

    // --------- text message ------
    if (fileType === "text") {
      return (
        <Text
          style={
            isSender ? styles.senderMessageText : styles.receiverMessageText
          }
        >
          {message}
        </Text>
      );
    }

    return null; // Return null for unsupported file types
  };

  const openFileModal = (url: string, type: string) => {
    setSelectedFileUrl(url);
    setSelectedFileType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFileUrl(null);
    setSelectedFileType(null);
  };

  return (
    <>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.messageContainer,
            isSender ? styles.senderContainer : styles.receiverContainer,
            animatedStyle,
          ]}
        >
          {selectedChat?.chatType === "group" && !isSender && (
            <Text
              style={{
                color: "grey",
                backgroundColor: "white",
                position: "absolute",
                fontSize: 10,
                padding: 2,
                top: -7,
                paddingHorizontal: 4,
                borderRadius: 10,
              }}
            >
              {item.senderName}
            </Text>
          )}

          {item.replyingMessage && renderRepyingMessage(item.replyingMessage)}
          <View style={styles.message}>
            {renderFileContent(fileType, fileUrl, message, isSender)}
          </View>
          <View style={styles.messageInfoContainer}>
            <Text style={styles.timeText}>
              {moment(item.createdAt).format("hh:mm A")}
            </Text>
            {isSender && item.status === "uploading" && (
              <Image
                source={require("../../../assets/time.png")}
                style={styles.tickIcon}
              />
            )}
            {isSender && item.status === "read" && (
              <Image
                source={require("../../../assets/check1.png")}
                style={styles.tickIcon}
              />
            )}
            {isSender && item.status === "unsent" && (
              <Image
                source={require("../../../assets/time.png")}
                style={styles.tickIcon}
              />
            )}
            {isSender && item.status === "sent" && (
              <Image
                source={require("../../../assets/checkdelivered.png")}
                style={styles.tickIcon}
              />
            )}
          </View>
        </Animated.View>
      </PanGestureHandler>
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {selectedFileType === "application/pdf" && selectedFileUrl ? (
            <Pdf
              trustAllCerts={false}
              scale={0.8}
              minScale={0.5}
              renderActivityIndicator={() => (
                <ActivityIndicator color="blue" size="large" />
              )}
              source={{ uri: selectedFileUrl, cache: true }}
              onError={(error: any) => console.log(error)}
              style={styles.pdf}
            />
          ) : selectedFileType?.startsWith("image/") && selectedFileUrl ? (
            <Image source={{ uri: selectedFileUrl }} style={styles.fullImage} />
          ) : selectedFileType?.startsWith("video/") && selectedFileUrl ? (
            <WebView
              source={{ uri: selectedFileUrl }}
              style={{ flex: 1 }}
              startInLoadingState={true}
              renderLoading={() => (
                <ActivityIndicator size="large" color="blue" />
              )}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn("WebView error: ", nativeEvent);
              }}
            />
          ) : null}

          {isDownloading && (
            <TouchableOpacity
              onPress={closeModal}
              style={styles.modalDownloadProgress}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text
                  style={{
                    color: "#fff",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    padding: 5,
                    borderRadius: 20,
                  }}
                >
                  {Math.round(downloadProgress)}%
                </Text>
                <ActivityIndicator size="small" />
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={closeModal}
            style={styles.modalDownloadButton}
          >
            <Image
              style={styles.closeButtonText}
              source={require("../../../assets/close1.png")}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => downloadFile(fileUrl, item.message)}
            style={styles.closeButton}
          >
            <Image
              style={styles.closeButtonText}
              source={require("../../../assets/cloud-computing.png")}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 5,
    padding: 8,
    borderRadius: 10,
    maxWidth: "70%",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  message: {
    flexShrink: 1,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  messageInfoContainer: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  timeText: {
    color: "#808080",
    fontSize: 10,
    marginRight: 3,
  },
  tickIcon: {
    width: 12,
    height: 12,
    marginLeft: 3,
    opacity: 0.5,
  },
  senderContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
    maxWidth: "60%",
  },
  receiverContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  senderMessageText: {
    color: "#000",
    fontSize: 16,
    margin: 2,
  },
  receiverMessageText: {
    color: "#000",
    fontSize: 16,
    margin: 2,
  },
  renderRepyingMessage: {
    backgroundColor: "#F3F8EF",
    borderRadius: 5,
    padding: 10,
    display: "flex",
    flexDirection: "column",
  },
  documentText: {
    color: "#000",
    fontSize: 16,
    margin: 2,
    marginLeft: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pdf: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    marginTop: 20,
    padding: 5,
    backgroundColor: "#007bff",
    borderRadius: 5,
    zIndex: 1000,
    top: 10,
    right: 60,
  },
  modalDownloadButton: {
    position: "absolute",
    marginTop: 20,
    padding: 5,
    backgroundColor: "#007bff",
    borderRadius: 5,
    zIndex: 1000,
    top: 10,
    right: 10,
  },
  modalDownloadProgress: {
    position: "absolute",
    marginTop: 20,
    padding: 5,
    backgroundColor: "#007bff",
    borderRadius: 5,
    zIndex: 1000,
    top: 10,
    right: 110,
  },
  closeButtonText: {
    width: 25,
    height: 25,
  },
  fullImage: {
    backgroundColor: "black",
    width: SCREEN_WIDTH,
    height: "100%",
    resizeMode: "contain",
  },
  fullVideo: {
    backgroundColor: "black",
    width: SCREEN_WIDTH,
    height: "100%",
  },
});

export default RenderMessage;
