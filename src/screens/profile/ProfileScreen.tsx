import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuthStore } from "src/services/storage/authStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useChatStore } from "src/services/storage/chatStore";

type RootStackParamList = {
  ChatList: undefined;
  ChatWindow: { chatId: string };
  Login: undefined;
};
const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const navigationToLogin =
    useNavigation<StackNavigationProp<RootStackParamList, "ChatList">>();

  const { removeToken, removeLoggedUser, loggedUser } = useAuthStore();
  const { colors } = useTheme();
  const { clearChatData } = useChatStore();
  const removeAllMessages = useChatStore((state) => state.removeAllMessages);

  const logout = async () => {
    try {
      removeToken();
      removeLoggedUser();
      clearChatData();
      removeAllMessages();
      navigationToLogin.navigate("Login");
      console.log("Token removed successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const deleteUserAccount = async () => {
    navigation.navigate("DeleteAccount");
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => logout() },
      ],
      { cancelable: true }
    );
  };

  const handleMyProject = async () => {
    navigation.navigate("MyProject");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          {
            marginBottom: 20,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 30,
            gap: 10,
            paddingTop: 30,
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
        <Text style={[styles.name, { color: colors.text }]}>
          {loggedUser?.name}
        </Text>
      </View>
      <View
        style={[
          styles.profileHeader,
          { marginHorizontal: 30 },
          { backgroundColor: colors.secondary },
        ]}
      >
        <FontAwesome name="user" size={84} color={colors.text} />
        <Text style={[styles.name, { color: colors.text }]}>
          {loggedUser?.name}
        </Text>
        <Text style={[styles.userType, { color: colors.text }]}>
          {loggedUser?.userType}
        </Text>
      </View>
      <View
        style={[
          styles.detailsContainer,
          { marginHorizontal: 30 },
          { backgroundColor: colors.secondary },
        ]}
      >
        <Text style={[styles.detailText, { color: colors.text }]}>
          Email: {loggedUser?.email}
        </Text>
        <Text style={[styles.detailText, { color: colors.text }]}>
          Phone: {loggedUser?.phoneNumber}
        </Text>
        <Text style={[styles.detailText, { color: colors.text }]}>
          WhatsApp: {loggedUser?.whatsappNumber}
        </Text>
      </View>
      <View style={[styles.buttonContainer, { marginHorizontal: 30 }]}>
        {loggedUser && loggedUser.userType === "Student" && (
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.bottomNavActivePage },
            ]}
            onPress={handleMyProject}
          >
            <Text style={[styles.buttonText, { color: "white" }]}>
              My Projects
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.bottomNavActivePage },
          ]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, { color: "white" }]}>Logout</Text>
        </TouchableOpacity>
        {loggedUser?.userType !== "Super-Admin" && (
          <TouchableOpacity
            style={[
              styles.button,
              styles.deleteButton,
              { backgroundColor: colors.bottomNavActivePage },
            ]}
            onPress={deleteUserAccount}
          >
            <Text style={[styles.buttonText, { color: "white" }]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  userType: {
    fontSize: 18,
    color: "#777",
    marginBottom: 10,
  },
  detailsContainer: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  deleteButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginLeft: 10,
    padding: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#555",
  },
  headerContainer: {
    alignItems: "center",
  },
  headerTitle: {
    color: "grey",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
