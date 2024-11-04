import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { markMessageRead } from "../../services/messageService";
import { useAuth } from "../../context/userContext";
import RenderMessage from "../../components/chatWindowScreenComp/RenderMessage";
import { getSendedType, getSenderName, getSenderStatus } from "../../misc/misc";
import {
  openCamera,
  openDocumentPicker,
} from "../../misc/fireBaseUsedFunctions/FireBaseUsedFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList as GestureFlatList } from "react-native-gesture-handler";
import { useUpdateChatList } from "src/context/updateChatListContext";

interface User {
  _id: string;
  name: string;
  userType: any;
}
interface MessageData {
  chatId: string;
  sender: string;
  senderName: string;
  message: string;
  messageId: string;
  replyingMessage: any;
  fileUrl: any;
  fileType: any;
  readBy: any;
}
const ChatWindowScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [replyingMessage, setReplyingMessage] = useState<any>(null);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const textInputRef = useRef<TextInput>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const { loggedUser, selectedChat, socket, onlineUsers, setChats, chats } =
    useAuth() as {
      loggedUserId: string;
      loggedUser: User;
      selectedChat: any;
      socket: any;
      onlineUsers: any;
      FetchChatsAgain: any;
      setChats: any;
      chats: any;
    };
  const [selectedMessages, setSelectedMessages] = useState<any[]>([]);
  const [forwardMode, setForwardMode] = useState<boolean>(false);
  const [sending, setSending] = useState<any[]>([]);
  const [sendingPercentage, setSendingPercentage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const { handleFetchAgain } = useUpdateChatList();
  const [unread, setunread] = useState(true);

  // ----socket connection--
  useEffect(() => {
    loadMessages(chatId);
    if (!socket) return;
    socket.emit("joinRoom", chatId);
    const handleReceiveMessage = (messageData: MessageData) => {
      console.log("message revcieved from socket");
      if (messageData.sender === loggedUser._id) {
        saveMessageLocally(messageData);
      }
      setunread(false);
      if (messageData.sender !== loggedUser._id) {
        saveRecieverMessageLocally(messageData);
        const loggedUserId = loggedUser._id;
        socket.emit("markmessagetoread", { ...messageData, loggedUserId });
        updateChatListWithLatestMessage(messageData);
      }
    };
    const handleReceiveDocuments = (messageData: MessageData) => {
      if (messageData.sender === loggedUser._id) {
        saveMessageLocally(messageData);
      }
      setunread(false);
      if (messageData.sender !== loggedUser._id) {
        socket.emit("markmessagetoread", messageData);
        saveRecieverMessageLocally(messageData);
        updateChatListWithLatestMessage(messageData);
      }
    };

    const handleForwardMessageReceived = (newMessages: MessageData[]) => {
      console.log(newMessages, "forward messages");
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    };

    const handleMarkMessageReceived = (messageData: MessageData) => {
      if (messageData.sender === loggedUser._id) {
        saveOurMessageMarkReadLocally(messageData);
      }
    };
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("receiveDocument", handleReceiveDocuments);
    socket.on("forwarMessageReceived", handleForwardMessageReceived);
    socket.on("resultofmarkmessagetoread", handleMarkMessageReceived);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("receiveDocument", handleReceiveDocuments);
      socket.off("forwarMessageReceived", handleForwardMessageReceived);
      socket.off("resultofmarkmessagetoread", handleMarkMessageReceived);
    };
  }, []);
  // --socket connection end--
  const memoizedMessages = useMemo(() => {
    const messageLookup = messages.reduce((acc, msg) => {
      acc[msg.messageId] = msg;
      return acc;
    }, {});

    return messages.map((msg) => {
      return messageLookup[msg.messageId]
        ? { ...msg, ...messageLookup[msg.messageId] }
        : msg;
    });
  }, [messages]);
  const loadMessages = async (chatId: any) => {
    setLoadingMessages(true);
    try {
      const allMessages = await AsyncStorage.getItem("globalMessages");
      const messagesData = allMessages ? JSON.parse(allMessages) : [];
      if (!Array.isArray(messagesData)) {
        throw new TypeError("Expected messagesData to be an array");
      }
      const chatMessages = messagesData.filter((msg) => msg.chatId === chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error loading messages from AsyncStorage:", error);
    } finally {
      setLoadingMessages(false);
    }
  };
  const fetchDataWhenLoad = async () => {
    await loadMessages(chatId);
    await markMessageRead(selectedChat._id, loggedUser._id);
    await handleFetchAgain();
  };
  useFocusEffect(
    useCallback(() => {
      fetchDataWhenLoad();
    }, [])
  );
  const saveMessageLocally = async (message: MessageData) => {
    try {
      const allMessages = await AsyncStorage.getItem("globalMessages");
      const messagesData = allMessages ? JSON.parse(allMessages) : [];
      const messageMap = new Map(
        messagesData.map((msg: any) => [msg.messageId, msg])
      );
      messageMap.set(message.messageId, {
        ...(messageMap.get(message.messageId) || {}),
        ...message,
      });
      const updatedMessages = Array.from(messageMap.values());
      await AsyncStorage.setItem(
        "globalMessages",
        JSON.stringify(updatedMessages)
      );
      setMessages((prevMessages) => {
        const messageMap = new Map(
          prevMessages.map((msg) => [msg.messageId, msg])
        );
        messageMap.set(message.messageId, message);
        return Array.from(messageMap.values());
      });
    } catch (error) {
      console.error("Error saving message locally:", error);
    }
  };
  const saveOurMessageMarkReadLocally = async (message: MessageData) => {
    const checkIncludeInMessageforStatus = () => {
      if (
        selectedChat.users.every((user) =>
          message.readBy?.includes(user.user._id)
        )
      ) {
        return "read";
      } else {
        return "sent";
      }
    };

    try {
      const newMessage = {
        __v: 1,
        _id: message.messageId,
        chatId: message.chatId,
        createdAt: new Date().toISOString(),
        fileType: message.fileType || "text",
        fileUrl: message.fileUrl || null,
        message: message.message,
        messageId: message.messageId,
        readBy: message.readBy,
        replyingMessage: message.replyingMessage || "",
        sender: message.sender,
        senderName: message.senderName,
        status: checkIncludeInMessageforStatus(),
      };

      const allMessages = await AsyncStorage.getItem("globalMessages");
      const messagesData = allMessages ? JSON.parse(allMessages) : [];
      const messageMap = new Map(
        messagesData.map((msg: any) => [msg.messageId, msg])
      );

      // Update or add the newMessage to the map
      messageMap.set(newMessage.messageId, {
        ...(messageMap.get(newMessage.messageId) || {}), // Keep existing message properties if any
        ...newMessage, // Overwrite with new message properties
      });

      // Convert the map back to an array and save it in AsyncStorage
      const updatedMessages = Array.from(messageMap.values());
      await AsyncStorage.setItem(
        "globalMessages",
        JSON.stringify(updatedMessages)
      );

      // Update the local `messages` state
      setMessages((prevMessages) => {
        const prevMessageMap = new Map(
          prevMessages.map((msg) => [msg.messageId, msg])
        );
        // Update or add the newMessage in the state as well
        prevMessageMap.set(newMessage.messageId, {
          ...(prevMessageMap.get(newMessage.messageId) || {}),
          ...newMessage,
        });

        // Return the updated array for the state
        return Array.from(prevMessageMap.values());
      });

      // Call additional functions if necessary
      await markMessageRead(selectedChat._id, loggedUser._id);
      await handleFetchAgain();
    } catch (error) {
      console.error("Error saving message locally:", error);
    }
  };
  const saveRecieverMessageLocally = async (message: MessageData) => {
    try {
      const newMessage = {
        __v: 1,
        _id: message.messageId,
        chatId: message.chatId,
        createdAt: new Date().toISOString(),
        fileType: message.fileType || "text",
        fileUrl: message.fileUrl || null,
        message: message.message,
        messageId: message.messageId,
        readBy: [...(message.readBy || []), loggedUser._id],
        replyingMessage: message.replyingMessage || "",
        sender: message.sender,
        senderName: message.senderName,
        status: "read", // Set status to "read"
      };
      const allMessages = await AsyncStorage.getItem("globalMessages");
      const messagesData = allMessages ? JSON.parse(allMessages) : [];
      const messageMap = new Map(
        messagesData.map((msg: any) => [msg.messageId, msg])
      );
      messageMap.set(newMessage.messageId, {
        ...(messageMap.get(newMessage.messageId) || {}),
        ...newMessage,
      });
      const updatedMessages = Array.from(messageMap.values());
      await AsyncStorage.setItem(
        "globalMessages",
        JSON.stringify(updatedMessages)
      );
      setMessages((prevMessages) => {
        const messageMap = new Map(
          prevMessages.map((msg) => [msg.messageId, msg])
        );
        messageMap.set(newMessage.messageId, newMessage);
        return Array.from(messageMap.values());
      });
      await markMessageRead(selectedChat._id, loggedUser._id);
      await handleFetchAgain();
    } catch (error) {
      console.error("Error saving message locally:", error);
    }
  };
  const checkAndSaveMessageLocally = async (message: MessageData) => {
    try {
      const allMessages = await AsyncStorage.getItem("globalMessages");
      const messagesData = allMessages ? JSON.parse(allMessages) : [];

      if (!Array.isArray(messagesData)) {
        throw new TypeError("Expected messagesData to be an array");
      }

      const messageMap = new Map(
        messagesData.map((msg) => [msg.messageId, msg])
      );

      messageMap.set(message.messageId, {
        ...(messageMap.get(message.messageId) || {}),
        ...message,
      });

      const updatedMessages = Array.from(messageMap.values());

      setMessages(updatedMessages.filter((msg) => msg.chatId === chatId));

      await AsyncStorage.setItem(
        "globalMessages",
        JSON.stringify(updatedMessages)
      );
    } catch (error) {
      console.error("Error checking and saving message locally:", error);
    }
  };
  const getUserFirstAlphabet = (userType: any) => {
    return userType ? userType.charAt(0).toUpperCase() : "";
  };

  // ----chat window header--
  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            source={require("../../../assets/back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <View style={styles.profileCircle}>
            {loggedUser && (
              <>
                {selectedChat.chatType === "one-to-one" && (
                  <Text style={styles.profileText}>
                    {getUserFirstAlphabet(
                      getSendedType(loggedUser, selectedChat.users)
                    )}
                  </Text>
                )}
                {selectedChat.chatType === "group" && (
                  <Text style={styles.profileText}>
                    {getUserFirstAlphabet(selectedChat.groupName)}
                  </Text>
                )}
              </>
            )}
            {selectedChat.chatType === "one-to-one" && (
              <View style={styles.statusContainer}>
                {loggedUser &&
                getSenderStatus(
                  loggedUser,
                  selectedChat.users,
                  onlineUsers || []
                ) === "online" ? (
                  <View style={styles.statusDotgreen}></View>
                ) : (
                  <View style={styles.statusDotgrey}></View>
                )}
              </View>
            )}
          </View>

          <View style={styles.textContainer}>
            {selectedChat.chatType === "one-to-one" ? (
              <Text style={styles.usernameText}>
                {loggedUser && getSenderName(loggedUser, selectedChat.users)}
              </Text>
            ) : (
              <Text style={styles.usernameText}>{selectedChat.groupName}</Text>
            )}

            {selectedChat.chatType === "one-to-one" && (
              <Text style={styles.statusText}>
                {loggedUser &&
                  getSenderStatus(loggedUser, selectedChat.users, onlineUsers)}
              </Text>
            )}
          </View>
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          {selectedMessages.length > 0 && (
            <TouchableOpacity
              onPress={navigateToForwardScreen}
              style={styles.iconButton}
            >
              <Image
                source={require("../../../assets/forward.png")}
                style={styles.forwardIcon}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleMoreOptions}
            style={styles.iconButton}
          >
            <Image
              source={require("../../../assets/dots.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, selectedMessages]);
  // ----chat window header end--

  const handleMoreOptions = () => {
    console.log("More options icon pressed");
    if (selectedChat.chatType === "group") {
      navigation.navigate("GroupInfo");
    }
  };

  const handleSwipeLeft = (item: any) => {
    setReplyingMessage(item);
    setIsReplying(true);
  };

  const handleSwipeRight = (item: any) => {
    setReplyingMessage(item);
    setIsReplying(true);
  };

  const handleRemoveReplying = () => {
    setReplyingMessage("");
  };

  useEffect(() => {
    if (isReplying && textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
        setIsReplying(false);
      }, 10);
    }
  }, [isReplying]);

  const navigateToForwardScreen = () => {
    setSelectedMessages([]);
    navigation.navigate("ForwardChatScreen", {
      messagesToForward: selectedMessages,
      socket: socket,
      loggedUserId: loggedUser._id,
      loggedUsername: loggedUser.name,
    });
  };

  const handleLongPress = (message: any) => {
    setForwardMode(true);
    setSelectedMessages([message]);
  };

  const handleTap = (message: any) => {
    if (forwardMode) {
      setSelectedMessages((prevSelected) => {
        const isSelected = prevSelected?.some((msg) => msg._id === message._id);
        const updatedMessages = isSelected
          ? prevSelected.filter((msg) => msg._id !== message._id)
          : [...prevSelected, message];
        return updatedMessages;
      });
    }
  };

  const sendDocument = async () => {
    const sender = loggedUser._id;
    const senderName = loggedUser ? loggedUser.name : "Unknown";
    const messageId = Date.now().toString();
    setunread(false);
    await openDocumentPicker(
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
  };

  const sendCameraFile = async () => {
    const sender = loggedUser._id;
    const senderName = loggedUser ? loggedUser.name : "Unknown";
    const messageId = Date.now().toString();
    setunread(false);
    await openCamera(
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
  };

  const sendMessageNew = async () => {
    if (!message) return;
    setReplyingMessage("");
    setMessage("");
    setunread(false);
    const messageId = Date.now().toString();
    const newMessage = {
      chatId,
      sender: loggedUser._id,
      senderName: loggedUser ? loggedUser.name : "Unknown",
      message,
      fileUrl: null,
      fileType: "text",
      messageId,
      replyingMessage,
      status: "unsent",
    };

    await updateChatListWithLatestMessage(newMessage);
    if (socket) {
      try {
        socket.emit("sendMessage", newMessage);
        await saveMessageLocally(newMessage);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const updateChatListWithLatestMessage = async (newMessage: any) => {
    const updatedChats = chats?.map((chat: any) => {
      if (chat._id === chatId) {
        return {
          ...chat,
          latestMessage: newMessage, // Update the last message
          updatedAt: new Date().toISOString(), // Update the timestamp
        };
      }
      return chat;
    });
    // Sort updatedChats by `updatedAt` to ensure the most recent one appears first
    const sortedChats = updatedChats?.sort(
      (a, b) =>
        new Date(b.updatedAt as string).getTime() -
        new Date(a.updatedAt as string).getTime()
    );
    setChats(sortedChats);
    try {
      await AsyncStorage.setItem("chats", JSON.stringify(sortedChats));
    } catch (error) {
      console.error("Failed to update local storage:", error);
    }
  };

  const firstUnreadIndex = memoizedMessages.findIndex(
    (msg) =>
      !msg.readBy?.includes(loggedUser._id) && msg.sender !== loggedUser._id
  );

  return (
    <View style={styles.container}>
      {loadingMessages ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={styles.loadingIndicator}
        />
      ) : (
        <GestureFlatList
          data={memoizedMessages.slice().reverse()}
          inverted
          keyExtractor={(item) => item.messageId}
          style={{ padding: 10 }}
          renderItem={({ item, index }) => {
            const isSelected = selectedMessages?.some(
              (msg) => msg.messageId === item.messageId
            );
            // Adjust the index to account for the reversed order
            const adjustedIndex = memoizedMessages.length - 1 - index;
            const isFirstUnread = adjustedIndex === firstUnreadIndex - 1;

            return (
              <>
                {unread && isFirstUnread && (
                  <View style={{ marginVertical: 10, alignItems: "center" }}>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#187afa", // Change the color as needed
                        width: "100%", // Adjust as needed
                        borderRadius: 100,
                      }}
                    />
                    <Text style={{ color: "#187afa", marginTop: 5 }}>
                      Unread Messages
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  onLongPress={() => handleLongPress(item)}
                  onPress={() => handleTap(item)}
                  style={{
                    backgroundColor: isSelected ? "lightgray" : "transparent",
                  }}
                >
                  <RenderMessage
                    item={item}
                    loggedUserId={loggedUser._id}
                    onLeftSwipe={() => handleSwipeLeft(item)}
                    onRightSwipe={() => handleSwipeRight(item)}
                  />
                </TouchableOpacity>
              </>
            );
          }}
          contentContainerStyle={{ flexGrow: 0 }}
        />
      )}

      <View>
        <View style={styles.inputMainContainer}>
          <TouchableOpacity onPress={sendDocument}>
            <Image
              source={require("../../../assets/add-folder.png")}
              style={{
                width: 28,
                height: 28,
                marginBottom: 6,
                padding: 10,
                marginRight: 5,
              }}
            />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            {replyingMessage && (
              <View style={styles.replyingMessage}>
                <Text style={{ fontSize: 18, color: "#25d366" }}>
                  {replyingMessage.senderName !== loggedUser.name
                    ? replyingMessage.senderName
                    : "You"}
                </Text>
                <Text style={{ fontSize: 16, color: "grey" }}>
                  {replyingMessage && replyingMessage.message}
                </Text>
                <TouchableOpacity
                  onPress={handleRemoveReplying}
                  style={styles.closeReplyingMessage}
                >
                  <Image
                    style={{ width: 25, height: 25 }}
                    source={require("../../../assets/remove.png")}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View>
              <TextInput
                ref={textInputRef}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
                placeholderTextColor="#808080"
                style={styles.input}
                multiline
              />
              <View>
                <TouchableOpacity onPress={sendCameraFile}>
                  <Image
                    source={require("../../../assets/photo-camera.png")}
                    style={{
                      width: 24,
                      height: 24,
                      position: "absolute",
                      zIndex: 10,
                      bottom: 10,
                      right: 23,
                      opacity: 0.6,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={sendMessageNew} style={styles.sendButton}>
            <Image
              source={require("../../../assets/send-message.png")}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 10,
    padding: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#555",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  usernameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 70,
    marginRight: 10,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  container: {
    flex: 1,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
  },
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  emojiSelector: {
    height: 350,
  },
  inputMainContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    paddingTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
  },
  inputContainer: {
    backgroundColor: "white",
    width: "90%",
    position: "relative",
    marginRight: 10,
    flex: 1,
    borderRadius: 15,
    textDecorationLine: "none",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  input: {
    color: "grey",
    paddingLeft: 20,
    textDecorationLine: "none",
    paddingRight: 60,
    fontSize: 18,
    borderWidth: 0,
    borderColor: "#363737",
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 12,
    minHeight: 40,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: "#187afa",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  replyingMessage: {
    backgroundColor: "#E7FFE7",
    borderRadius: 20,
    padding: 20,
    margin: 10,
    position: "relative",
  },
  closeReplyingMessage: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#555",
  },
  forwardIcon: {
    width: 30,
    height: 30,
    opacity: 0.6,
  },
  textContainer: {
    flexDirection: "column",
  },
  statusText: {
    fontSize: 14,
    color: "grey",
  },
  profileCircle: {
    width: 35,
    height: 35,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileText: {
    fontSize: 20,
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
  },
  statusDot: {
    width: 20,
    height: 20,
    marginRight: 6,
    top: -15,
    left: -6,
  },
  statusDotgreen: {
    opacity: 0.5,
    backgroundColor: "#25D366",
    width: 10,
    height: 10,
    marginRight: 6,
    bottom: -15,
    right: -20,
    borderRadius: 100,
  },
  statusDotgrey: {
    opacity: 0.5,
    backgroundColor: "grey",
    width: 10,
    height: 10,
    marginRight: 6,
    bottom: -15,
    right: -20,
    borderRadius: 100,
  },
  sendingIndicator: {
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    padding: 10,
    marginBottom: 2,
  },
});

export default ChatWindowScreen;
