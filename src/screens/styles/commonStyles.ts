import { Platform, useColorScheme, StyleSheet } from "react-native";
export const commonStyles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row", // To align the icon and input horizontally
    alignItems: "center", // Center the contents vertically
    marginBottom: 20, // Space between inputs
    borderRadius: 15, // Rounded corners for the container
    padding: 5,
    overflow: "hidden", // Ensures that the rounded corners show properly
    paddingHorizontal: 20,
  },
});
