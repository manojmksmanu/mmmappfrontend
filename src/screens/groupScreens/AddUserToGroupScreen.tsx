import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
} from "react-native";
import {
  addUserToGroupChat,
  getAllUsers,
} from "../../services/api/chatService";
import { useAuth } from "../../context/userContext";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useNavigation, useTheme } from "@react-navigation/native";
import { getUserFirstLetter } from "../../misc/misc";
import { showMessage, hideMessage } from "react-native-flash-message";
import { addUserToGroupStyle } from "../styles/addUserToGroupScreen";
import { useAuthStore } from "src/services/storage/authStore";
import { useUserStore } from "src/services/storage/usersStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface User {
  id: string;
  name: string;
  userType: string;
}

const AddUserToGroupScreen: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [addUserloading, setAddUserLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loggedUser, token } = useAuthStore();
  const { setUsers, users } = useUserStore();
  const { colors } = useTheme();
  const [filteredUsers, setFilteredUsers] = useState<any[] | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const { FetchChatsAgain, selectedChat, setSelectedChat } = useAuth() as {
    FetchChatsAgain: any;
    selectedChat: any;
    setSelectedChat: any;
  };
  const navigation = useNavigation();

  useEffect(() => {
    const searchUsers = () => {
      if (searchText.trim() === "") {
        setFilteredUsers(users || null);
      } else {
        const updatedUsers = users?.filter((users) => {
          return users.name?.toLowerCase().includes(searchText.toLowerCase());
        });
        setFilteredUsers(updatedUsers || null);
      }
    };
    searchUsers();
  }, [searchText]);

  const handleGetUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUserType = loggedUser?.userType;
      const fetchedUsers = await getAllUsers(currentUserType, setUsers, token);
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserToGroup = async () => {
    setAddUserLoading(true);
    setError(null);
    try {
      const data = await addUserToGroupChat(selectedChat?._id, selectedUsers);
      console.log(data.chat);
      FetchChatsAgain();
      setSelectedChat(data.chat);
      showMessage({
        message: `New users added in ${selectedChat?.groupName || "the group"}`,
        type: "success",
        autoHide: false, // Disable automatic hide so user can manually dismiss
        duration: 1000, // Keep the duration for auto-hide functionality
        renderCustomContent: () => (
          <TouchableOpacity onPress={() => hideMessage()}>
            <Text style={{ color: "blue" }}>Close</Text>
          </TouchableOpacity>
        ),
      });
      navigation.goBack();
    } catch (error: any) {
      showMessage({
        message: "Error", // You can customize this for a title
        description: `${error.message}`, // The equivalent of text2 for detailed error message
        type: "danger", // 'error' maps to 'danger' in react-native-flash-message
        autoHide: true,
        duration: 2000, // Equivalent to visibilityTime
      });
      setError(error.message);
    } finally {
      FetchChatsAgain();
      setAddUserLoading(false);
    }
  };

  const handleAddUser = async (item: any) => {
    setSelectedUsers((prev) => {
      if (prev.some((user) => user._id === item._id)) {
        return prev.filter((user) => user._id !== item._id);
      }
      return [...prev, item];
    });
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  const filterAndShowAlreadyIn = (item: any) => {
    return selectedChat.users.some((user: any) => user.user._id === item._id);
  };

  const renderItem = (item: any) => (
    <TouchableOpacity
      onPress={() => {
        !filterAndShowAlreadyIn(item) ? handleAddUser(item) : null;
      }}
      style={addUserToGroupStyle.userContainer}
    >
      <View
        style={[
          addUserToGroupStyle.profileCircle,
          selectedUsers.some((user) => user._id === item._id) && {
            borderColor: "#059dc0",
            borderWidth: 8,
          },
        ]}
      >
        {loggedUser ? (
          <Text style={addUserToGroupStyle.profileText}>
            {getUserFirstLetter(item?.name)}
          </Text>
        ) : null}
      </View>

      <View style={addUserToGroupStyle.userInfo}>
        <View style={addUserToGroupStyle.userHeader}>
          <View>
            <Text
              style={[addUserToGroupStyle.username, { color: colors.text }]}
            >
              {item?.name}
            </Text>
            {loggedUser ? (
              <Text style={addUserToGroupStyle.userTypeText}>
                {item?.userType}
              </Text>
            ) : null}
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {filterAndShowAlreadyIn(item) && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#1f262b",
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 5,
                }}
              >
                <Text style={{ fontSize: 10, color: "white" }}>Member</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSelectedUser = (item: any) => {
    return (
      <TouchableOpacity
        onPress={() => handleAddUser(item)}
        style={{
          width: 60,
          display: "flex",
          alignItems: "center",
          marginLeft: 10,
        }}
      >
        <Entypo
          name="circle-with-cross"
          style={{
            position: "absolute",
            zIndex: 10,
            right: -1,
            top: 3,
            backgroundColor: "white",
            borderRadius: 100,
          }}
          size={24}
          color="#059dc0"
        />

        <View
          style={{
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
          }}
        >
          {loggedUser ? (
            <Text style={addUserToGroupStyle.profileText}>
              {getUserFirstLetter(item?.name)}
            </Text>
          ) : null}
        </View>
        <Text
          style={{
            backgroundColor: "white",
            color: "black",
            fontSize: 10,
            textAlign: "center",
            borderRadius: 5,
            fontWeight: "bold",
            padding: 5,
            marginTop: 2,
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={addUserToGroupStyle.container}>
      <View
        style={[
          addUserToGroupStyle.header,
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
      <View>
        <View style={{ marginLeft: 20 }}>
          {selectedChat && (
            <Text style={{ color: "#059dc0" }}>{selectedChat.groupName}</Text>
          )}
          <Text style={{ color: "grey" }}>
            Number of members in group : {selectedChat.users.length}
          </Text>
        </View>
      </View>

      <View
        style={[
          addUserToGroupStyle.searchContainer,
          { backgroundColor: colors.primary },
        ]}
      >
        <Ionicons name="search" size={44} color={colors.text} />
        <TextInput
          style={[addUserToGroupStyle.input, { color: colors.text }]}
          placeholder="Search users..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={colors.text}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setSearchText("")}>
          <FontAwesome6 name="times-circle" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={{
            height: "80%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" />
          <Text style={{ color: "grey" }}>Loading Wait.....</Text>
          <Text style={{ color: "grey" }}>
            It depends on your internet speed
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {selectedUsers.length > 0 && (
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 0,
                }}
              >
                {selectedUsers.map((u) => renderSelectedUser(u))}
              </ScrollView>
            </View>
          )}
          <View style={{ flex: 1, marginTop: 10 }}>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
              showsVerticalScrollIndicator={true}
              style={{ flex: 1 }}
            >
              {filteredUsers && filteredUsers.map((user) => renderItem(user))}
            </ScrollView>
          </View>
        </View>
      )}
      {error && <Text>Error: {error}</Text>}

      {selectedUsers.length > 0 && (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            position: "absolute",
            alignItems: "center",
            bottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={handleAddUserToGroup}
            style={{
              backgroundColor: "#059dc0",
              width: "90%",
              padding: 15,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Add new {selectedUsers.length} member in Group
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        transparent={true}
        animationType="fade"
        visible={addUserloading}
        onRequestClose={() => {}} // Prevent closing modal manually
      >
        <View style={addUserToGroupStyle.modalBackground}>
          <View style={addUserToGroupStyle.modalContent}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={addUserToGroupStyle.loadingText}>Processing...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddUserToGroupScreen;
