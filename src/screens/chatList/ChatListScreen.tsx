import React, { useEffect, useCallback, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../context/userContext";
import {
  getSendedType,
  getSender,
  getSenderName,
  getSenderStatus,
  getUserFirstLetter,
} from "../../misc/misc";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import BottomNavigation from "../../components/chatListScreenComp/BottomNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatMessageDate } from "src/misc/formateMessageDate/formateMessageDate";
import { getAllMessages } from "src/services/messageService";
import { useMessages } from "src/context/messageContext";
import { useUpdateChatList } from "src/context/updateChatListContext";

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
  const {
    setLoggedUser,
    loggedUser,
    setChats,
    chats,
    setSelectedChat,
    onlineUsers,
    socket,
    FetchChatsAgain,
    selectedChat,
  } = useAuth() as {
    setLoggedUser: any;
    setChats: any;
    chats: any;
    setSelectedChat: any;
    onlineUsers: any;
    socket: any;
    FetchChatsAgain: any;
    selectedChat: any;
    loggedUser: User;
  };
  const { fetchAllMessages } = useMessages();
  const [searchText, setSearchText] = useState<string>("");
  const [filteredChats, setFilteredChats] = useState<Chat[] | null>(null);
  const [showType, setShowType] = useState<string>("Home");
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatsFromStorage, setChatsFromStorage] = useState<string | null>(null);
  // const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>(
  //   {}
  // );
  const { unreadCounts } = useUpdateChatList();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "ChatList">>();

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
  }, [searchText, chats, loggedUser]);

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

  //------header-------
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerText}>MyMegaminds</Text>,
      headerLeft: () => null,
      headerRight: () => (
        <TouchableOpacity onPress={handleRedirectToProfileScreen}>
          <Image
            style={styles.logoutText} // Consider renaming this style since it refers to an image now
            source={require("../../../assets/menu.png")}
          />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "white", // Set your desired background color
        shadowColor: "transparent", // Remove shadow on iOS
        elevation: 0, // Remove shadow on Android
        borderBottomWidth: 0, // Optional: Remove border on iOS
      },
    });
    const handleRedirectToProfileScreen = () => {
      navigation.navigate("Profile");
    };
  }, [navigation, loggedUser]);

  // ---fetch Again active----
  // useEffect(() => {
  //   if (!socket) {
  //     console.log("not socket connected");
  //     return;
  //   }
  //   const handleUserDeleted = async (data) => {
  //     await FetchChatsAgain();
  //     await debounceFetchChats();
  //   };
  //   socket?.on("userIsDeleted", handleUserDeleted);
  //   const handleFetchAgain = async () => {
  //     const allMessages = await fetchAllMessages();
  //     await loadUnreadCounts();
  //     // await fetchchatforload();
  //     await updateChatListWithLatestMessages(allMessages);
  //     // await debounceFetchChats();
  //   };
  //   socket.on("fetchAgain", (data) => {
  //     console.log(data, "fetchAgainData");
  //     const chatExists = chats?.some((chat: any) => chat._id === data);
  //     if (chatExists) {
  //       handleFetchAgain();
  //     }
  //   });
  //   return () => {
  //     socket?.off("userIsDeleted", handleUserDeleted);
  //     socket?.off("fetchAgain", FetchChatsAgain);
  //   };
  // }, [socket]);

  //---Navigate to GroupCreate
  const clickCreateGroup = () => {
    navigation.navigate("GroupCreate");
  };

  // -- Navigate to chatWindow
  const chatClicked = useCallback(
    (chat: any) => {
      navigation.navigate("ChatWindow", { chatId: chat._id });
      setSelectedChat(chat);
    },
    [navigation, setSelectedChat]
  );
  // -----function to check chats in local storage
  const fetchchatforload = async () => {
    try {
      const storedChats = await AsyncStorage.getItem("chats");
      setChatsFromStorage(storedChats);
    } catch (error) {
      console.error("Failed to load chats from storage", error);
    }
  };
  useEffect(() => {
    FetchChatsAgain();
    fetchchatforload();
  }, []);

  // const countUnreadMessages = async () => {
  //   const chatUnreadCount = {};
  //   const messagesJson = await AsyncStorage.getItem("globalMessages");
  //   const messages = messagesJson ? JSON.parse(messagesJson) : [];
  //   messages.forEach((message: any) => {
  //     const { chatId, readBy } = message;
  //     if (!readBy.includes(loggedUser._id)) {
  //       if (!chatUnreadCount[chatId]) {
  //         chatUnreadCount[chatId] = 0;
  //       }
  //       chatUnreadCount[chatId] += 1;
  //     }
  //   });
  //   return chatUnreadCount;
  // };
  const renderItem = ({ item }: { item: any }) =>
    item.chatType === "one-to-one" ? (
      <TouchableOpacity
        onPress={() => chatClicked(item)}
        style={styles.userContainer}
      >
        <View style={styles.profileCircle}>
          {loggedUser ? (
            <Text style={styles.profileText}>
              {getUserFirstLetter(getSenderName(loggedUser, item.users))}
            </Text>
          ) : null}
          <View style={styles.statusContainer}>
            {loggedUser &&
            getSenderStatus(loggedUser, item.users, onlineUsers || []) ===
              "online" ? (
              <View style={styles.statusDotgreen}></View>
            ) : (
              <View style={styles.statusDotgrey}></View>
            )}
          </View>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.userHeader}>
            <Text style={styles.username}>
              {loggedUser ? getSenderName(loggedUser, item.users) : "Unknown"}
            </Text>
            {loggedUser ? (
              <Text style={styles.userTypeText}>
                {getSendedType(loggedUser, item.users)}
              </Text>
            ) : null}
          </View>
          {loggedUser && item.latestMessage ? (
            <View style={styles.userHeader}>
              <Text
                style={{
                  fontSize: 14,
                  color: `${unreadCounts[item._id] ? "#187afa" : "#999"}`,
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
                {unreadCounts[item._id] && (
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "700",
                      backgroundColor: "#187afa",
                      borderRadius: 50, // Border radius should be half of width/height to make a circle
                      width: 22, // Set desired circle diameter
                      height: 22,
                      textAlign: "center",
                      lineHeight: 22, // Match lineHeight to height to vertically center text
                      fontSize: 12, // Adjust font size as needed
                    }}
                  >
                    {unreadCounts[item._id]}
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: 12,
                    color: `${unreadCounts[item._id] ? "#187afa" : "#999"}`,
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
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => chatClicked(item)}
        style={styles.userContainer}
      >
        <View style={styles.profileCircle}>
          {loggedUser ? (
            <Text style={styles.profileText}>
              {getUserFirstLetter(item.groupName)}
            </Text>
          ) : null}
        </View>
        <View style={styles.userInfo}>
          <View style={styles.userHeader}>
            <Text style={styles.username}>{item.groupName}</Text>
          </View>
          {loggedUser && item.latestMessage ? (
            <View style={styles.userHeader}>
              <Text
                style={{
                  fontSize: 14,
                  color: `${unreadCounts[item._id] ? "#187afa" : "#999"}`,
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
                {unreadCounts[item._id] && (
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "700",
                      backgroundColor: "#187afa",
                      borderRadius: 50, // Border radius should be half of width/height to make a circle
                      width: 22, // Set desired circle diameter
                      height: 22,
                      textAlign: "center",
                      lineHeight: 22, // Match lineHeight to height to vertically center text
                      fontSize: 12, // Adjust font size as needed
                    }}
                  >
                    {unreadCounts[item._id]}
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: 12,
                    color: `${unreadCounts[item._id] ? "#187afa" : "#999"}`,
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
      </TouchableOpacity>
    );
  return (
    <>
      <SafeAreaView style={styles.container}>
        {chatsFromStorage && chatsFromStorage.length === 0 ? (
          <ActivityIndicator
            size="large"
            color="#007bff"
            style={styles.loadingIndicator}
          />
        ) : (
          <View style={styles.content}>
            <View style={styles.searchContainer}>
              <Image
                style={{ width: 25, height: 25, opacity: 1 }}
                source={require("../../../assets/searchblue.png")}
              />
              <TextInput
                style={styles.input}
                placeholder="Search users..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#888"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={{ position: "absolute", right: 10, top: 12 }}
                onPress={() => setSearchText("")}
              >
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    opacity: 0.5,
                  }}
                  source={require("../../../assets/remove.png")}
                />
              </TouchableOpacity>
            </View>
            {/* {loading && (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 80,
                    padding: 10,
                    borderRadius: 20,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    borderWidth: 1,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 5,
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size="small" />
                </View>
              </View>
            )} */}
            {showType === "Group" && (
              <View>
                <TouchableOpacity
                  onPress={clickCreateGroup}
                  style={{
                    backgroundColor: "#187afa",
                    marginHorizontal: 18,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{ textAlign: "center", padding: 10, color: "white" }}
                  >
                    Create New Group
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <FlatList
              data={filteredChats}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
            />
          </View>
        )}
        <View style={styles.bottomNavigation}>
          <BottomNavigation
            handleShowUsertype={handleShowUsertype}
            showType={showType}
            setShowType={setShowType}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 30,
    marginVertical: 10,
    margin: 15,
  },
  content: {
    height: "90%",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingLeft: 8,
  },
  icon: {
    marginRight: 8,
    width: 30,
    height: 30,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#187afa",
    paddingLeft: 6,
  },
  logoutText: {
    width: 30,
    height: 30,
    marginRight: 20,
    color: "grey",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  profileCircle: {
    width: 48,
    height: 48,
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
  userTypeText: {
    fontSize: 12,
    color: "grey",
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  message: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
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
  statusText: {
    fontSize: 12,
    color: "grey",
  },
  bottomNavigation: {
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ChatListScreen;
