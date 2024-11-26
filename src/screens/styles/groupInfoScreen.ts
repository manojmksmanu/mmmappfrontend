import { StyleSheet } from "react-native";

export const groupInfoStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    gap: 20,
    marginBottom: 20,
  },
  allUserContainer: { minHeight: 200, overflow: "hidden" },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  profileText: {
    fontSize: 20,
    color: "#000",
    opacity: 0.9,
  },
  userTypeText: {
    fontSize: 12,
    color: "grey",
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  removeUser: {
    width: 22,
    height: 22,
    opacity: 0.5,
  },
  showMoreButton: {
    marginTop: 30,
    marginLeft: 30,
    marginBottom: 30,
  },
  showMoreText: {
    color: "#007bff",
    fontSize: 14,
    fontWeight: "400",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "grey",
    marginTop: 10,
    fontSize: 16,
  },
  inputContainer: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    // marginTop: 10,
    width: "100%", // Adjust width as per your layout
  },
  textInput: {
    color: "grey", // Color for the entered text
    fontSize: 16,
  },
});
