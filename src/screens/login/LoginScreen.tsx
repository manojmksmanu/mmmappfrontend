import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  ImageBackground,
  StatusBar,
} from "react-native";
import { login } from "../../services/api/authService";
import { Picker } from "@react-native-picker/picker";
import { showMessage } from "react-native-flash-message";
import { isValidEmail } from "../../misc/misc";
import { useTheme } from "@react-navigation/native";
import { localLoginStyles } from "../styles/loginScreen";
import { commonStyles } from "../styles/commonStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BlurView } from "expo-blur";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Animated, { BounceInDown, FadeInDown } from "react-native-reanimated";
import { useAuthStore } from "src/services/storage/authStore";

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, images } = useTheme();
  const [email, setEmail] = useState<string>("");
  const [userType, SetUserType] = useState<string>("Admin");
  const [password, setPassword] = useState<string>("");
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const { setToken, setLoggedUser } = useAuthStore();
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
      setLoginLoading(true);
      await login(email, userType, password, setToken, setLoggedUser);
      setLoginLoading(false);
      navigation.navigate("ChatList");
      Alert.alert("Login successful");
    } catch (error: any) {
      showMessage({
        message: "Error",
        description: `${error.message}`,
        type: "danger",
      });
      setLoginLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    navigation.navigate("ForgotPassowrd");
  };

  return (
    // <KeyboardAvoidingView
    //   style={[
    //     localLoginStyles.container,
    //     { backgroundColor: colors.background },
    //   ]}
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    // >
    <ImageBackground
      style={[
        localLoginStyles.container,
        { paddingTop: Platform.OS === "ios" ? 50 : 0 },
      ]} // Adjust padding for status bar
      source={images?.background}
    >
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        translucent={true}
        backgroundColor="transparent" // Make background transparent so that image shows through
      />
      <Animated.View
        entering={BounceInDown}
        exiting={FadeInDown}
        style={localLoginStyles.headContentContainer}
      >
        <Text style={localLoginStyles.loginText}>Login</Text>
        <Text style={localLoginStyles.logoText}>MyMegaminds</Text>
        <Text style={localLoginStyles.welcomeText}>Welcome Back 🖐</Text>
      </Animated.View>

      {/* Email Input */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(800)}
        style={[
          localLoginStyles.contentContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <BlurView
          style={[
            commonStyles.inputContainer,
            {
              backgroundColor:
                colors.dark !== true ? colors.inputBgColor : undefined, // Use `undefined` to not set any color
            },
          ]}
        >
          <MaterialIcons name="email" size={24} color={colors.text} />
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.text}
            value={email}
            onChangeText={setEmail}
            style={[localLoginStyles.input, { color: colors.text }]}
            editable={!loginLoading}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </BlurView>
        {/* User Type Picker Styled as Input */}
        <BlurView
          style={[
            commonStyles.inputContainer,
            {
              backgroundColor:
                colors.dark !== true ? colors.inputBgColor : undefined, // Use `undefined` to not set any color
            },
          ]}
        >
          <FontAwesome name="user-circle" size={24} color={colors.text} />
          <View style={localLoginStyles.pickerContainer}>
            <Picker
              selectedValue={userType}
              onValueChange={(itemValue) => SetUserType(itemValue)}
              style={[localLoginStyles.picker, { color: colors.text }]}
              enabled={!loginLoading}
            >
              <Picker.Item label="Admin" value="Admin" />
              <Picker.Item label="Tutor" value="Tutor" />
              <Picker.Item label="Student" value="Student" />
            </Picker>
          </View>
        </BlurView>

        {/* Password Input */}
        <BlurView
          style={[
            commonStyles.inputContainer,
            {
              backgroundColor:
                colors.dark !== true ? colors.inputBgColor : undefined, // Use `undefined` to not set any color
            },
          ]}
        >
          <MaterialCommunityIcons
            name="onepassword"
            size={24}
            color={colors.text}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.text}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[localLoginStyles.input, { color: colors.text }]}
            editable={!loginLoading}
          />
        </BlurView>
        {/* Login Button */}
        {loginLoading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <Animated.View>
            <TouchableOpacity
              style={[
                localLoginStyles.button,
                Platform.OS === "ios" && localLoginStyles.iosButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleLogin}
            >
              <Text style={localLoginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Forgot Password and Signup */}
        <Animated.View>
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={handleForgotPassword}
          >
            <Text style={[localLoginStyles.forgotText, { color: "#059dc0" }]}>
              Forgot Your Password?
            </Text>
          </TouchableOpacity>

          <View style={localLoginStyles.bottomTextContainer}>
            <Text
              style={[localLoginStyles.noAccountText, { color: colors.text }]}
            >
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={handleSignUpPress}>
              <Text style={[localLoginStyles.signUpText, { color: "#059dc0" }]}>
                SignUp
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </ImageBackground>
    // </KeyboardAvoidingView>
  );
};

export default LoginScreen;
