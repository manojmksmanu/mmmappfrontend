import { StyleSheet, Platform } from "react-native";

export const chatListStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)", // Transparent background
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: Platform.OS === "ios" ? 50 : 40, // Adjusted padding for iOS
    paddingBottom: 20,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 30,
    marginVertical: 10,
    marginHorizontal: 18,
    marginTop: Platform.OS === "ios" ? 25 : 20,
    elevation: 3,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 5,
  },
  content: {
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 8,
  },
  icon: {
    marginRight: 8,
    width: 30,
    height: 30,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 20,
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
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
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  time: {
    fontSize: 12,
    color: "#A1A1A1", // A subtle grey color for time
  },
  message: {
    fontSize: 14,
    marginBottom: 4,
    color: "#666", // Lighter grey color for message text
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
  },
  statusDot: {
    width: 20,
    height: 20,
    marginRight: 6,
    top: -15,
    left: -6,
  },
  statusDotgreen: {
    opacity: 1,
    backgroundColor: "#25D366",
    width: 10,
    height: 10,
    marginRight: 6,
    bottom: -15,
    right: -20,
    borderRadius: 100,
  },
  statusDotgrey: {
    opacity: 0.8,
    backgroundColor: "grey",
    width: 10,
    height: 10,
    marginRight: 6,
    bottom: -15,
    right: -20,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 12,
    color: "grey",
  },
  bottomNavigation: {
    height: 70,
    marginBottom: Platform.OS === "ios" ? -5 : -10, // Adjust for iOS
  },
});
