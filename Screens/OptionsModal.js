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
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    // Handle password change logic here
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    user
      .reauthenticateWithCredential(credential)
      .then(() => {
        user
          .updatePassword(newPassword)
          .then(() => {
            alert("Password changed successfully!");
            setShowPasswordChangeModal(false);
          })
          .catch((error) => {
            alert("Error updating password: " + error.message);
          });
      })
      .catch((error) => {
        alert("Error reauthenticating: " + error.message);
      });
  };

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
        <TouchableOpacity
          onPress={() => setShowContactModal(true)}
          style={styles.title}
        >
          <Text style={styles.closeButtonText}>צור קשר</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowPasswordChangeModal(true)}
          style={styles.title}
        >
          <Text style={styles.closeButtonText}>החלף סיסמה</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onLogout} style={styles.title}>
          <Text style={styles.closeButtonText}>יציאה מהמערכת</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>סגור</Text>
        </TouchableOpacity>
      </View>

      {/*change password popup */}
      <Modal
        visible={showPasswordChangeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPasswordChangeModal(false)}
      >
        <View style={styles.passContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>שנה סיסמה</Text>

            <TextInput
              style={styles.input}
              placeholder="סיסמה ישנה"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={true}
              placeholderTextColor={"#ccc"}
            />

            <TextInput
              style={styles.input}
              placeholder="סיסמה חדשה"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
              placeholderTextColor={"#ccc"}
            />

            <TextInput
              style={styles.input}
              placeholder="תאשר סיסמה חדשה"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              placeholderTextColor={"#ccc"}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleChangePassword}
            >
              <Text style={styles.saveButtonText}>לשמור</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowPasswordChangeModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* to get in contact popup */}
      <Modal
        visible={showContactModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.passContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>צור קשר</Text>
            <TouchableOpacity>
              <Text>התקשר להנהלה: 050-0000000</Text>
            </TouchableOpacity>
            <Text>{"\n"}</Text>

            <TouchableOpacity
              onPress={() => setShowContactModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  passContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#58908a",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 5,
    marginVertical: 5,
    textAlign: "right",
  },
  saveButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: "#000",
    fontSize: 16,
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
