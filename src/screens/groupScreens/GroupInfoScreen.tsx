import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
} from "react-native";
import { useAuth } from "../../context/userContext";
import { getUserFirstLetter } from "../../misc/misc";
import GroupInfoProfilePhoto from "../../components/smallComp/GroupInfoProfilePhoto";
import { showMessage } from "react-native-flash-message";
import { groupInfoStyles } from "../styles/groupInfoScreen";
import {
  removeUserFromGroup,
  renameGroupName,
} from "../../services/api/chatService";
import { useTheme } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuthStore } from "src/services/storage/authStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const GroupInfoScreen: React.FC<{ route: any; navigation: any }> = ({
  navigation,
}) => {
  const { selectedChat, setSelectedChat } = useAuth() as {
    selectedChat: any;
    setSelectedChat: any;
  };
  const { loggedUser } = useAuthStore();
  const [renameGroup, setRenameGroup] = useState("");
  const [openRenameModal, setOpenRenameModal] = useState<boolean>(false);
  const [renameLoading, setRenameLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const { colors } = useTheme();
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleRemoveUser = async (item: any) => {
    Alert.alert(
      `Remove ${item.name}`, // Title of the alert
      `Are you sure you want to remove ${item.name} from the ${selectedChat.groupName}?`, // Message of the alert
      [
        {
          text: "Cancel", // Text for the cancel button
          onPress: () => console.log("User not removed"), // Action for cancel
          style: "cancel",
        },
        {
          text: "OK", // Text for the confirm button
          onPress: () => removeUser(item), // Action for confirm
        },
      ],
      { cancelable: false } // Prevent closing the alert by tapping outside
    );
  };

  const removeUser = async (item: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await removeUserFromGroup(selectedChat._id, item._id);
      // FetchChatsAgain();
      setSelectedChat(data.chat);
      showMessage({
        message: "Success",
        description: `${item.name} removed from ${selectedChat.groupName}`,
        type: "success",
        autoHide: true,
        duration: 1000,
      });
    } catch (error: any) {
      showMessage({
        message: "Error",
        description: `${error.message}`,
        type: "danger",
        autoHide: true,
        duration: 2000,
      });
      setError(error.message);
    } finally {
      // FetchChatsAgain();
      setLoading(false);
    }
  };

  const handleRenameGroup = async () => {
    setRenameLoading(true);
    setError(null);
    try {
      const data = await renameGroupName(selectedChat._id, renameGroup);
      // FetchChatsAgain();
      setSelectedChat(data.chat);
      showMessage({
        message: "Success", // Title for the success message
        description: `New name of group is ${data.chat.groupName}`, // Detailed success message (equivalent to text2)
        type: "success", // Success message type
        autoHide: true,
        duration: 1000, // Equivalent to visibilityTime
      });
      setOpenRenameModal(false);
    } catch (error: any) {
      showMessage({
        message: "Error", // Title for the error message
        description: `${error.message}`, // Detailed error message (equivalent to text2)
        type: "danger", // 'danger' maps to error messages
        autoHide: true,
        duration: 2000, // Equivalent to visibilityTime
      });
      setError(error.message);
    } finally {
      // FetchChatsAgain();
      setRenameLoading(false);
    }
  };

  const handleAddUserToGroup = () => {
    navigation.navigate("AddUserToGroup");
  };
  const handleModalClose = () => {
    setOpenRenameModal(false);
  };
  const renderItem = (item: any) => (
    <>
      <View style={groupInfoStyles.userContainer}>
        <View style={groupInfoStyles.profileCircle}>
          <Text style={[groupInfoStyles.profileText]}>
            {getUserFirstLetter(item?.name)}
          </Text>
        </View>

        <View style={groupInfoStyles.userInfo}>
          <View style={groupInfoStyles.userHeader}>
            <Text style={[groupInfoStyles.username, { color: colors.text }]}>
              {item?.name}
            </Text>
            {loggedUser?._id !== item._id && loggedUser ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Text
                  style={[groupInfoStyles.userTypeText, { color: colors.text }]}
                >
                  {item?.userType}
                </Text>
                {item.userType !== "Super-Admin" && (
                  <TouchableOpacity onPress={() => handleRemoveUser(item)}>
                    <MaterialCommunityIcons
                      name="delete-empty"
                      size={28}
                      color={colors.text}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </>
  );
  return (
    <ScrollView style={groupInfoStyles.container}>
      <View
        style={[groupInfoStyles.header, { backgroundColor: colors.primary }]}
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
          GroupInfo
        </Text>
      </View>
      {/* ----Top Group name--  */}
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 20,
          paddingBottom: 30,
          borderRadius: 30,
        }}
      >
        {GroupInfoProfilePhoto(selectedChat.groupName)}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            opacity: 0.8,
          }}
        >
          {selectedChat && (
            <Text
              style={{ color: colors.text, fontSize: 20, fontWeight: "bold" }}
            >
              {selectedChat.groupName}
            </Text>
          )}
          <TouchableOpacity onPress={() => setOpenRenameModal(true)}>
            <Image
              style={{ width: 30, height: 30 }}
              source={require("../../../assets/edit.png")}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* -----all members of group-----  */}
      <View
        style={[
          {
            marginTop: 10,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            borderRadius: 30,
          },
          { backgroundColor: colors.primary },
        ]}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              marginTop: 25,
              marginLeft: 30,
              color: colors.text,
              opacity: 0.8,
            }}
          >
            Total members : {selectedChat.users.length}
          </Text>
          {loading && (
            <View>
              <ActivityIndicator
                style={{ marginTop: 30, marginRight: 20 }}
                size="small"
              />
            </View>
          )}
        </View>
        <>
          <View
            style={[
              groupInfoStyles.allUserContainer,
              { maxHeight: expanded ? undefined : 200 },
            ]}
          >
            {selectedChat &&
              selectedChat.users.map((user: any) => (
                <View key={user.user.id}>{renderItem(user.user)}</View>
              ))}
          </View>
          {selectedChat && selectedChat.users.length > 3 && (
            <TouchableOpacity
              onPress={toggleExpand}
              style={groupInfoStyles.showMoreButton}
            >
              <Text
                style={[
                  groupInfoStyles.showMoreText,
                  { color: colors.text },
                  { opacity: 0.7 },
                ]}
              >
                {expanded ? "Show Less" : "Show All Members"}
              </Text>
            </TouchableOpacity>
          )}
        </>
      </View>

      {/* ---add users and exit group button ----  */}
      <View
        style={{
          flex: 1,
          marginTop: 10,
          backgroundColor: colors.primary,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderRadius: 30,
          paddingTop: 30,
          paddingBottom: 30,
          paddingHorizontal: 40,
        }}
      >
        <TouchableOpacity
          onPress={handleAddUserToGroup}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <FontAwesome name="user" size={34} color={colors.text} />
          <Text style={{ color: colors.text, fontSize: 18 }}>Add Users</Text>
        </TouchableOpacity>
        {/* <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <Image
            style={{width: 25, height: 25, opacity: 0.6}}
            source={require('../../../assets/logout.png')}
          />
          <Text style={{color: 'grey', fontSize: 18}}>Exit Group</Text>
        </View> */}
      </View>

      {/* ----modal for groupRename processs */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={openRenameModal}
        onRequestClose={handleModalClose} // Prevent closing modal manually
      >
        <TouchableWithoutFeedback
          onPress={() => {
            renameLoading !== true ? handleModalClose() : "";
          }}
        >
          <View style={groupInfoStyles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={groupInfoStyles.modalContent}>
                {!renameLoading && (
                  <View>
                    <View style={groupInfoStyles.inputContainer}>
                      <TextInput
                        placeholder="Enter New Group Name"
                        placeholderTextColor="grey"
                        value={renameGroup}
                        onChangeText={setRenameGroup}
                        style={groupInfoStyles.textInput}
                      />
                    </View>
                    {renameGroup.length < 5 && renameGroup.length > 0 && (
                      <Text>minimum 5 character</Text>
                    )}
                    {renameGroup.length >= 5 && (
                      <View>
                        <TouchableOpacity
                          onPress={handleRenameGroup}
                          style={{
                            width: "100%",
                            marginHorizontal: 2,
                            marginVertical: 4,
                            paddingHorizontal: 8,
                            backgroundColor: "#187afa",
                            borderRadius: 10,
                          }}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              color: "white",
                              margin: 10,
                              fontWeight: 700,
                            }}
                          >
                            Rename
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}

                {renameLoading && (
                  <>
                    <ActivityIndicator size="large" color="grey" />
                    <Text style={groupInfoStyles.loadingText}>
                      Processing...
                    </Text>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

export default GroupInfoScreen;
