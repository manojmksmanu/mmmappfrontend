import { StyleSheet } from "react-native";

export const chatWindowStyle = StyleSheet.create({
  header: {
    paddingTop: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingBottom: 20,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
  },

  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  usernameText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 70,
    marginRight: 10,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  container: {
    flex: 1,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
  },
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  emojiSelector: {
    height: 350,
  },
  inputMainContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    paddingTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  inputContainer: {
    width: "100%",
    position: "relative",
    flex: 1,
    borderRadius: 35,
    textDecorationLine: "none",
  },
  input: {
    color: "grey",
    paddingLeft: 20,
    textDecorationLine: "none",
    paddingRight: 60,
    fontSize: 16,
    borderWidth: 0,
    borderColor: "#363737",
    borderRadius: 35,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginRight: 12,
    minHeight: 40,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: "#187afa",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
    marginBottom: 10,
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  replyingMessage: {
    backgroundColor: "#E7FFE7",
    borderRadius: 20,
    padding: 20,
    margin: 10,
    position: "relative",
  },
  closeReplyingMessage: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#555",
  },
  forwardIcon: {
    width: 30,
    height: 30,
    opacity: 0.6,
  },
  textContainer: {
    flexDirection: "column",
  },
  statusText: {
    fontSize: 14,
    color: "grey",
  },
  profileCircle: {
    width: 35,
    height: 35,
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
    bottom: -10,
    right: -18,
    borderRadius: 100,
  },
  statusDotgrey: {
    opacity: 0.5,
    backgroundColor: "grey",
    width: 10,
    height: 10,
    marginRight: 6,
    bottom: -15,
    right: -20,
    borderRadius: 100,
  },
  sendingIndicator: {
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    padding: 10,
    marginBottom: 2,
  },
});