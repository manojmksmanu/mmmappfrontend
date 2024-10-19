import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import FlashMessage, { showMessage } from "react-native-flash-message"; // Import FlashMessage
import { getAllContry, getAllSubjects } from "../../services/miscServices";
import { signup } from "../../services/authService";
import { isValidEmail } from "../../misc/misc";
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
    <View style={styles.container}>
      <Text style={styles.logoText}>MyMegaminds</Text>
      {!showSingup ? (
        <>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../../../assets/id-card.png")}
            />
            <TextInput
              placeholder="Name"
              placeholderTextColor="#9E9E9E"
              value={name}
              onChangeText={setName}
              style={styles.input}
              editable={!loading}
            />
          </View>
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
          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../../../assets/padlock.png")}
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#9E9E9E"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
              editable={!loading}
            />
          </View>
        </>
      ) : (
        <>
          {/* --input phone number-- */}
          <View style={styles.inputContainer}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../../../assets/phone.png")}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={phoneCountry}
                onValueChange={handlePhoneCountryChange}
                style={styles.picker}
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
            <View style={styles.inputWrapper}>
              <Text style={styles.countryCodeText}>
                {phoneCountry?.phoneCode}
              </Text>
              <TextInput
                placeholder="Phone number"
                placeholderTextColor="#9E9E9E"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.input}
                editable={!loading}
                keyboardType="numeric"
              />
            </View>
          </View>
          {/* --input whatsapp number-- */}
          <View style={styles.inputContainer}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../../../assets/whatsapp.png")}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={whatsAppCountry}
                onValueChange={handleWhatsAppCountryChange}
                style={styles.picker}
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
            <View style={styles.inputWrapper}>
              <Text style={styles.countryCodeText}>
                {whatsAppCountry?.phoneCode}
              </Text>
              <TextInput
                placeholder="Whatsapp number"
                placeholderTextColor="#9E9E9E"
                value={whatappNumber}
                onChangeText={setWhatappNumber}
                style={styles.input}
                editable={!loading}
                keyboardType="numeric"
              />
            </View>
          </View>

          {userType === "Tutor" && (
            <>
              <View style={{ marginBottom: 20 }}>
                {/* Dropdown List */}
                <View style={{ margin: 20 }}>
                  <Text style={{}}>Select a Subject:</Text>
                  <Picker
                    selectedValue={selectedSubjects}
                    onValueChange={(itemValue: any, itemIndex) =>
                      handleSelectSubject(itemValue)
                    }
                    style={{}}
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
                <ScrollView horizontal style={styles.tagsContainer}>
                  {selectedSubjects.map((subject) => (
                    <TouchableOpacity onPress={() => handleRemoveTag(subject)}>
                      <View key={subject} style={styles.tag}>
                        <Text style={{ color: "#187afa" }}>{subject}</Text>
                        <Text style={styles.removeText}>x</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </>
          )}
        </>
      )}
      {/* Signup, continue and back Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : !showSingup ? (
        <>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
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
          <TouchableOpacity style={styles.buttonBack} onPress={handleBack}>
            <Text style={styles.BackbuttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSignUp} onPress={validateForm2}>
            <Text style={styles.buttonText}>SignUp</Text>
          </TouchableOpacity>
        </View>
      )}
      <View>
        <Text
          style={{
            textAlign: "center",
            marginTop: 10,
            fontSize: 16,
            color: "grey",
          }}
        >
          Already have an account?{" "}
        </Text>
        <View>
          <TouchableOpacity
            style={{ paddingTop: 0 }}
            onPress={handleSignUpPress}
          >
            <Text
              style={{
                color: "#187afa",
                paddingTop: 0,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    width: "20%",
    paddingRight: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    width: "70%",
    alignItems: "center",
  },
  countryCodeText: {
    fontSize: 16,
    padding: 5,
    marginRight: 8,
  },
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
  buttonBack: {
    color: "grey",
    width: "50%",
    backgroundColor: "#f6e7fd",
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
  buttonSignUp: {
    width: "50%",
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
  BackbuttonText: {
    color: "#187afa",
    fontSize: 18,
    fontWeight: "500",
  },
  tagsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tag: {
    backgroundColor: "#f6e7fd",
    borderRadius: 4,
    padding: 8,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  removeText: {
    color: "#187afa",
    marginLeft: 10,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
