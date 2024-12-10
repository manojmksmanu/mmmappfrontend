import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

const CustomAlert = ({ visible, title, message, onClose }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            width: 300,
            padding: 20,
            backgroundColor: "white",
            borderRadius: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>{title}</Text>
          <Text>{message}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ marginTop: 20, color: "blue" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
