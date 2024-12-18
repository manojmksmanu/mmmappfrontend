import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  ImageBackground,
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
import EULA from "src/components/loginScreenComp/EULA_TEXT";
import { AntDesign } from "@expo/vector-icons";
import PrivacyPolicy from "src/components/loginScreenComp/PrivacyPolicy";

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, images } = useTheme();
  const [email, setEmail] = useState<string>("");
  const [userType, SetUserType] = useState<string>("Admin");
  const [password, setPassword] = useState<string>("");
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const { setToken, setLoggedUser } = useAuthStore();
  const [showEULA, setShowEULA] = useState(false);
  const [EULAValue, setEULAValue] = useState(false);
  const [showPP, setShowPP] = useState(false);
  const [PPValue, setPPValue] = useState(false);
  const [loginActive, setLoginActive] = useState(false);
  useEffect(() => {
    setLoginActive(EULAValue && PPValue);
  }, [PPValue, EULAValue]);

  const handleAcceptEULA = () => {
    setEULAValue(!EULAValue);
    setShowEULA(!showEULA);
  };
  const handleAcceptPP = () => {
    setPPValue(!PPValue);
    setShowPP(!showPP);
  };
  const handleShowEULA = () => {
    setShowEULA(!showEULA);
  };
  const handleShowPP = () => {
    setShowPP(!showPP);
  };
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
      ]}
      source={images?.background}
    >
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

        {/* ----SHow EUla and accept it --  */}
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: 15,
            marginLeft: 15,
          }}
          onPress={handleShowEULA}
        >
          {EULAValue && (
            <AntDesign name="checksquare" size={24} color={colors.text} />
          )}
          {!EULAValue && (
            <View
              style={{
                borderWidth: 2,
                width: 20,
                height: 20,
                borderRadius: 2,
                borderColor: colors.text,
              }}
            ></View>
          )}
          <Text style={{ fontWeight: "bold", color: colors.text }}>
            Accept Terms of Service (EULA)
          </Text>
        </TouchableOpacity>
        {showEULA && (
          <EULA
            showEULA={showEULA}
            onAccept={handleAcceptEULA}
            setShowEULA={setShowEULA}
            EULAValue={EULAValue}
          />
        )}
        {/* ----SHow Privacy policy and accept it --  */}
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: 15,
            marginLeft: 15,
          }}
          onPress={handleShowPP}
        >
          {PPValue && (
            <AntDesign name="checksquare" size={24} color={colors.text} />
          )}
          {!PPValue && (
            <View
              style={{
                borderWidth: 2,
                width: 20,
                height: 20,
                borderRadius: 2,
                borderColor: colors.text,
              }}
            ></View>
          )}
          <Text style={{ fontWeight: "bold", color: colors.text }}>
            Accept Privacy Policy
          </Text>
        </TouchableOpacity>
        {showPP && (
          <PrivacyPolicy
            visible={showPP}
            onAcceptPP={handleAcceptPP}
            setShowPP={setShowPP}
            PPValue={PPValue}
          />
        )}

        {/* Login Button */}
        {loginLoading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <Animated.View>
            <TouchableOpacity
              style={[
                localLoginStyles.button,
                Platform.OS === "ios" && localLoginStyles.iosButton,
                {
                  backgroundColor: colors.bottomNavActivePage,
                },
                {
                  opacity: !loginActive ? 0.4 : 1,
                },
              ]}
              onPress={loginActive ? handleLogin : () => {}}
              disabled={!loginActive}
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
