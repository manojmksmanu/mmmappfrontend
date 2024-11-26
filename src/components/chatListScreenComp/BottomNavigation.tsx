import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { useAuth } from "../../context/userContext";
import { useTheme } from "@react-navigation/native";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuthStore } from "src/services/storage/authStore";
interface BottomNavigationProps {
  setShowType: any;
  handleShowUsertype: any;
  showType: string;
}
const BottomNavigation: React.FC<BottomNavigationProps> = ({
  setShowType,
  showType,
  handleShowUsertype,
}) => {
  const handleButtonPress = async (item: string) => {
    await setShowType(item);
    await handleShowUsertype(item);
  };
  const {loggedUser} = useAuthStore()
  const { colors } = useTheme();
  return (
    <View
      style={[styles.bottomNavigation, { backgroundColor: colors.secondary }]}
    >
      <TouchableOpacity
        style={[
          styles.navButton,
          showType === "Home" ? styles.activeButton : null,
        ]}
        onPress={() => handleButtonPress("Home")}
      >
        <Octicons
          name="home"
          size={24}
          color={
            showType === "Home"
              ? colors.bottomNavActivePage
              : colors.bottomNavPage
          }
        />
        <Text
          style={[
            styles.label,
            {
              color:
                showType === "Home"
                  ? colors.bottomNavActivePage
                  : colors.bottomNavPage,
            },
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.navButton,
          showType === "Admins" ? styles.activeButton : null,
        ]}
        onPress={() => handleButtonPress("Admins")}
      >
        <MaterialIcons
          name="admin-panel-settings"
          size={24}
          color={
            showType === "Admins"
              ? colors.bottomNavActivePage
              : colors.bottomNavPage
          }
        />
        <Text
          style={[
            styles.label,
            {
              color:
                showType === "Admins"
                  ? colors.bottomNavActivePage
                  : colors.bottomNavPage,
            },
          ]}
        >
          Admins
        </Text>
      </TouchableOpacity>
      {(loggedUser?.userType === "Super-Admin" ||
        loggedUser?.userType === "Admin" ||
        loggedUser?.userType === "Co-Admin") && (
        <TouchableOpacity
          style={[
            styles.navButton,
            showType === "Tutor" ? styles.activeButton : null,
          ]}
          onPress={() => handleButtonPress("Tutor")}
        >
          <FontAwesome6
            name="person-chalkboard"
            size={24}
            color={
              showType === "Tutor"
                ? colors.bottomNavActivePage
                : colors.bottomNavPage
            }
          />
          <Text
            style={[
              styles.label,
              {
                color:
                  showType === "Tutor"
                    ? colors.bottomNavActivePage
                    : colors.bottomNavPage,
              },
            ]}
          >
            Tutor
          </Text>
        </TouchableOpacity>
      )}
      {(loggedUser?.userType === "Super-Admin" ||
        loggedUser?.userType === "Admin" ||
        loggedUser?.userType === "Sub-Admin") && (
        <TouchableOpacity
          style={[
            styles.navButton,
            showType === "Student" ? styles.activeButton : null,
          ]}
          onPress={() => handleButtonPress("Student")}
        >
          <Ionicons
            name="person"
            size={24}
            color={
              showType === "Student"
                ? colors.bottomNavActivePage
                : colors.bottomNavPage
            }
          />
          <Text
            style={[
              styles.label,
              {
                color:
                  showType === "Student"
                    ? colors.bottomNavActivePage
                    : colors.bottomNavPage,
              },
            ]}
          >
            Student
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[
          styles.navButton,
          showType === "Group" ? styles.activeButton : null,
        ]}
        onPress={() => handleButtonPress("Group")}
      >
        <FontAwesome
          name="group"
          size={24}
          color={
            showType === "Group"
              ? colors.bottomNavActivePage
              : colors.bottomNavPage
          }
        />
        <Text
          style={[
            styles.label,
            {
              color:
                showType === "Group"
                  ? colors.bottomNavActivePage
                  : colors.bottomNavPage,
            },
          ]}
        >
          Group
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
  },
  navButton: {
    alignItems: "center",
  },
  activeButton: {
    // borderBottomWidth: 2,
    borderBottomColor: "#187afa",
  },
  label: {
    marginTop: 5,
    fontSize: 12,
  },
});

export default BottomNavigation;
