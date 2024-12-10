import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

const ReasonModal = ({ isVisible, onClose, reasons, onSelectReason }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a Reason</Text>

          <FlatList
            data={reasons}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.reasonButton}
                onPress={() => onSelectReason(item)}
              >
                <Text style={styles.reasonText}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  reasonButton: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  reasonText: {
    fontSize: 16,
    color: "#333",
  },
  cancelButton: {
    padding: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: "#ff4d4d",
  },
});

export default ReasonModal;
