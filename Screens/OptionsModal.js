import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Button,
} from "react-native";
import Modal from "react-native-modal";

const OptionsModal = ({ visible, onClose, onLogout }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      style={{
        height: "100%",
        width: "100%",
        justifyContent: "flex-end",
        alignSelf: "center",
      }}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={onClose} style={styles.title}>
          <Text style={styles.closeButtonText}>מושב וצור קשר</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.title}>
          <Text style={styles.closeButtonText}>החלף סיסמה</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onLogout} style={styles.title}>
          <Text style={styles.closeButtonText}>יציאה מהמערכת</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>סגור</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#85E1D7",
    opacity: 0.95,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    padding: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  closeButtonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default OptionsModal;
