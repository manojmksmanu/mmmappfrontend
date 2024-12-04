import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useAuthStore } from "src/services/storage/authStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useChatStore } from "src/services/storage/chatStore";

const CreateProject: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { token } = useAuthStore();
  const { colors } = useTheme();

  const handleCreateProject = () => {};

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default CreateProject;
