import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "src/context/userContext";

const OptionsModal = ({
  isVisible,
  onClose,
  onReportUser,
  onReportMessage,
  onViewGroupInfo,
  selectedMessages,
  onBlock,
}) => {
  const { colors } = useTheme();
  const { selectedChat }: { selectedChat: any } = useAuth();
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

        {selectedChat?.chatType === "one-to-one" && (
          <TouchableOpacity style={[styles.optionButton]} onPress={onBlock}>
            <Text style={[styles.optionText, { color: "red" }]}>
              Block This User
            </Text>
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
