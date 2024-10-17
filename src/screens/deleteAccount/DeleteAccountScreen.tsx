import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "react-native-gesture-handler";
import { deleteUser } from "../../services/authService";
import { isValidEmail } from "../../misc/misc";
import { showMessage } from "react-native-flash-message";

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
  const { loggedUser, socket, setLoggedUser } = useAuth();

  const deleteUserAccount = async () => {
    try {
      setLoading(true);
      const response = await deleteUser(email, password);
      console.log(response, "on page");
      await AsyncStorage.removeItem("userInfo");
      await AsyncStorage.removeItem("chats");
      await AsyncStorage.removeItem("token");
      socket?.emit("logout", loggedUser?._id);
      setLoggedUser(null);
      setLoading(false);
      showMessage({
        message: "Success", // Title for the success message
        description: `${response}`, // Detailed success message (equivalent to text2)
        type: "success", // Success message type
        autoHide: true, // Default behavior is auto-hide, but you can adjust
        duration: 1000, // Optional: Adjust the duration as needed (default is 2000ms)
      });
      navigationToLogin.navigate("Login");
    } catch (err) {
      setLoading(false);
     showMessage({
       message: "Success", // Title for the message
       description: "Some error occurred. Try again later...", // Detailed message (equivalent to text2)
       type: "success", // Success message type (you might want to use 'danger' for an error)
       autoHide: true, // Default behavior is auto-hide
       duration: 1000, // Optional: Adjust the duration as needed (default is 2000ms)
     });
      console.log(err);
    }
  };

  useEffect(() => {
    navigation.setOptions({
    //   headerLeft: () => (
    //     <TouchableOpacity
    //       onPress={() => navigation.goBack()}
    //       style={styles.backButton}
    //     >
    //       <Image
    //         source={require("../../../assets/back.png")} // Your custom back icon image
    //         style={styles.backIcon}
    //       />
    //     </TouchableOpacity>
    //   ),
      headerTitle: () => (
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Delete Account</Text>
        </View>
      ),
      headerRight: () => <View></View>,
    });
  }, [navigation]);
  const handleDeleteButton = () => {
    if (!email || !isValidEmail(email)) {
     showMessage({
       message: "Error", // Title for the error message
       description: "Please enter a valid email", // Detailed message (equivalent to text2)
       type: "danger", // 'danger' for error messages
       autoHide: true, // Default behavior is auto-hide
       duration: 1000, // Optional: Adjust the duration as needed (default is 2000ms)
     });;
      return;
    }
    if (!password) {
    showMessage({
      message: "Error", // Title for the error message
      description: "Please enter a password", // Detailed message (equivalent to text2)
      type: "danger", // 'danger' for error messages
      autoHide: true, // Default behavior is auto-hide
      duration: 1000, // Optional: Adjust the duration as needed (default is 2000ms)
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
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={styles.loadingIndicator}
        />
      ) : (
        <View>
          <Text style={{ marginBottom: 20 }}>
            This Action will permanently delete your account, messages and chats
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../../../assets/mail.png")}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9E9E9E"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              editable={!loading}
            />
          </View>
          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../../../assets/padlock.png")}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9E9E9E"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              editable={!loading}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleDeleteButton}>
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
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
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 20,
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
