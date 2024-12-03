import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "react-native-gesture-handler";
import { deleteUser } from "../../services/api/authService";
import { isValidEmail } from "../../misc/misc";
import { showMessage } from "react-native-flash-message";
import { useAuthStore } from "src/services/storage/authStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { useChatStore } from "src/services/storage/chatStore";

type RootStackParamList = {
  ChatList: undefined;
  ChatWindow: { chatId: string };
  Login: undefined;
};
const DeleteAccountScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const navigationToLogin =
    useNavigation<StackNavigationProp<RootStackParamList, "ChatList">>();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { token, removeToken, removeLoggedUser } = useAuthStore();
  const { clearChatData } = useChatStore();
  const { colors } = useTheme();

  const deleteUserAccount = async () => {
    try {
      setLoading(true);
      const response = await deleteUser(email, password, token);
      await clearChatData();
      removeToken();
      removeLoggedUser();
      setLoading(false);
      showMessage({
        message: "Success",
        description: `${response}`,
        type: "success",
        autoHide: true,
        duration: 1000,
      });
      navigationToLogin.navigate("Login");
    } catch (err) {
      setLoading(false);
      showMessage({
        message: "Success",
        description: "Some error occurred. Try again later...",
        type: "success",
        autoHide: true,
        duration: 1000,
      });
      console.log(err);
    }
  };

  const handleDeleteButton = () => {
    if (!email || !isValidEmail(email)) {
      showMessage({
        message: "Error",
        description: "Please enter a valid email",
        type: "danger",
        autoHide: true,
        duration: 1000,
      });
      return;
    }
    if (!password) {
      showMessage({
        message: "Error",
        description: "Please enter a password",
        type: "danger",
        autoHide: true,
        duration: 1000,
      });
      return;
    }
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteUserAccount() },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          {
            paddingTop: 40,
            paddingHorizontal: 30,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 20,
            borderBottomEndRadius: 30,
            borderBottomStartRadius: 30,
            gap: 20,
            marginBottom: 20,
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
          Delete Account
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={styles.loadingIndicator}
        />
      ) : (
        <View style={{ paddingHorizontal: 30 }}>
          <Text style={{ marginBottom: 20, color: colors.text, opacity: 0.7 }}>
            This Action will permanently delete your account, messages and chats
          </Text>

          {/* Email Input */}
          <View
            style={[styles.inputContainer, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="mail" size={24} color={colors.text} />
            <TextInput
              placeholder="Email"
              placeholderTextColor={colors.text}
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { color: colors.text }]}
              editable={!loading}
            />
          </View>
          {/* Password Input */}
          <View
            style={[styles.inputContainer, { backgroundColor: colors.primary }]}
          >
            <Entypo name="lock-open" size={24} color={colors.text} />
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.text}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[styles.input, { color: colors.text }]}
              editable={!loading}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.bottomNavActivePage },
            ]}
            onPress={handleDeleteButton}
          >
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "grey",
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingLeft: 20,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    color: "#333",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  icon: {
    marginLeft: 10,
  },
  picker: {
    flex: 1,
    color: "grey",
  },
  button: {
    backgroundColor: "#187afa",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
  },
});

export default DeleteAccountScreen;
