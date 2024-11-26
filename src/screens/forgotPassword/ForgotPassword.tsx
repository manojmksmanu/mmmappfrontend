import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import {
  forgotPassword,
  otpConfirm,
  resetPassword,
} from "../../services/api/authService";
import { showMessage } from "react-native-flash-message";
import { isValidEmail } from "../../misc/misc";
import { localForgotStyle } from "../styles/forgotPasswordScreen";
import { useTheme } from "@react-navigation/native";
import { commonStyles } from "../styles/commonStyles";
import Animated, { BounceInDown, FadeInDown } from "react-native-reanimated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BlurView } from "expo-blur";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showOption, setShowOption] = useState<string>("Forgot");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { colors, images } = useTheme();
  console.log(otp.join(""));
  // Regular expression for strong password
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validatePassword = (password: string) => {
    setIsValid(passwordRegex.test(password));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    validatePassword(text);
  };
  // ---change positon of input as filled aur empty ---
  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    // Move to next input if a digit is entered
    if (text.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    // Automatically move to previous input if cleared
    if (text.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  console.log(email);
  const sendOtp = async () => {
    if (!email || !isValidEmail(email)) {
      showMessage({
        message: "Please enter a valid Email....",
        type: "danger",
      });
      return;
    }
    try {
      setLoading(true);
      const data = await forgotPassword(email);
      showMessage({
        message: data.message,
        type: "success",
      });
      setLoading(false);
      setShowOption("OtpConfirm");
    } catch (err: any) {
      showMessage({
        message: `${err}`,
        type: "danger",
      });
      setLoading(false);
      console.log(err);
    }
  };

  const confirmOtp = async () => {
    if (otp.join("").length < 4) {
      showMessage({
        message: "Enter OTP",
        type: "danger",
      });
      return;
    }
    try {
      setLoading(true);
      const data = await otpConfirm(email, otp.join(""));
      showMessage({
        message: data.message,
        type: "success",
      });
      setLoading(false);
      setShowOption("Reset");
    } catch (err: any) {
      showMessage({
        message: `${err}`,
        type: "danger",
      });
      console.log(err);
    }
  };

  const ResetPassword = async () => {
    if (!isValid) {
      showMessage({
        message:
          "Password must be at least 8 characters long and include numbers, letters, and special characters",
        type: "danger",
      });
      return;
    }
    if (password !== confirmPassword) {
      showMessage({
        message: "Confirm Password is not same as Password ",
        type: "danger",
      });
      return;
    }

    try {
      setLoading(true);
      const data = await resetPassword(email, password);
      await showMessage({
        message: data.message,
        type: "success",
      });
      setLoading(false);
      navigation.navigate("Login");
    } catch (err: any) {
      showMessage({
        message: `${err}`,
        type: "danger",
      });
      setLoading(false);
      navigation.navigate("Login");
      console.log(err);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={images.background}
        style={localForgotStyle.container}
      >
        <Animated.View
          entering={BounceInDown}
          exiting={FadeInDown}
          style={localForgotStyle.headContentContainer}
        >
          {showOption === "Forgot" && (
            <Text style={localForgotStyle.loginText}>Forgot Passwrord?</Text>
          )}
          {showOption === "Reset" && (
            <Text style={localForgotStyle.loginText}>
              Set Your New Password
            </Text>
          )}
          {showOption === "OtpConfirm" && (
            <Text style={localForgotStyle.loginText}>Enter OTP</Text>
          )}
          <Text style={localForgotStyle.logoText}>MyMegaminds</Text>
          {showOption === "Forgot" && (
            <Text style={localForgotStyle.welcomeText}>
              Don't Worry Reset Your Password
            </Text>
          )}
          {showOption === "OtpConfirm" && (
            <Text style={localForgotStyle.welcomeText}>
              Enter the OTP sent to your email.
            </Text>
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          style={[
            localForgotStyle.contentContainer,
            { backgroundColor: colors.background },
          ]}
        >
          {showOption === "Forgot" && (
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
                style={[localForgotStyle.input, { color: colors.text }]}
                editable={!loading}
              />
            </BlurView>
          )}
          {showOption === "OtpConfirm" && (
            <View style={localForgotStyle.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={[
                    localForgotStyle.otpInput,
                    { borderColor: colors.text },
                    { color: colors.text },
                  ]}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                />
              ))}
            </View>
          )}
          {showOption === "Reset" && (
            <>
              <BlurView
                style={[
                  commonStyles.inputContainer,
                  {
                    backgroundColor:
                      colors.dark === true
                        ? colors.background
                        : colors.inputBgColor,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="onepassword"
                  size={24}
                  color={colors.text}
                />
                <TextInput
                  placeholder="New Password"
                  placeholderTextColor={colors.text}
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry
                  style={[localForgotStyle.input, { color: colors.text }]}
                  editable={!loading}
                />
                {isValid === true && (
                  <Text style={localForgotStyle.validText}>Strong 💪</Text>
                )}
                {isValid === false && (
                  <Text style={localForgotStyle.invalidText}>
                    Not Strong 😥
                  </Text>
                )}
              </BlurView>

              <BlurView
                style={[
                  commonStyles.inputContainer,
                  {
                    backgroundColor:
                      colors.dark === true
                        ? colors.background
                        : colors.inputBgColor,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="onepassword"
                  size={24}
                  color={colors.text}
                />
                <TextInput
                  placeholder="Confirm New Password"
                  placeholderTextColor={colors.text}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  style={[localForgotStyle.input, { color: colors.text }]}
                  editable={!loading}
                />
              </BlurView>
            </>
          )}
          <View>
            {showOption === "Forgot" && (
              <>
                {loading ? (
                  <ActivityIndicator size="large" color="#007bff" />
                ) : (
                  <TouchableOpacity
                    style={[
                      localForgotStyle.button,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={sendOtp}
                  >
                    <Text style={localForgotStyle.buttonText}>Send OTP</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            {showOption === "OtpConfirm" && (
              <>
                {loading ? (
                  <ActivityIndicator size="large" color="#007bff" />
                ) : (
                  <View>
                    <TouchableOpacity
                      style={[
                        localForgotStyle.button,
                        { backgroundColor: colors.primary },
                      ]}
                      onPress={confirmOtp}
                    >
                      <Text style={[localForgotStyle.buttonText]}>
                        Confirm OTP
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        marginTop: 15,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={{ color: colors.text }}>
                        Didn't receive the OTP?
                      </Text>
                      <TouchableOpacity
                        onPress={sendOtp}
                        style={{ marginLeft: 5 }}
                      >
                        <Text
                          style={[
                            { fontWeight: "bold" },
                            { color: colors.primary },
                          ]}
                        >
                          Resend it
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            )}
            {showOption === "Reset" && (
              <>
                {loading ? (
                  <ActivityIndicator size="large" color="#007bff" />
                ) : (
                  <View>
                    <TouchableOpacity
                      style={[
                        localForgotStyle.button,
                        { backgroundColor: colors.primary },
                      ]}
                      onPress={ResetPassword}
                    >
                      <Text style={localForgotStyle.buttonText}>
                        Set Password
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
