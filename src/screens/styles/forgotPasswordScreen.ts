import { StyleSheet, Platform } from "react-native";

export const localForgotStyle = StyleSheet.create({
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
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#187afa",
  },
  input: {
    flex: 1,
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 4,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#187afa",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  validText: {
    color: "green",
  },
  invalidText: {
    color: "red",
  },
});
