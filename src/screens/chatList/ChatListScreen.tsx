import React, { useEffect, useCallback, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  StatusBar,
  Platform,
  useColorScheme,
} from "react-native";
import { useAuth } from "../../context/userContext";
import {
  getSendedType,
  getSender,
  getSenderName,
  getSenderStatus,
  getUserFirstLetter,
} from "../../misc/misc";
import { useNavigation, useTheme } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import BottomNavigation from "../../components/chatListScreenComp/BottomNavigation";
import { formatMessageDate } from "src/misc/formateMessageDate/formateMessageDate";
import { useChatStore } from "src/services/storage/chatStore";
import { useAuthStore } from "src/services/storage/authStore";
import { getAllChats } from "src/services/api/chatService";
import { useSocket } from "src/context/useSocketContext";
import { chatListStyle } from "../styles/chatListScreen";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
type RootStackParamList = {
  ChatList: undefined;
  ChatWindow: { chatId: string };
  Login: undefined;
  Profile: undefined;
  ChatWindow2: { chatId: string };
  GroupCreate: undefined;
};
interface User {
  _id: string;
  name: string;
  userType: any;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
}
interface Chat {
  _id: string;
  users: User[];
}

const ChatListScreen: React.FC = () => {
  const { setSelectedChat } = useAuth() as {
    setSelectedChat: any;
  };
  const [searchText, setSearchText] = useState<string>("");
  const [filteredChats, setFilteredChats] = useState<Chat[] | undefined>([]);
  const [showType, setShowType] = useState<string>("Home");
  const [serverLoadingChats, setServerLoadingChats] = useState(false);

  const { onlineUsers } = useSocket();
  const { chats, setChats, setSelectedChatMMKV, deleteSelectedChatMMKV } =
    useChatStore();
  const { loggedUser } = useAuthStore();
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "ChatList">>();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const fetch = async () => {
      await setServerLoadingChats(true);
      await getAllChats(loggedUser._id, setChats);
      await setServerLoadingChats(false);
    };
    fetch();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      deleteSelectedChatMMKV();
    }, [])
  );

  useEffect(() => {
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, []);
  // -----filter chats by sender name ---
  useEffect(() => {
    setShowType("Home");
    const searchChats = () => {
      if (searchText.trim() === "") {
        setFilteredChats(chats || null);
      } else {
        const updatedChats = chats?.filter((chat) => {
          if (loggedUser) {
            const sender = getSender(loggedUser, chat.users);
            return (
              sender &&
              sender.user.name?.toLowerCase().includes(searchText.toLowerCase())
            );
          }
        });
        setFilteredChats(updatedChats || null);
      }
    };
    searchChats();
  }, [searchText, loggedUser, chats]);

  useEffect(() => {
    getAllChats(loggedUser._id, setChats);
  }, []);

  const handleShowUsertype = async (itemType: string) => {
    if (itemType === "Home") {
      setFilteredChats(chats);
    }

    if (
      itemType === "Admins" ||
      itemType === "Tutor" ||
      itemType === "Student"
    ) {
      const updateChatsByChatType = chats?.filter((chat: any) => {
        return chat.chatType === "one-to-one";
      });
      const updateChats = updateChatsByChatType?.filter((chat: any) => {
        if (loggedUser) {
          const sender = getSender(loggedUser, chat.users);
          if (itemType === "Admins") {
            return (
              sender &&
              (sender.user.userType === "Admin" ||
                sender.user.userType === "Super-Admin" ||
                sender.user.userType === "Co-Admin" ||
                sender.user.userType === "Sub-Admin" ||
                sender.user.userType === "Admin")
            );
          }
          if (itemType === "Tutor") {
            return sender && sender.user.userType === "Tutor";
          }
          if (itemType === "Student") {
            return sender && sender.user.userType === "Student";
          }
        }
      });

      setFilteredChats(updateChats || null);
    }

    if (itemType === "Group") {
      const updateChatsByChatType = chats?.filter((chat: any) => {
        return chat.chatType === "group";
      });
      setFilteredChats(updateChatsByChatType || null);
    }
  };

  const clickCreateGroup = () => {
    navigation.navigate("GroupCreate");
  };

  // -- Navigate to chatWindow
  const chatClicked = useCallback(
    (chat: any) => {
      navigation.navigate("ChatWindow", { chatId: chat._id });
      setSelectedChat(chat);
      setSelectedChatMMKV(chat);
    },
    [navigation, setSelectedChat]
  );

  const handleRedirectToProfileScreen = () => {
    navigation.navigate("Profile");
  };

  const renderItem = ({ item }: { item: any }) =>
    item.chatType === "one-to-one" ? (
      <TouchableOpacity
        onPress={() => chatClicked(item)}
        style={[chatListStyle.userContainer]}
      >
        <Animated.View
          style={[
            {
              transform: [{ scale: scaleAnim }],
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 20,
              marginBottom: 2,
            },
          ]}
        >
          <View style={chatListStyle.profileCircle}>
            {loggedUser ? (
              <Text style={chatListStyle.profileText}>
                {getUserFirstLetter(getSenderName(loggedUser, item.users))}
              </Text>
            ) : null}
            <View style={chatListStyle.statusContainer}>
              {loggedUser &&
              getSenderStatus(loggedUser, item.users, onlineUsers || []) ===
                "online" ? (
                <View style={[chatListStyle.statusDotgreen]}></View>
              ) : (
                <View style={chatListStyle.statusDotgrey}></View>
              )}
            </View>
          </View>
          <View style={chatListStyle.userInfo}>
            <View style={chatListStyle.userHeader}>
              <Text style={[chatListStyle.username, { color: colors.text }]}>
                {loggedUser ? getSenderName(loggedUser, item.users) : "Unknown"}
              </Text>
              {loggedUser ? (
                <Text
                  style={[chatListStyle.userTypeText, { color: colors.text }]}
                >
                  {getSendedType(loggedUser, item.users)}
                </Text>
              ) : null}
            </View>
            {loggedUser && item.latestMessage ? (
              <View style={chatListStyle.userHeader}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "white",
                    marginBottom: 4,
                  }}
                >
                  {loggedUser
                    ? (() => {
                        const latestMessage = item.latestMessage?.message || "";
                        const messageLines = latestMessage.split("\n");
                        const firstLine = `${messageLines[0]}` || "";
                        if (firstLine.length > 20) {
                          return firstLine.slice(0, 20) + "...";
                        }
                        const words = firstLine.split(" ");
                        if (words.length > 20) {
                          return words.slice(0, 20).join(" ") + "...";
                        }
                        return firstLine;
                      })()
                    : ""}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  {item?.unreadCounts &&
                    item?.unreadCounts[loggedUser._id] > 0 && (
                      <Text
                        style={[
                          { color: colors.text },
                          {
                            backgroundColor: "#059dc0",
                            padding: 2,
                            paddingHorizontal: 8,
                            borderRadius: 100,
                          },
                        ]}
                      >
                        {item?.unreadCounts[loggedUser._id]}
                      </Text>
                    )}

                  <Text
                    style={{
                      fontSize: 12,
                      color: `${
                        item?.unreadCounts[loggedUser._id] > 0
                          ? "#059dc0"
                          : "#999"
                      }`,
                    }}
                  >
                    {loggedUser &&
                      formatMessageDate(item.latestMessage.createdAt)}
                  </Text>
                </View>
              </View>
            ) : (
              ""
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => chatClicked(item)}
        style={chatListStyle.userContainer}
      >
        <Animated.View
          style={[
            {
              transform: [{ scale: scaleAnim }],
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 20,
              marginBottom: 2,
            },
          ]}
        >
          <View style={chatListStyle.profileCircle}>
            {loggedUser ? (
              <Text style={[chatListStyle.profileText]}>
                {getUserFirstLetter(item.groupName)}
              </Text>
            ) : null}
          </View>
          <View style={chatListStyle.userInfo}>
            <View style={chatListStyle.userHeader}>
              <Text style={[chatListStyle.username, { color: colors.text }]}>
                {item.groupName}
              </Text>
            </View>
            {loggedUser && item.latestMessage ? (
              <View style={chatListStyle.userHeader}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.text,
                    marginBottom: 4,
                  }}
                >
                  {loggedUser
                    ? (() => {
                        const latestMessage = item.latestMessage?.message || "";
                        const messageLines = latestMessage.split("\n");
                        const firstLine = `${messageLines[0]}` || "";
                        if (firstLine.length > 30) {
                          return firstLine.slice(0, 30) + "...";
                        }
                        const words = firstLine.split(" ");
                        if (words.length > 30) {
                          return words.slice(0, 30).join(" ") + "...";
                        }
                        return firstLine;
                      })()
                    : ""}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  {item?.unreadCounts &&
                    item?.unreadCounts[loggedUser._id] > 0 && (
                      <Text
                        style={[
                          { color: colors.text },
                          {
                            backgroundColor: "#059dc0",
                            padding: 2,
                            paddingHorizontal: 8,
                            borderRadius: 100,
                          },
                        ]}
                      >
                        {item?.unreadCounts[loggedUser._id]}
                      </Text>
                    )}

                  <Text
                    style={{
                      fontSize: 12,
                      color:
                        item?.unreadCounts[loggedUser._id] > 0
                          ? "#059dc0"
                          : colors.text,
                      opacity: 0.5,
                    }}
                  >
                    {/* {loggedUser && formatMessageDate(item.latestMessage?.createdAt)} */}
                    {loggedUser && formatMessageDate(item?.updatedAt)}
                  </Text>
                </View>
              </View>
            ) : (
              ""
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  return (
    <View
      style={[
        chatListStyle.container,
        { paddingTop: Platform.OS === "ios" ? 50 : 0 },
      ]}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "dark-content" : "light-content"}
        translucent={true}
        backgroundColor="transparent" // Make background transparent so that image shows through
      />

      <SafeAreaView style={chatListStyle.container}>
        <View
          style={[chatListStyle.header, { backgroundColor: colors.primary }]}
        >
          <View>
            <Text
              style={{ color: colors.text, fontSize: 28, fontWeight: "bold" }}
            >
              MyMegamind
            </Text>
          </View>
          <TouchableOpacity onPress={handleRedirectToProfileScreen}>
            <Entypo style={{ color: colors.text }} name="menu" size={28} />
          </TouchableOpacity>
        </View>
        {1 !== 1 ? (
          <ActivityIndicator
            size="large"
            color="#007bff"
            style={chatListStyle.loadingIndicator}
          />
        ) : (
          <View style={chatListStyle.content}>
            <View
              style={[
                chatListStyle.searchContainer,
                { backgroundColor: colors.secondary },
              ]}
            >
              <AntDesign name="search1" size={24} color={colors.text} />
              <TextInput
                style={[chatListStyle.input, { color: colors.text }]}
                placeholder="Search users..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor={colors.text}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={{ position: "absolute", right: 10, top: 10 }}
                onPress={() => setSearchText("")}
              >
                <Entypo
                  name="circle-with-cross"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            {serverLoadingChats && chats.length > 0 && (
              <View>
                <ActivityIndicator size={"small"} />
              </View>
            )}

            {serverLoadingChats && chats.length === 0 && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.primary,
                    width: 200,
                    padding: 20,
                    borderRadius: 100,
                  }}
                >
                  <ActivityIndicator size={"large"} />
                </View>
              </View>
            )}

            {showType === "Group" && (
              <View style={{ marginBottom: 20, marginTop: 10 }}>
                <TouchableOpacity
                  onPress={clickCreateGroup}
                  style={{
                    backgroundColor: colors.primary,
                    marginHorizontal: 18,
                    borderRadius: 15,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      padding: 15,
                      color: colors.text,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Create New Group
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <FlatList
              data={filteredChats?.sort((a, b) => b.updatedAt - a.updatedAt)}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
            />
          </View>
        )}
        <View style={chatListStyle.bottomNavigation}>
          <BottomNavigation
            handleShowUsertype={handleShowUsertype}
            showType={showType}
            setShowType={setShowType}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ChatListScreen;
