import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  Alert,
  ImageBackground,
  Platform,
  StatusBar,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import FlashMessage, { showMessage } from "react-native-flash-message"; // Import FlashMessage
import { getAllContry, getAllSubjects } from "../../services/miscServices";
import { signup } from "../../services/api/authService";
import { isValidEmail } from "../../misc/misc";
import { localSignUpStyle } from "../styles/signUpScreen";
import { useTheme } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { commonStyles } from "../styles/commonStyles";
import Animated, { BounceInDown, FadeInDown } from "react-native-reanimated";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { BlurView } from "expo-blur";
import Entypo from "@expo/vector-icons/Entypo";
interface Country {
  _id: string;
  name: string;
  phoneCode: string;
  countryCode: string;
}
const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [userType, SetUserType] = useState<string>("Student");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [allCountry, setAllCountry] = useState<any[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneCountry, setPhoneCountry] = useState<any | null>(null);
  const [whatappNumber, setWhatappNumber] = useState<string>("");
  const [whatsAppCountry, setwhatsAppCountry] = useState<any | null>(null);
  const [showSingup, setShowSingUp] = useState<boolean>(false);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);

  const { colors, images } = useTheme();
  const getContries = async () => {
    const data = await getAllContry();
    await setAllCountry(
      data.map((item: any) => {
        return {
          _id: item._id,
          phoneCode: item.phoneCode,
          countryCode: item.countryCode,
          country: item.country,
        };
      })
    );
  };
  const getSubjects = async () => {
    const data = await getAllSubjects();
    await setAllSubjects(
      data.map((item: any) => {
        return { label: item.subjectName, value: item.subjectName };
      })
    );
  };
  useEffect(() => {
    getContries();
    getSubjects();
  }, []);

  const handleSelectSubject = (subjectName: string | null) => {
    if (subjectName && !selectedSubjects.includes(subjectName)) {
      setSelectedSubjects([...selectedSubjects, subjectName]);
    } else {
      showMessage({
        message: "Already Selected",
        type: "danger",
      });
    }
  };
  const handleRemoveTag = (subjectName: string) => {
    setSelectedSubjects(selectedSubjects.filter((s) => s !== subjectName));
  };
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const handleSignUpPress = () => {
    navigation.navigate("Login");
  };
  const validateForm = () => {
    // Check if any field is empty
    if (!name) {
      showMessage({
        message: "Please fill the name field",
        type: "danger",
      });
      return false;
    }

    if (!email || !isValidEmail(email)) {
      showMessage({
        message: "Please enter a valid email address",
        type: "danger",
      });
      return false;
    }

    if (!password) {
      showMessage({
        message: "Please fill the password field",
        type: "danger",
      });
      return false;
    }

    if (!confirmPassword) {
      showMessage({
        message: "Please confirm your password",
        type: "danger",
      });
      return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      showMessage({
        message: "Passwords do not match",
        type: "danger",
      });
      return false;
    }
    setShowSingUp(true);
    // If all validations pass
    return showMessage({
      message: "All is clear",
      type: "success",
    });
  };

  const handleContinue = () => {
    validateForm();
  };
  const handleBack = () => {
    setShowSingUp(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const data = await signup(
        name,
        email,
        password,
        userType,
        phoneNumber,
        phoneCountry,
        whatappNumber,
        whatsAppCountry,
        selectedSubjects
      );
      setLoading(false);
      navigation.navigate("Login");
      showMessage({
        message: "Success", // You can customize the title here
        description: `${data}`,
        type: "success",
      });
    } catch (error: any) {
      setLoading(false);
      if (error?.response?.status === 401) {
        showMessage({
          message: "Invalid Credentials",
          description: "Please enter the correct username and password.",
          type: "danger",
        });
      } else {
        showMessage({
          message: "Error",
          description: error.message,
          type: "danger",
        });
      }
    }
  };

  const validateForm2 = async () => {
    if (!phoneCountry) {
      showMessage({
        message: "Error",
        description: "Please fill the Phone Country Code field",
        type: "danger",
      });
      return false;
    }
    if (!phoneNumber) {
      showMessage({
        message: "Error",
        description: "Please fill the Phone Number field",
        type: "danger",
      });
      return false;
    }
    if (!whatsAppCountry) {
      showMessage({
        message: "Error",
        description: "Please fill the WhatsApp Country Code field",
        type: "danger",
      });
      return false;
    }
    if (!whatappNumber) {
      showMessage({
        message: "Error",
        description: "Please fill the WhatsApp Number field",
        type: "danger",
      });
      return false;
    }
    await handleSignUp();
  };
  // Handle changes in the phone number picker
  const handlePhoneCountryChange = (itemValue: any) => {
    const selected = allCountry.find((code) => code.countryCode === itemValue);
    setPhoneCountry(selected ? selected : "");
  };
  // Handle changes in the WhatsApp picker
  const handleWhatsAppCountryChange = (itemValue: any) => {
    const selected = allCountry.find((code) => code.countryCode === itemValue);
    setwhatsAppCountry(selected ? selected : "");
  };

  return (
    <ImageBackground
      style={[
        localSignUpStyle.container,
        { paddingTop: Platform.OS === "ios" ? 50 : 0 },
      ]} // Adjust padding for status bar
      source={images?.background}
    >
      <Animated.View
        entering={BounceInDown}
        exiting={FadeInDown}
        style={localSignUpStyle.headContentContainer}
      >
        <Text style={localSignUpStyle.loginText}>Sign Up</Text>
        <Text style={localSignUpStyle.logoText}>MyMegaminds</Text>
        <Text style={localSignUpStyle.welcomeText}>
          Join us and get started 🖐
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200).duration(800)}
        style={[
          localSignUpStyle.contentContainer,
          { backgroundColor: colors.background },
        ]}
      >
        {!showSingup ? (
          <View>
            {/* Name Input */}
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
                name="face-man-profile"
                size={24}
                color={colors.text}
              />
              <TextInput
                placeholder="Name"
                placeholderTextColor={colors.text}
                value={name}
                onChangeText={setName}
                style={[localSignUpStyle.input, { color: colors.text }]}
                editable={!loading}
              />
            </BlurView>
            {/* Email Input */}
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
                name="email"
                size={24}
                color={colors.text}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor={colors.text}
                value={email}
                onChangeText={setEmail}
                style={[localSignUpStyle.input, { color: colors.text }]}
                editable={!loading}
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
              <Picker
                selectedValue={userType}
                onValueChange={(itemValue) => SetUserType(itemValue)}
                style={[localSignUpStyle.picker, { color: colors.text }]}
                enabled={!loading}
                dropdownIconColor="black"
              >
                <Picker.Item label="Tutor" value="Tutor" />
                <Picker.Item label="Student" value="Student" />
              </Picker>
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
                style={[localSignUpStyle.input, { color: colors.text }]}
                editable={!loading}
              />
            </BlurView>
            {/* Confirm Password Input */}
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
                placeholder="Confirm Password"
                placeholderTextColor={colors.text}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={[localSignUpStyle.input, { color: colors.text }]}
                editable={!loading}
              />
            </BlurView>
          </View>
        ) : (
          <View>
            {/* --input phone number-- */}
            <BlurView
              style={[
                commonStyles.inputContainer,
                {
                  backgroundColor:
                    colors.dark !== true ? colors.inputBgColor : undefined, // Use `undefined` to not set any color
                },
              ]}
            >
              <FontAwesome name="phone-square" size={24} color={colors.text} />
              <View style={localSignUpStyle.pickerContainer}>
                <Picker
                  selectedValue={phoneCountry}
                  onValueChange={handlePhoneCountryChange}
                  style={[localSignUpStyle.picker, { color: colors.text }]}
                >
                  <Picker.Item label="Select code" value="" />
                  {allCountry.map((code) => (
                    <Picker.Item
                      key={code.countryCode}
                      label={`${code.country} (${code.countryCode}) ${code.phoneCode}`}
                      value={code.countryCode}
                    />
                  ))}
                </Picker>
              </View>
              <View style={localSignUpStyle.inputWrapper}>
                <Text style={localSignUpStyle.countryCodeText}>
                  {phoneCountry?.phoneCode}
                </Text>
                <TextInput
                  placeholder="Phone number"
                  placeholderTextColor={colors.text}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  style={[localSignUpStyle.input, { color: colors.text }]}
                  editable={!loading}
                  keyboardType="numeric"
                />
              </View>
            </BlurView>
            {/* --input whatsapp number-- */}
            <BlurView
              style={[
                commonStyles.inputContainer,
                {
                  backgroundColor:
                    colors.dark !== true ? colors.inputBgColor : undefined, // Use `undefined` to not set any color
                },
              ]}
            >
              <FontAwesome6
                name="square-whatsapp"
                size={24}
                color={colors.text}
              />
              <View style={localSignUpStyle.pickerContainer}>
                <Picker
                  selectedValue={phoneCountry}
                  onValueChange={handleWhatsAppCountryChange}
                  style={[localSignUpStyle.picker, { color: colors.text }]}
                >
                  <Picker.Item label="Select code" value="" />
                  {allCountry.map((code) => (
                    <Picker.Item
                      key={code.countryCode}
                      label={`${code.country} (${code.countryCode}) ${code.phoneCode}`}
                      value={code.countryCode}
                    />
                  ))}
                </Picker>
              </View>
              <View style={localSignUpStyle.inputWrapper}>
                <Text style={localSignUpStyle.countryCodeText}>
                  {phoneCountry?.phoneCode}
                </Text>
                <TextInput
                  placeholder="Phone number"
                  placeholderTextColor={colors.text}
                  value={whatappNumber}
                  onChangeText={setWhatappNumber}
                  style={[localSignUpStyle.input, { color: colors.text }]}
                  editable={!loading}
                  keyboardType="numeric"
                />
              </View>
            </BlurView>

            {userType === "Tutor" && (
              <>
                <BlurView
                  style={[
                    {
                      marginBottom: 20,
                      flexDirection: "column",
                      borderRadius: 15, // Rounded corners for the container
                      padding: 5,
                      overflow: "hidden", // Ensures that the rounded corners show properly
                      paddingHorizontal: 20,
                    },
                  ]}
                >
                  {/* Dropdown List */}
                  <View style={{}}>
                    <Picker
                      selectedValue={selectedSubjects}
                      onValueChange={(itemValue: any, itemIndex) =>
                        handleSelectSubject(itemValue)
                      }
                      style={{ color: colors.text }}
                    >
                      <Picker.Item label="Select a subject" value={null} />
                      {allSubjects.map((subject) => (
                        <Picker.Item
                          key={subject.value}
                          label={subject.label}
                          value={subject.value}
                        />
                      ))}
                    </Picker>
                  </View>

                  {/* Display Selected Tags */}
                  <ScrollView horizontal style={localSignUpStyle.tagsContainer}>
                    {selectedSubjects.map((subject) => (
                      <TouchableOpacity
                        onPress={() => handleRemoveTag(subject)}
                      >
                        <View
                          key={subject}
                          style={[
                            localSignUpStyle.tag,
                            {
                              backgroundColor:
                                colors.dark === true
                                  ? colors.background
                                  : colors.inputBgColor,
                            },
                          ]}
                        >
                          <Text style={{ color: colors.text }}>{subject}</Text>
                          <Entypo
                            name="circle-with-cross"
                            size={16}
                            color={colors.text}
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </BlurView>
              </>
            )}
          </View>
        )}
        {/* Signup, continue and back Button */}
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : !showSingup ? (
          <>
            <TouchableOpacity
              style={[
                localSignUpStyle.button,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleContinue}
            >
              <Text style={localSignUpStyle.buttonText}>Continue</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: 5,
            }}
          >
            <TouchableOpacity
              style={[localSignUpStyle.buttonBack]}
              onPress={handleBack}
            >
              <Text
                style={[
                  localSignUpStyle.BackbuttonText,
                  { color: colors.primary },
                ]}
              >
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                localSignUpStyle.buttonSignUp,
                { backgroundColor: colors.primary },
              ]}
              onPress={validateForm2}
            >
              <Text style={[localSignUpStyle.buttonText]}>SignUp</Text>
            </TouchableOpacity>
          </View>
        )}
        <Animated.View>
          <Text
            style={[
              {
                textAlign: "center",
                marginTop: 10,
                fontSize: 16,
              },
              { color: colors.text },
            ]}
          >
            Already have an account?{" "}
          </Text>
          <View>
            <TouchableOpacity
              style={{ paddingTop: 0 }}
              onPress={handleSignUpPress}
            >
              <Text
                style={[
                  {
                    paddingTop: 0,
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                  { color: "#059dc0" },
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>

      <FlashMessage position="top" />
    </ImageBackground>
  );
};

export default SignUpScreen;
