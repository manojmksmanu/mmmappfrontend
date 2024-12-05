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
  Button,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getAllContry, getAllSubjects } from "src/services/miscServices";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Fontisto from "@expo/vector-icons/Fontisto";
interface Subject {
  label: string;
  value: string;
}
const CreateProject: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [allSubjects, setAllSubjects] = useState<Subject[]>();
  const [allCountry, setAllCountry] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
  // const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [documentType, setDocumentType] = useState<string[]>([]);
  const [numberOfSlides, setNumberOfSlides] = useState<any>();
  const [numberOfPages, setNumberOfPages] = useState<any>();
  const [numberOfWords, setNumberOfWords] = useState<any>();
  const [Miscellaneous, setMiscellaneous] = useState<any>();
  const [englishLevel, setEnglishLevel] = useState<any[]>();
  const [description, setDescription] = useState<any>();
  const [deadline, setDeadline] = useState(new Date());
  const [additionalNotes, setAdditionalNotes] = useState<any>();
  const [style, setStyle] = useState<any>();
  const onChange = (event: any, selectedDate: Date | undefined) => {
    setShow(Platform.OS === "ios"); // Keep the picker open on iOS after selection
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };
  console.log(englishLevel);
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
    getContries();
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
              Assignment Title
            </Text>
            <TextInput
              style={[
                styles.textInput,

                { color: colors.text },
                { backgroundColor: colors.primary },
              ]}
              placeholderTextColor={colors.text}
              placeholder="Enter assignment title here"
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
              Select Subject
            </Text>
            <View
              style={[
                { borderRadius: 10, overflow: "hidden" },
                { backgroundColor: colors.primary },
              ]}
            >
              <Picker
                selectedValue={selectedSubject}
                onValueChange={(itemValue) => setSelectedSubject(itemValue)}
                style={[
                  styles.picker,
                  { color: colors.text },
                  { opacity: 0.8 },
                ]}
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
              English Level
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
          {/* Referencing Style
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
              Referencing Style
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
              Select Document Types
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
                    documentType.includes("word") && styles.selectedButtonText,
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
                      documentType.includes("ppt") && styles.selectedButtonText,
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
                    documentType.includes("excel") && styles.selectedButtonText,
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
                    value={numberOfSlides}
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
              Description
            </Text>
            <View
              style={[
                { borderRadius: 10, overflow: "hidden" },
                { backgroundColor: colors.primary },
              ]}
            >
              <TextInput
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
              Deadline
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
                style={{ padding: 20, height: 100, color: colors.text }}
                onChangeText={(text) => setAdditionalNotes(text)}
                multiline
              />
            </View>
          </View>

          {/* submit button  */}
          <View>
            <TouchableOpacity style={{ marginTop: 15 }}>
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
  labelText: { opacity: 0.6, marginBottom: 5, marginLeft: 15, fontSize: 14 },

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
});

export default CreateProject;
