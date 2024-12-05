import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useAuthStore } from "src/services/storage/authStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { normalizeUnits } from "moment";

const MyProject: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { token } = useAuthStore();
  const { colors } = useTheme();
  const [pageNo, setPageNo] = useState<number>(1);
  const [projectLoading, setProjectLoading] = useState<boolean>(false);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [projects, setProjects] = useState<any[]>([]);
  console.log(numberOfPages);
  useEffect(() => {
    const fetchStudentProjects = async (pageNo: number) => {
      setProjectLoading(true);
      try {
        const res = await axios.get(
          `https://backend.mymegaminds.com/api/project/get-all-in-student?page=${pageNo}&limit=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjects(res.data.projects);
        setTotalProjects(res.data.projectCount);
      } catch (error) {
        console.error("Error fetching student projects:", error);
      } finally {
        setProjectLoading(false);
      }
    };
    fetchStudentProjects(pageNo);
  }, [pageNo]);

  useEffect(() => {
    setNumberOfPages(Math.ceil(totalProjects / 5));
  }, [totalProjects]);

  const handleCreateProject = () => {
    navigation.navigate("CreateProject");
  };

  const handlePrevPage = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNo < numberOfPages) {
      setPageNo(pageNo + 1);
    }
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
        {totalProjects > 0 && (
          <View>
            <Text style={[{ color: colors.text }, { opacity: 0.8 }]}>
              Total Projects: {totalProjects}
            </Text>
            {numberOfPages > 0 && (
              <Text
                style={[
                  { color: colors.text },
                  { opacity: 0.6 },
                  { fontSize: 12 },
                ]}
              >
                Current Page : {pageNo}
              </Text>
            )}
          </View>
        )}
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

      {projectLoading ? (
        <ActivityIndicator style={{ marginTop: 100 }} size={"large"} />
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 180 }}
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
                <Text>Assignment Id: {d.assignmentId}</Text>
                <Text>Assignment Title: {d.assignmentTitle}</Text>
                <Text>Subject: {d.subject}</Text>
                <Text>Pay Status: {d.status}</Text>
                <Text>Payment: {d.sPayment}</Text>
              </View>
            ))}

          {numberOfPages !== 1 && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={handlePrevPage}
                disabled={pageNo === 1}
                style={{
                  opacity: pageNo === 1 ? 0.5 : 1,
                  marginRight: 20,
                }}
              >
                <Text
                  style={[
                    {
                      color: "white",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      fontSize: 16,
                      borderRadius: 6,
                    },
                    {
                      backgroundColor: colors.bottomNavActivePage,
                    },
                  ]}
                >
                  {"< Prev"}
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  {
                    marginRight: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  },
                  { color: colors.text },
                ]}
              >
                {pageNo}
              </Text>
              <TouchableOpacity
                onPress={handleNextPage}
                disabled={pageNo === numberOfPages}
                style={{
                  opacity: pageNo === numberOfPages ? 0.5 : 1,
                }}
              >
                <Text
                  style={[
                    {
                      color: "white",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      fontSize: 16,
                      borderRadius: 6,
                    },
                    {
                      backgroundColor: colors.bottomNavActivePage,
                    },
                  ]}
                >
                  {"Next >"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
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
