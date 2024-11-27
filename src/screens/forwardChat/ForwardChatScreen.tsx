import React, { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { getSenderName } from "../../misc/misc";
import { forward } from "../../services/api/messageService";
import { useAuthStore } from "src/services/storage/authStore";
import { useChatStore } from "src/services/storage/chatStore";
import { useTheme } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ForwarChatScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { messagesToForward, socket, loggedUserId, loggedUserName } =
    route.params;
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const { loggedUser, token } = useAuthStore();
  const { chats } = useChatStore();
  const { colors } = useTheme();

  const handleChatSelect = (chatId: string) => {
    setSelectedChats((prevSelected) => {
      if (prevSelected.includes(chatId)) {
        return prevSelected.filter((id) => id !== chatId);
      } else {
        return [...prevSelected, chatId];
      }
    });
  };

  const forwardMessages = async () => {
    if (!loggedUser) {
      console.error("No logged in user found");
      return;
    }
    try {
      await Promise.all(
        selectedChats.map(async (chatId) => {
          await forward(
            chatId,
            messagesToForward,
            loggedUserId,
            loggedUserName,
            token
          );
          socket.emit("forwardMessage", {
            chatId,
            messages: messagesToForward,
            loggedUserId: loggedUser?._id,
            loggedUserName: loggedUser.name,
          });
        })
      );
      navigation.goBack();
    } catch (error) {
      console.error("Failed to forward messages", error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={[
          {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            // justifyContent: "space-between",
            gap: 20,
            paddingHorizontal: 30,
            paddingTop: 40,
            paddingBottom: 20,
            borderBottomEndRadius: 30,
            borderBottomStartRadius: 30,
          },
          { backgroundColor: colors.primary },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={34} color={colors.text} />
        </TouchableOpacity>
        <Text
          style={[
            { color: colors.text },
            { fontSize: 20 },
            { fontWeight: "bold" },
          ]}
        >
          Add Users
        </Text>
      </View>
      <FlatList
        style={{ flexGrow: 1, marginTop: 20 }}
        data={chats}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleChatSelect(item._id)}
            style={{
              backgroundColor: selectedChats.includes(item._id)
                ? colors.bottomNavActivePage
                : colors.primary,
              margin: 7,
              paddingLeft: 20,
              borderRadius: 20,
              paddingVertical: 10,
            }}
          >
            <View style={{ margin: 2 }}>
              <Text style={{ fontSize: 20, padding: 4, color: colors.text }}>
                {loggedUser && getSenderName(loggedUser, item.users)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {selectedChats.length > 0 && (
          <TouchableOpacity
            style={{
              backgroundColor: colors.bottomNavActivePage,
              paddingHorizontal: 30,
              paddingVertical: 10,
              borderRadius: 30,
              marginVertical: 5,
            }}
            onPress={forwardMessages}
          >
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: colors.text }}
            >
              Forward
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ForwarChatScreen;
