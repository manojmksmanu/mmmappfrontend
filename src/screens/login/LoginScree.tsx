import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { loggeduser, login } from "../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/userContext";
import { Picker } from "@react-native-picker/picker";
import { showMessage } from "react-native-flash-message";
import { isValidEmail } from "../../misc/misc";

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [userType, SetUserType] = useState<string>("Admin");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setLoggedUser, socket } = useAuth();

  const handleSignUpPress = () => {
    navigation.navigate("SignUp");
  };

  const handleLogin = async () => {
    if (!email || !isValidEmail(email)) {
      showMessage({
        message: "Error",
        description: "Enter Valid Email.... ",
        type: "danger",
      });
      return;
    }
    try {
      setLoading(true);
      await login(email, userType, password);
      const user: any = await loggeduser();
      await AsyncStorage.setItem("userInfo", JSON.stringify(user));
      setLoggedUser(user);
      socket?.emit("userOnline", user._id);
      setLoading(false);
      navigation.navigate("ChatList");
      Alert.alert("Login successful");
    } catch (error: any) {
      showMessage({
        message: "Error",
        description: `${error.message}`,
        type: "danger",
      });
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        backgroundColor="#187afa" // Set the background color for Android
        translucent={false} // Ensure the status bar is not translucent
      />
      <Text style={styles.logoText}>MyMegaminds</Text>

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
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* User Type Picker Styled as Input */}
      <View style={styles.inputContainer}>
        <Image
          style={{ width: 20, height: 20 }}
          source={require("../../../assets/user.png")}
        />
        <Picker
          selectedValue={userType}
          onValueChange={(itemValue) => SetUserType(itemValue)}
          style={styles.picker}
          enabled={!loading}
          dropdownIconColor="black"
        >
          <Picker.Item label="Admin" value="Admin" />
          <Picker.Item label="Tutor" value="Tutor" />
          <Picker.Item label="Student" value="Student" />
        </Picker>
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

      {/* Login Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity
          style={[styles.button, Platform.OS === "ios" && styles.iosButton]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      {/* Forgot Password and Signup */}
      <View>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotText}>Forgot Your Password?</Text>
        </TouchableOpacity>

        <Text style={styles.noAccountText}>Don't have an account?</Text>

        <TouchableOpacity style={{ paddingTop: 0 }} onPress={handleSignUpPress}>
          <Text style={styles.signUpText}>SignUp</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#f5f7fa",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#187afa",
    textAlign: "center",
    marginBottom: 40,
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
  iosButton: {
    opacity: 0.9, // Adding slight opacity for iOS feedback
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  forgotText: {
    color: "#187afa",
    textAlign: "center",
    fontWeight: "bold",
  },
  noAccountText: {
    textAlign: "center",
    marginTop: 4,
    fontSize: 16,
    color: "grey",
  },
  signUpText: {
    color: "#187afa",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default LoginScreen;
