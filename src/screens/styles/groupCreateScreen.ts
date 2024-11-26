import { StyleSheet } from "react-native";

export const groupCreateStyle = StyleSheet.create({
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 30,
    marginVertical: 10,
    margin: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 8,
    paddingVertical: 15,
    marginLeft: 10,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileText: {
    fontSize: 20,
    color: "#333",
  },
  userTypeText: {
    fontSize: 12,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingVertical: 15,
    justifyContent: "center",
    borderRadius: 20,
    margin: 20,
  },
  inputGroup: {
    fontSize: 18,
    paddingHorizontal: 10,
  },
});
