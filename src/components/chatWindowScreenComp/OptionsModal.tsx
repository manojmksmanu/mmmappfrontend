import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "src/context/userContext";
import { getSender } from "src/misc/misc";
import { useAuthStore } from "src/services/storage/authStore";

const OptionsModal = ({
  isVisible,
  onClose,
  onReportUser,
  onReportMessage,
  onViewGroupInfo,
  selectedMessages,
  onBlock,
  unBlock,
  blockUserLoading,
}) => {
  const { colors } = useTheme();
  const { selectedChat }: { selectedChat: any } = useAuth();
  const { loggedUser }: { loggedUser: any } = useAuthStore();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
      <View
        style={[styles.modalContainer, { backgroundColor: colors.primary }]}
      >
        <Text style={[styles.modalTitle, { color: colors.text }]}>Options</Text>

        {selectedChat?.chatType === "one-to-one" &&
          ["Sub-Admin", "Admin", "Co-Admin", "Super-Admin"].includes(
            loggedUser?.userType
          ) &&
          selectedChat?.blockedUsers[0] !==
            getSender(loggedUser, selectedChat.users)._id && (
            <TouchableOpacity style={[styles.optionButton]} onPress={onBlock}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {blockUserLoading && (
                  <ActivityIndicator
                    color={"red"}
                    style={{
                      backgroundColor: colors.primary,
                      padding: 5,
                      borderRadius: 10,
                    }}
                  />
                )}
                {!blockUserLoading ? (
                  <Text style={[styles.optionText, { color: "red" }]}>
                    Block This User
                  </Text>
                ) : (
                  <Text style={[styles.optionText, { color: "red" }]}>
                    Wait Please....
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        {["Sub-Admin", "Admin", "Co-Admin", "Super-Admin"].includes(
          loggedUser?.userType
        ) &&
          selectedChat?.blockedUsers[0] ===
            getSender(loggedUser, selectedChat.users)._id && (
            <TouchableOpacity style={[styles.optionButton]} onPress={unBlock}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {blockUserLoading && (
                  <ActivityIndicator
                    color={"red"}
                    style={{
                      backgroundColor: colors.primary,
                      padding: 5,
                      borderRadius: 10,
                    }}
                  />
                )}
                {!blockUserLoading ? (
                  <Text style={[styles.optionText, { color: "red" }]}>
                    UnBlock This User
                  </Text>
                ) : (
                  <Text style={[styles.optionText, { color: "red" }]}>
                    Wait Please....
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        {selectedChat?.chatType === "one-to-one" && (
          <TouchableOpacity
            style={[styles.optionButton]}
            onPress={onReportUser}
          >
            <Text style={styles.optionText}>Report User</Text>
          </TouchableOpacity>
        )}
        {selectedMessages.length !== 0 && (
          <TouchableOpacity
            style={styles.optionButton}
            onPress={onReportMessage}
          >
            <Text style={styles.optionText}>Report Selected Messages</Text>
          </TouchableOpacity>
        )}

        {selectedChat.chatType !== "one-to-one" && (
          <TouchableOpacity
            style={styles.optionButton}
            onPress={onViewGroupInfo}
          >
            <Text style={styles.optionText}>View Group Info</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    padding: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  cancelButton: {
    padding: 15,
    marginTop: 10,
  },
  cancelText: {
    fontSize: 16,
    color: "#ff4d4d",
    textAlign: "center",
  },
});

export default OptionsModal;
