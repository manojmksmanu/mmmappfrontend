import { StyleSheet, Platform } from "react-native";
export const localSignUpStyle = StyleSheet.create({
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 20,
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
  icon: {
    marginLeft: 10,
  },
  picker: {
    flex: 1,
    color: "grey",
  },
  button: {
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonBack: {
    width: "50%",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSignUp: {
    width: "50%",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  BackbuttonText: {
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
