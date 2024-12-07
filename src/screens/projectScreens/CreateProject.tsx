import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getAllSubjects } from "src/services/miscServices";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Fontisto from "@expo/vector-icons/Fontisto";
import FileUploadForm from "./FIleUploadForm";
import { studentCreateNewProject } from "./utils";
import { useAuthStore } from "src/services/storage/authStore";
import { showMessage } from "react-native-flash-message";
interface Subject {
  label: string;
  value: string;
}
interface Data {
  assignmentTitle: string;
  subject?: string;
  documentType: string[];
  numberOfSlides: any;
  numberOfPages: any;
  numberOfWords: any;
  Miscellaneous: any;
  englishLevel?: any[];
  description: any;
  deadline: Date;
  additionalNotes: any;
  style: any;
  sPayment: any;
  amount: any;
  status: any;
  files?: any[];
}

const CreateProject: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [allSubjects, setAllSubjects] = useState<Subject[]>();
  const [subject, setSelectedSubject] = useState();
  const [assignmentTitle, setAssignmentTitle] = useState<any>("");
  const [show, setShow] = useState(false);
  const [documentType, setDocumentType] = useState<any[]>([]);
  const [numberOfSlides, setNumberOfSlides] = useState<any>(0);
  const [numberOfPages, setNumberOfPages] = useState<any>(0);
  const [numberOfWords, setNumberOfWords] = useState<any>(0);
  const [Miscellaneous, setMiscellaneous] = useState<any>("");
  const [englishLevel, setEnglishLevel] = useState<any[]>();
  const [description, setDescription] = useState<any>("");
  const [deadline, setDeadline] = useState(new Date());
  const [additionalNotes, setAdditionalNotes] = useState<any>("");
  const [style, setStyle] = useState<any>();
  const [files, setFiles] = useState<any[]>();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);

  const data: Data = {
    assignmentTitle,
    subject,
    documentType,
    numberOfSlides,
    numberOfPages,
    numberOfWords,
    Miscellaneous,
    englishLevel,
    description,
    deadline,
    amount: 0,
    additionalNotes: additionalNotes === "" ? "." : additionalNotes,
    style,
    sPayment: 0,
    files,
    status: "Un-Paid",
  };
  const onSubmit = async () => {
    if (!assignmentTitle) {
      showMessage({
        message: "Error",
        description: "Enter Assignment title ",
        type: "danger",
      });
      return;
    }
    if (!subject) {
      showMessage({
        message: "Error",
        description: "Please Select Subject ",
        type: "danger",
      });
      return;
    }
    if (!englishLevel) {
      showMessage({
        message: "Error",
        description: "Please Select English Level ",
        type: "danger",
      });
      return;
    }
    if (!style) {
      showMessage({
        message: "Error",
        description: "Please Select Referencing Style",
        type: "danger",
      });
      return;
    }
    if (documentType.length < 1) {
      showMessage({
        message: "Error",
        description: "Please Select Document Type",
        type: "danger",
      });
      return;
    }
    if (description === "") {
      showMessage({
        message: "Error",
        description: "Enter Description",
        type: "danger",
      });
      return;
    }

    setLoading(true);
    const payload = { values: data, token: token };
    const response = await studentCreateNewProject(payload);
    if (response.success === true) {
      Alert.alert(
        "Project Created",
        "Your project was created successfully. Please contact the admin for payment and further information."
      );
    } else {
      Alert.alert(
        "Error",
        "Something went wrong while creating your project. Please try again later."
      );
    }
    setLoading(false);
  };

  const onChange = (event: any, selectedDate: Date | undefined) => {
    setShow(Platform.OS === "ios"); // Keep the picker open on iOS after selection
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };
  const EnglishLevel = [
    { label: "Basic", value: "basic" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Professional", value: "professional" },
  ];
  const ReferencingStyle = [
    { label: "Apa", value: "Apa" },
    { label: "Harvard", value: "Harvard" },
    { label: "chicago", value: "chicago" },
    { label: "MLA", value: "MLA" },
    { label: "Others", value: "Others" },
  ];
  const showDatePicker = () => {
    setShow(true);
  };

  const getSubjects = async () => {
    try {
      const data = await getAllSubjects();
      if (data) {
        setAllSubjects(
          data.map((item: any) => ({
            label: item.subjectName,
            value: item.subjectName,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };
  useEffect(() => {
    getSubjects();
  }, []);
  const handleToggle = (type: string) => {
    setDocumentType((prevState) => {
      if (prevState.includes(type)) {
        return prevState.filter((item) => item !== type);
      } else {
        return [...prevState, type];
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View
        style={[
          {
            marginBottom: 20,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 30,
            gap: 10,
            paddingTop: 40,
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
        <Text
          style={[{ fontSize: 22, fontWeight: "bold" }, { color: colors.text }]}
        >
          Create Your Project
        </Text>
      </View>

      {/* Form */}
      {loading ? (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 80,
            backgroundColor: colors.primary,
            padding: 20,
            marginHorizontal: 20,
            borderRadius: 20,
          }}
        >
          <ActivityIndicator size={"large"} />
          <Text style={{ marginTop: 20, color: colors.text }}>
            Pleas wait your project is in process
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginHorizontal: 20 }}>
            <View>
              <Text
                style={[
                  {
                    color: colors.text,
                  },
                  styles.labelText,
                ]}
              >
                Assignment Title *
              </Text>
              <TextInput
                style={[
                  styles.textInput,

                  { color: colors.text },
                  { backgroundColor: colors.primary },
                ]}
                value={assignmentTitle}
                placeholderTextColor={colors.text}
                placeholder="Enter assignment title here"
                onChangeText={(text) => setAssignmentTitle(text)}
              />
            </View>

            {/* subject picker  */}
            <View style={styles.dropdownContainer}>
              <Text
                style={[
                  {
                    color: colors.text,
                  },
                  styles.labelText,
                ]}
              >
                Select Subject *
              </Text>
              <View
                style={[
                  { borderRadius: 10, overflow: "hidden" },
                  { backgroundColor: colors.primary },
                ]}
              >
                <Picker
                  selectedValue={subject}
                  onValueChange={(itemValue) => setSelectedSubject(itemValue)}
                  style={[
                    styles.picker,
                    { color: colors.text },
                    { opacity: 0.8 },
                  ]}
                  dropdownIconColor={colors.text}
                >
                  {allSubjects &&
                    allSubjects.map((subject, index) => (
                      <Picker.Item
                        key={index}
                        label={subject.label}
                        value={subject.value}
                      />
                    ))}
                </Picker>
              </View>
            </View>
            {/* English level picker  */}
            <View style={styles.dropdownContainer}>
              <Text
                style={[
                  {
                    color: colors.text,
                  },
                  styles.labelText,
                ]}
              >
                English Level *
              </Text>
              <View
                style={[
                  { borderRadius: 10, overflow: "hidden" },
                  { backgroundColor: colors.primary },
                ]}
              >
                <Picker
                  selectedValue={englishLevel}
                  onValueChange={(e) => setEnglishLevel(e)}
                  style={[styles.picker, { color: colors.text, opacity: 0.8 }]}
                  dropdownIconColor={colors.text}
                >
                  {EnglishLevel.map((level, index) => (
                    <Picker.Item
                      key={index}
                      label={level.label}
                      value={level.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            {/* Referencing Style*
             */}
            <View style={styles.dropdownContainer}>
              <Text
                style={[
                  {
                    color: colors.text,
                  },
                  styles.labelText,
                ]}
              >
                Referencing Style *
              </Text>
              <View
                style={[
                  { borderRadius: 10, overflow: "hidden" },
                  { backgroundColor: colors.primary },
                ]}
              >
                <Picker
                  selectedValue={style}
                  onValueChange={(e) => setStyle(e)}
                  style={[styles.picker, { color: colors.text, opacity: 0.8 }]}
                  dropdownIconColor={colors.text}
                >
                  {ReferencingStyle.map((style, index) => (
                    <Picker.Item
                      key={index}
                      label={style.label}
                      value={style.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* document type  */}
            <View style={{ marginTop: 10 }}>
              <Text
                style={[
                  {
                    color: colors.text,
                  },
                  styles.labelText,
                ]}
              >
                Select Document Types *
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => handleToggle("word")}
                  style={[
                    styles.button,
                    documentType.includes("word") && styles.selectedButton,
                  ]}
                >
                  {documentType.includes("word") && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      style={[
                        styles.buttonText,
                        documentType.includes("word") &&
                          styles.selectedButtonText,
                      ]}
                    />
                  )}
                  <Text
                    style={[
                      styles.buttonText,
                      documentType.includes("word") &&
                        styles.selectedButtonText,
                    ]}
                  >
                    Word
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleToggle("ppt")}
                  style={[
                    styles.button,
                    documentType.includes("ppt") && styles.selectedButton,
                  ]}
                >
                  {documentType.includes("ppt") && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      style={[
                        styles.buttonText,
                        documentType.includes("ppt") &&
                          styles.selectedButtonText,
                      ]}
                    />
                  )}
                  <Text
                    style={[
                      styles.buttonText,
                      documentType.includes("ppt") && styles.selectedButtonText,
                    ]}
                  >
                    PPT
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleToggle("excel")}
                  style={[
                    styles.button,
                    documentType.includes("excel") && styles.selectedButton,
                  ]}
                >
                  {documentType.includes("excel") && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      style={[
                        styles.buttonText,
                        documentType.includes("excel") &&
                          styles.selectedButtonText,
                      ]}
                    />
                  )}
                  <Text
                    style={[
                      styles.buttonText,
                      documentType.includes("excel") &&
                        styles.selectedButtonText,
                    ]}
                  >
                    Excel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleToggle("miscellaneous")}
                  style={[
                    styles.button,
                    documentType.includes("miscellaneous") &&
                      styles.selectedButton,
                  ]}
                >
                  {documentType.includes("miscellaneous") && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      style={[
                        styles.buttonText,
                        documentType.includes("miscellaneous") &&
                          styles.selectedButtonText,
                      ]}
                    />
                  )}
                  <Text
                    style={[
                      styles.buttonText,
                      documentType.includes("miscellaneous") &&
                        styles.selectedButtonText,
                    ]}
                  >
                    Miscellaneous
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {documentType.includes("word") && (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Text
                      style={[
                        { opacity: 0.6 },
                        { color: colors.text },
                        { fontSize: 12 },
                      ]}
                    >
                      Number of Pages:
                    </Text>
                    <TextInput
                      style={[
                        { backgroundColor: colors.primary },
                        { borderRadius: 5, paddingHorizontal: 10 },
                        { color: colors.text },
                      ]}
                      value={numberOfSlides}
                      onChangeText={(text) => setNumberOfPages(text)}
                      keyboardType="numeric"
                    />
                  </View>
                )}

                {documentType.includes("ppt") && (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <Text
                      style={[
                        { opacity: 0.6 },
                        { color: colors.text },
                        { fontSize: 12 },
                      ]}
                    >
                      Number of Slides:
                    </Text>
                    <TextInput
                      style={[
                        { backgroundColor: colors.primary },
                        { borderRadius: 5, paddingHorizontal: 10 },
                        { color: colors.text },
                      ]}
                      value={numberOfSlides}
                      onChangeText={(text) => setNumberOfSlides(text)}
                      keyboardType="numeric"
                    />
                  </View>
                )}
                {documentType.includes("miscellaneous") && (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={[
                        { opacity: 0.6 },
                        { color: colors.text },
                        { fontSize: 12 },
                      ]}
                    >
                      Miscellaneous document:
                    </Text>
                    <TextInput
                      style={[
                        { backgroundColor: colors.primary },
                        { borderRadius: 5, paddingHorizontal: 10 },
                        { color: colors.text },
                      ]}
                      value={Miscellaneous}
                      onChangeText={(text) => setMiscellaneous(text)}
                    />
                  </View>
                )}
              </View>
            </View>

            {/* description  */}
            <View style={styles.dropdownContainer}>
              <Text
                style={[
                  {
                    color: colors.text,
                  },
                  styles.labelText,
                ]}
              >
                Description *
              </Text>
              <View
                style={[
                  { borderRadius: 10, overflow: "hidden" },
                  { backgroundColor: colors.primary },
                ]}
              >
                <TextInput
                  value={description}
                  style={{ padding: 20, height: 100, color: colors.text }}
                  onChangeText={(text) => setDescription(text)}
                  multiline
                />
              </View>
            </View>

            {/* date picker  */}
            <View style={{ marginTop: 10 }}>
              <Text
                style={[
                  {
                    color: colors.text,
                  },
                  styles.labelText,
                ]}
              >
                Deadline*
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 20,
                  alignItems: "center",
                  paddingLeft: 8,
                }}
              >
                {/* Button to trigger date picker */}
                <TouchableOpacity
                  onPress={showDatePicker}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    borderColor: colors.bottomNavActivePage,
                    borderWidth: 1,
                    padding: 8,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: colors.text }}>pick a date</Text>
                  <Fontisto name="date" size={24} color={colors.text} />
                </TouchableOpacity>
                {/* Display the selected date */}
                {deadline && (
                  <Text
                    style={[
                      { color: colors.text },
                      {
                        borderColor: colors.bottomNavActivePage,
                        borderWidth: 1,
                        padding: 8,
                        paddingHorizontal: 15,
                        borderRadius: 5,
                      },
                    ]}
                  >
                    {deadline.toLocaleDateString()}
                  </Text>
                )}
              </View>

              {/* DateTimePicker component */}
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={deadline}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <FileUploadForm setAllFiles={setFiles} />

            {/* Additional notes  */}
            <View style={styles.dropdownContainer}>
              <Text
                style={[
                  {
                    color: colors.text,
                  },
                  styles.labelText,
                ]}
              >
                Aditional Notes
              </Text>
              <View
                style={[
                  { borderRadius: 10, overflow: "hidden" },
                  { backgroundColor: colors.primary },
                ]}
              >
                <TextInput
                  value={additionalNotes}
                  style={{ padding: 20, height: 100, color: colors.text }}
                  onChangeText={(text) => setAdditionalNotes(text)}
                  multiline
                />
              </View>
            </View>

            {/* submit button  */}
            <View>
              <TouchableOpacity style={{ marginTop: 15 }} onPress={onSubmit}>
                <Text
                  style={[
                    {
                      backgroundColor: colors.bottomNavActivePage,
                      color: "white",
                      padding: 10,
                      fontSize: 18,
                      fontWeight: "bold",
                      borderRadius: 10,
                      textAlign: "center",
                    },
                  ]}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    padding: 10,
    borderRadius: 10,
    paddingLeft: 20,
    fontSize: 14,
  },
  labelText: { opacity: 0.6, marginBottom: 5, marginLeft: 5, fontSize: 14 },

  dropdownContainer: {
    marginTop: 10,
  },

  picker: {
    fontSize: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 0,
    paddingHorizontal: Platform.OS === "ios" ? 10 : 0,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    width: "48%",
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
    paddingHorizontal: 15,
    display: "flex",
    flexDirection: "row",
  },
  selectedButton: {
    backgroundColor: "#059dc0",
  },
  buttonText: {
    fontSize: 14,
    color: "#000",
  },
  selectedButtonText: {
    color: "#fff",
  },
  uploadButton: {
    backgroundColor: "#6200ea",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  fileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  fileSize: {
    fontSize: 12,
    color: "#666",
  },
  error: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
});

export default CreateProject;
