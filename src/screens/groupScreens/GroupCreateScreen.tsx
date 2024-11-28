import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { createGroupChat, getAllUsers } from "../../services/api/chatService";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useNavigation, useTheme } from "@react-navigation/native";
import { getUserFirstLetter } from "../../misc/misc";
import { useAuthStore } from "src/services/storage/authStore";
import { groupCreateStyle } from "../styles/groupCreateScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useUserStore } from "src/services/storage/usersStore";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useChatStore } from "src/services/storage/chatStore";
interface User {
  id: string;
  name: string;
  userType: string;
}

const GroupCreateScreen: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [creteGroupLoading, setCreateGroupLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<any[] | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [showNextStep, setShowNextStep] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>(String);
  const { loggedUser, token } = useAuthStore();
  const { updateSingleChat } = useChatStore();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { users, setUsers } = useUserStore();

  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
  }, [users]);

  useEffect(() => {
    const searchUsers = () => {
      if (!searchText.trim()) {
        setFilteredUsers(users);
      } else {
        const updatedUsers = users?.filter((user) =>
          user.name?.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredUsers(updatedUsers || []);
      }
    };
    searchUsers();
  }, [searchText, users]);

  const handleCreateGroup = async () => {
    const allUsersForGroup = [loggedUser, ...selectedUsers];
    setCreateGroupLoading(true);
    setError(null);
    try {
      const data = await createGroupChat(allUsersForGroup, groupName, token);
      updateSingleChat(data._id, data);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setCreateGroupLoading(false);
      navigation.goBack();
    }
  };

  const handleGetUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUserType = loggedUser?.userType;
      await getAllUsers(currentUserType, setUsers, token);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
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

  const renderItem = (item: any) => (
    <TouchableOpacity
      onPress={() => handleAddUser(item)}
      style={groupCreateStyle.userContainer}
    >
      <View
        style={[
          groupCreateStyle.profileCircle,
          selectedUsers.some((user) => user._id === item._id) && {
            borderColor: "#059dc0",
            borderWidth: 8,
          },
        ]}
      >
        {loggedUser ? (
          <Text style={groupCreateStyle.profileText}>
            {getUserFirstLetter(item?.name)}
          </Text>
        ) : null}
      </View>

      <View style={groupCreateStyle.userInfo}>
        <View style={groupCreateStyle.userHeader}>
          <Text style={[groupCreateStyle.username, { color: colors.text }]}>
            {item?.name}
          </Text>
          {loggedUser ? (
            <Text
              style={[
                groupCreateStyle.userTypeText,
                { color: colors.text },
                { opacity: 0.6 },
              ]}
            >
              {item?.userType}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSelectedUser = (item: any) => {
    return (
      <TouchableOpacity
        onPress={() => !showNextStep && handleAddUser(item)}
        style={{
          width: 60,
          display: "flex",
          alignItems: "center",
          marginLeft: 10,
        }}
      >
        {!showNextStep && (
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
        )}
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
            <Text style={groupCreateStyle.profileText}>
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
    <View style={[groupCreateStyle.container]}>
      {loading && (
        <View
          style={{
            position: "absolute",
            bottom: 10,
            zIndex: 100,
            width: "100%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <View
              style={[
                {
                  backgroundColor: colors.primary,
                  padding: 20,
                  paddingHorizontal: 40,
                  borderRadius: 100,
                },
              ]}
            >
              <ActivityIndicator size={"large"} />
            </View>
          </View>
        </View>
      )}

      <View
        style={[groupCreateStyle.header, { backgroundColor: colors.primary }]}
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
          Create Group
        </Text>
      </View>

      {!showNextStep && (
        <View
          style={[
            groupCreateStyle.searchContainer,
            { backgroundColor: colors.primary },
          ]}
        >
          <Ionicons name="search" style={{}} size={44} color={colors.text} />
          <TextInput
            style={[groupCreateStyle.input, { color: colors.text }]}
            placeholder="Search users..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={colors.text}
            autoCapitalize="none"
          />
          <TouchableOpacity style={{}} onPress={() => setSearchText("")}>
            <FontAwesome6 name="times-circle" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}

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
        !showNextStep && (
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
        )
      )}

      {showNextStep && (
        <View>
          {selectedUsers.length > 0 && (
            <View style={{ height: 180 }}>
              <ScrollView
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                }}
                showsVerticalScrollIndicator={true}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {selectedUsers.map((u) => renderSelectedUser(u))}
                </View>
              </ScrollView>
            </View>
          )}
          <View>
            <View
              style={[
                groupCreateStyle.inputContainer,
                { backgroundColor: colors.primary },
              ]}
            >
              <TextInput
                placeholder="Enter Group Name"
                placeholderTextColor={colors.text}
                value={groupName}
                onChangeText={setGroupName}
                style={[groupCreateStyle.inputGroup, { color: colors.text }]}
                editable={!loading}
              />
            </View>
          </View>
        </View>
      )}

      {selectedUsers.length > 1 && !showNextStep && (
        <View
          style={{ position: "absolute", zIndex: 20, right: 20, bottom: 20 }}
        >
          <TouchableOpacity
            onPress={() => setShowNextStep(!showNextStep)}
            style={{
              backgroundColor: "#059dc0",
              padding: 10,
              borderRadius: 15,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: "white", marginLeft: 10, fontWeight: "bold" }}
            >
              Next
            </Text>
            <MaterialIcons name="navigate-next" size={24} color={"white"} />
          </TouchableOpacity>
        </View>
      )}

      {selectedUsers.length > 1 && showNextStep && (
        <View
          style={{ position: "absolute", zIndex: 20, right: 20, bottom: 20 }}
        >
          <TouchableOpacity
            onPress={() => setShowNextStep(!showNextStep)}
            style={{
              backgroundColor: "#059dc0",
              padding: 10,
              borderRadius: 15,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
            <Text
              style={{ color: "white", marginRight: 10, fontWeight: "bold" }}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showNextStep && groupName && groupName?.length < 5 && (
        <Text style={{ textAlign: "center", color: colors.text }}>
          Enter Atleast 5 Character For The Group Name
        </Text>
      )}

      {selectedUsers.length > 1 &&
        groupName &&
        groupName?.length >= 5 &&
        showNextStep && (
          <View style={{ display: "flex", justifyContent: "center" }}>
            {!creteGroupLoading && groupName && groupName?.length >= 5 && (
              <TouchableOpacity
                onPress={handleCreateGroup}
                style={{
                  backgroundColor: "#059dc0",
                  borderRadius: 15,
                  paddingHorizontal: 20,
                  marginHorizontal: 25,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "700",
                    textAlign: "center",
                    marginVertical: 10,
                  }}
                >
                  Create Group
                </Text>
              </TouchableOpacity>
            )}
            {creteGroupLoading && (
              <View>
                <ActivityIndicator size="large" />
              </View>
            )}
          </View>
        )}

      {error && <Text>Error: {error}</Text>}
    </View>
  );
};

export default GroupCreateScreen;
