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
interface Subject {
  label: string;
  value: string;
}
const CreateProject: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [allSubjects, setAllSubjects] = useState<Subject[]>();
  const [allCountry, setAllCountry] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
   const [date, setDate] = useState(new Date());
   const [show, setShow] = useState(false);


     const onChange = (event: any, selectedDate: Date | undefined) => {
       setShow(Platform.OS === "ios"); // Keep the picker open on iOS after selection
       if (selectedDate) {
         setDate(selectedDate);
       }
     };

     const showDatePicker = () => {
       setShow(true); // Show the date picker
     };

  console.log(selectedSubject);
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
    console.log("inside it ");
    getContries();
    getSubjects();
  }, []);

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
          {/* referencing style picker  */}
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
          {/* date picker  */}
          <View>
            <Text style={styles.label}>Select Date</Text>

            {/* Button to trigger date picker */}
            <Button title="Pick a date" onPress={showDatePicker} />

            {/* Display the selected date */}
            <Text style={styles.dateText}>
              {date.toLocaleDateString()} {/* Format the date */}
            </Text>

            {/* DateTimePicker component */}
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
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
    fontSize: 14, // Adjust font size for better readability
    paddingVertical: Platform.OS === "ios" ? 12 : 0, // iOS padding to make the Picker more readable
    paddingHorizontal: Platform.OS === "ios" ? 10 : 0, // Android uses a different internal padding
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default CreateProject;
