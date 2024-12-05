import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useAuthStore } from "src/services/storage/authStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import * as FileSystem from "expo-file-system";

const MyProject: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { token } = useAuthStore();
  const { colors } = useTheme();
  const [pageNo, setPageNo] = useState<any>(1);
  const [projectLoading, setProjectLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<any[]>();

  useEffect(() => {
    const fetchStudentProjects = async (pageNo) => {
      setProjectLoading(true);
      try {
        const res = await axios.get(
          `https://backend.mymegaminds.com/api/project/get-all-in-student?page=1&limit=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjects(res.data.projects);
        setPageNo(res.data.projects.length > 0 ? pageNo + 1 : undefined);
      } catch (error) {
        console.error("Error fetching student projects:", error);
      } finally {
        setProjectLoading(false);
      }
    };
    // Initial fetch
    fetchStudentProjects(pageNo);
  }, []);

  const handleCreateProject = () => {
    navigation.navigate("CreateProject");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={34} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.text }]}>
          My Projects
        </Text>
      </View>
      <View style={styles.createButtonContainer}>
        <Text>20</Text>
        <TouchableOpacity onPress={handleCreateProject}>
          <Text
            style={[
              styles.createButton,
              { backgroundColor: colors.bottomNavActivePage },
            ]}
          >
            Create New Project
          </Text>
        </TouchableOpacity>
      </View>
      {/* <View style={{ paddingHorizontal: 20 }}> */}
      {projectLoading ? (
        <ActivityIndicator style={{ marginTop: 100 }} size={"large"} />
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 200 }}
          style={{ paddingHorizontal: 20 }}
        >
          {projects &&
            projects.map((d, index) => (
              <View
                style={[
                  styles.projectContainer,
                  { backgroundColor: colors.primary },
                ]}
                key={index}
              >
                <Text> Assignment Id :- {d.assignmentId}</Text>
                <Text> Assignment Title :- {d.assignmentTitle}</Text>
                <Text> Subject :- {d.subject}</Text>
                <Text> Pay Status :- {d.status}</Text>
                <Text> Payment :- {d.sPayment}</Text>
              </View>
            ))}
        </ScrollView>
      )}
      {/* </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    gap: 10,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  projectContainer: {
    padding: 30,
    marginTop: 20,
    borderRadius: 20,
  },
  createButtonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 100,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  createButton: {
    color: "white",
    padding: 10,
    fontSize: 18,
    fontWeight: "bold",
    borderRadius: 6,
  },
});

export default MyProject;
