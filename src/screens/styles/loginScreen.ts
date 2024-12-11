import { StyleSheet, Platform } from "react-native";
export const localLoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingTop: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingBottom: 40,
  },
  headContentContainer: {
    marginHorizontal: 30,
    marginBottom: 30,
  },
  loginText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
  welcomeText: {
    color: "white",
  },
  input: {
    flex: 1,
    height: 40, // Height of the input box
    fontSize: 16,
    paddingHorizontal: 10, // Padding inside the input box
    paddingVertical: 8,
    borderRadius: 8, // Rounded corners for the input
    marginLeft: 10, // Space between the icon and input field
  },
  pickerContainer: {
    flex: 1,
    ...Platform.select({
      ios: {
        height: 100, // Ensure height is constrained on iOS
        justifyContent: "center", // Center items in the container
        paddingLeft: 10,
        overflow: "hidden",
      },
      android: {
        height: 40, // Keep height the same on Android
        justifyContent: "center",
      },
    }),
  },
  picker: {
    ...Platform.select({
      ios: { textAlign: "left" },
      android: {
        paddingHorizontal: 10,
      },
    }),
  },
  button: {
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iosButton: {
    opacity: 0.9, // Adding slight opacity for iOS feedback
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  forgotText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  bottomTextContainer: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  noAccountText: {
    textAlign: "center",
    marginTop: 4,
    fontSize: 16,
  },
  signUpText: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 5,
  },
});
