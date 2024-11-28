import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import {
  getMessages,
  markMessageRead,
} from "../../services/api/messageService";
import { useAuth } from "../../context/userContext";
import RenderMessage from "../../components/chatWindowScreenComp/RenderMessage";
import { getSendedType, getSenderName, getSenderStatus } from "../../misc/misc";
import { useTheme } from "@react-navigation/native";
import { FlatList as GestureFlatList } from "react-native-gesture-handler";
import {
  openCamera,
  openDocumentPicker,
} from "src/misc/fireBaseUsedFunctions/FireBaseUsedFunctions";
import { useSocket } from "src/context/useSocketContext";
import { useAuthStore } from "src/services/storage/authStore";
import { useChatStore } from "src/services/storage/chatStore";
import { chatWindowStyle } from "../styles/chatWindowScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useConversation } from "src/services/sockets/useConversation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const ChatWindowScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { chatId } = route.params;
  const [message, setMessage] = useState<string>("");
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [replyingMessage, setReplyingMessage] = useState<any>(null);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const textInputRef = useRef<TextInput>(null);
  const { onlineUsers, socket } = useSocket();
  const { loggedUser } = useAuthStore();
  const { setMessages, chats } = useChatStore();
  const { selectedChat } = useAuth() as { selectedChat: any };
  const { token } = useAuthStore();
  const [selectedMessages, setSelectedMessages] = useState<any[]>([]);
  const [forwardMode, setForwardMode] = useState<boolean>(false);
  const [sending, setSending] = useState<any[]>([]);
  const [sendingPercentage, setSendingPercentage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [unread, setunread] = useState(true);
  const { colors } = useTheme();
  const messages = useChatStore((state) => state.messages[chatId]);
  const updateChat = useChatStore((state) => state.updateChat);
  const updatedMessage = useChatStore((state) => state.updateMessage);
  const markAsRead = useChatStore((state) => state.markAsRead);
  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (newMessage) => {
        if (newMessage.sender !== loggedUser._id) {
          markMessageRead(selectedChat._id, loggedUser._id, token);
          socket.emit("markMessageMMKV", {
            userId: loggedUser._id,
            chatId: selectedChat._id,
          });
        }
        setunread(false);
      };
      const handleReceiveDocuments = (newMessage) => {
        if (newMessage.sender !== loggedUser._id) {
          markMessageRead(selectedChat._id, loggedUser._id, token);
          socket.emit("markMessageMMKV", {
            userId: loggedUser._id,
            chatId: selectedChat._id,
          });
        }
        setunread(false);
      };
      const handleForwardMessageReceived = (newMessage) => {};
      const handleReceiveMarkMessageMMKV = ({ userId, chatId }) => {
        markAsRead(chatId, userId);
      };

      socket?.on("receiveMessage", handleReceiveMessage);
      socket?.on("receiveDocument", handleReceiveDocuments);
      socket?.on("forwarMessageReceived", handleForwardMessageReceived);
      socket?.on("markMessageToReadRealTimeMMKV", handleReceiveMarkMessageMMKV);

      return () => {
        socket?.off("receiveMessage", handleReceiveMessage);
        socket?.off("receiveDocument", handleReceiveDocuments);
        socket?.off("forwarMessageReceived", handleForwardMessageReceived);
        socket?.off(
          "markMessageToReadRealTimeMMKV",
          handleReceiveMarkMessageMMKV
        );
      };
    }
  }, [socket]);

  // const removeAllMessages = useChatStore((state) => state.removeAllMessages);
  // removeAllMessages();
  useConversation();
  useEffect(() => {
    if (socket) {
      socket.emit("markMessageMMKV", {
        userId: loggedUser._id,
        chatId: selectedChat._id,
      });
    }

    const fetch = async () => {
      await getMessages(
        selectedChat._id,
        setMessages,
        token,
        setLoadingMessages
      );
    };
    fetch();
    markAsRead(selectedChat._id, loggedUser._id);
    markMessageRead(selectedChat._id, loggedUser._id, token);
  }, []);

  const getUserFirstAlphabet = (userType: any) => {
    return userType ? userType.charAt(0).toUpperCase() : "";
  };

  const handleMoreOptions = () => {
    if (selectedChat?.chatType === "group") {
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
      loggedUserId: loggedUser?._id,
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
    const sender = loggedUser?._id;
    const senderName = loggedUser ? loggedUser.name : "Unknown";
    const messageId = Date.now().toString();
    setunread(false);
    await openDocumentPicker(
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
  };

  const sendCameraFile = async () => {
    const sender = loggedUser?._id;
    const senderName = loggedUser ? loggedUser.name : "Unknown";
    const messageId = Date.now().toString();
    setunread(false);
    await openCamera(
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
  };

  const sendMessageNew = async () => {
    if (!message) return;
    setReplyingMessage("");
    setMessage("");
    setunread(false);
    const messageId = Date.now().toString();

    // Construct the newMessage object with the required readBy property
    const newMessage = {
      chatId,
      sender: loggedUser?._id,
      senderName: loggedUser ? loggedUser.name : "Unknown",
      message,
      fileUrl: null,
      fileType: "text",
      messageId,
      replyingMessage,
      status: "unsent",
      createdAt: null,
      readBy: [loggedUser?._id],
    };
    try {
      updateChat(selectedChat._id, newMessage, loggedUser._id);
    } catch (err) {
      console.log(err);
    }

    if (socket) {
      try {
        socket.emit("sendMessage", newMessage);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const firstUnreadIndex =
    messages &&
    messages.findIndex(
      (msg) =>
        !msg.readBy?.includes(loggedUser?._id) && msg.sender !== loggedUser?._id
    );

  useEffect(() => {
    markAsRead(selectedChat._id, loggedUser._id);
  }, []);

  return (
    <SafeAreaView style={chatWindowStyle.container}>
      <View
        style={[chatWindowStyle.header, { backgroundColor: colors.primary }]}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={34} color={colors.text} />
          </TouchableOpacity>
          <View style={chatWindowStyle.headerTitleContainer}>
            <View style={chatWindowStyle.profileCircle}>
              {selectedChat && (
                <>
                  {selectedChat.chatType === "one-to-one" && (
                    <Text style={chatWindowStyle.profileText}>
                      {getUserFirstAlphabet(
                        getSendedType(loggedUser, selectedChat.users)
                      )}
                    </Text>
                  )}
                  {selectedChat.chatType === "group" && (
                    <Text style={chatWindowStyle.profileText}>
                      {getUserFirstAlphabet(selectedChat.groupName)}
                    </Text>
                  )}
                </>
              )}
              {selectedChat.chatType === "one-to-one" && (
                <View style={chatWindowStyle.statusContainer}>
                  {loggedUser &&
                  getSenderStatus(
                    loggedUser,
                    selectedChat.users,
                    onlineUsers || []
                  ) === "online" ? (
                    <View style={chatWindowStyle.statusDotgreen}></View>
                  ) : (
                    <View style={chatWindowStyle.statusDotgrey}></View>
                  )}
                </View>
              )}
            </View>

            <View style={chatWindowStyle.textContainer}>
              {selectedChat.chatType === "one-to-one" ? (
                <Text
                  style={[chatWindowStyle.usernameText, { color: colors.text }]}
                >
                  {loggedUser && getSenderName(loggedUser, selectedChat.users)}
                </Text>
              ) : (
                <Text
                  style={[chatWindowStyle.usernameText, { color: colors.text }]}
                >
                  {selectedChat.groupName}
                </Text>
              )}

              {selectedChat.chatType === "one-to-one" && (
                <Text
                  style={[
                    chatWindowStyle.statusText,
                    { color: colors.text },
                    { opacity: 0.8 },
                  ]}
                >
                  {loggedUser &&
                    getSenderStatus(
                      loggedUser,
                      selectedChat.users,
                      onlineUsers
                    )}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View style={chatWindowStyle.headerRightContainer}>
          {selectedMessages?.length > 0 && (
            <TouchableOpacity
              onPress={navigateToForwardScreen}
              style={chatWindowStyle.iconButton}
            >
              <Ionicons
                name="return-up-forward"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleMoreOptions}
            style={chatWindowStyle.iconButton}
          >
            <Entypo name="dots-three-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {loadingMessages && (
        <View style={{ marginTop: 10 }}>
          <ActivityIndicator />
        </View>
      )}

      {loadingMessages && messages.length === 0 ? (
        <ActivityIndicator
          size="large"
          style={chatWindowStyle.loadingIndicator}
        />
      ) : (
        <GestureFlatList
          data={messages?.slice().reverse()}
          inverted
          keyExtractor={(item) => item.messageId}
          style={{ padding: 10 }}
          renderItem={({ item, index }) => {
            const isSelected = selectedMessages?.some(
              (msg) => msg.messageId === item.messageId
            );
            const adjustedIndex = messages?.length - 1 - index;
            const isFirstUnread = adjustedIndex === firstUnreadIndex - 1;

            return (
              <>
                {unread && isFirstUnread && (
                  <View style={{ marginVertical: 10, alignItems: "center" }}>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#059dc0", // Change the color as needed
                        width: "100%", // Adjust as needed
                        borderRadius: 100,
                      }}
                    />
                    <Text style={{ color: "#059dc0", marginTop: 5 }}>
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
                    loggedUserId={loggedUser?._id}
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

      <View style={[chatWindowStyle.inputMainContainer]}>
        <TouchableOpacity onPress={sendDocument}>
          <Ionicons
            name="document"
            size={28}
            color={colors.text}
            style={{ marginBottom: 14, opacity: 0.8 }}
          />
        </TouchableOpacity>
        <View
          style={[
            chatWindowStyle.inputContainer,
            { backgroundColor: colors.primary },
          ]}
        >
          {replyingMessage && (
            <View
              style={[
                chatWindowStyle.replyingMessage,
                { backgroundColor: colors.background },
              ]}
            >
              <Text
                style={[
                  { color: colors.bottomNavActivePage },
                  { fontSize: 18 },
                  { fontWeight: "bold" },
                ]}
              >
                {replyingMessage.senderName !== loggedUser.name
                  ? replyingMessage.senderName
                  : "You"}
              </Text>
              <Text style={[{ color: colors.text }, { fontSize: 18 }]}>
                {replyingMessage && replyingMessage.message}
              </Text>
              <TouchableOpacity
                onPress={handleRemoveReplying}
                style={chatWindowStyle.closeReplyingMessage}
              >
                <MaterialIcons
                  name="highlight-remove"
                  size={24}
                  color={colors.bottomNavActivePage}
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
              placeholderTextColor={colors.text}
              style={[
                chatWindowStyle.input,
                { backgroundColor: colors.primary },
                {
                  color: colors.text,
                },
              ]}
              multiline
            />
            <View>
              <TouchableOpacity onPress={sendCameraFile}>
                <FontAwesome
                  name="camera"
                  size={24}
                  color={colors.text}
                  style={{
                    position: "absolute",
                    zIndex: 10,
                    bottom: 16,
                    right: 27,
                    opacity: 0.8,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={sendMessageNew}
          style={[chatWindowStyle.sendButton, { backgroundColor: "#2b4952" }]}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatWindowScreen;
