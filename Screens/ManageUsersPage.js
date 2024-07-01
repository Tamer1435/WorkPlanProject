import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { AuthContext } from "../AuthProvider";
import { Picker } from "@react-native-picker/picker";

const ManageUsersPage = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [preSignedUsers, setPreSignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const { user, userData, db, auth } = useContext(AuthContext);

  const classes = ["כיתה ט", "כיתה י", "כיתה יא"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const userCollectionRef = collection(db, "users");
    const userDocs = await getDocs(userCollectionRef);
    const usersList = userDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(usersList);

    const preUsersCollectionRef = collection(db, "preSignedUsers");
    const usersSnapshot = await getDocs(preUsersCollectionRef);
    const preUsersList = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPreSignedUsers(preUsersList);
    setLoading(false);
  };

  const handleAddUser = async () => {
    try {
      if (userRole == "student") {
        const newUser = {
          name: userName,
          email: selectedUser.email,
          role: userRole,
          class: selectedClass,
        };
        await setDoc(doc(db, "users", selectedUser.uid), newUser);
      } else {
        const newUser = {
          name: userName,
          email: selectedUser.email,
          role: userRole,
        };
        await setDoc(doc(db, "users", selectedUser.uid), newUser);
      }

      const userRef = doc(db, "preSignedUsers", selectedUser.uid);

      await updateDoc(userRef, {
        email: selectedUser.email,
        status: "Done",
        uid: selectedUser.uid,
      });

      setUserName("");
      setUserEmail("");
      setUserRole("");
      setModalVisible(false);
      fetchUsers();
      alert("משתמש נוסף בהצלחה");
    } catch (error) {
      console.error("Error adding user: ", error);
      Alert.alert("שגיאה", "משתמש לא נוסף");
    }
  };

  const handleEditUser = async () => {
    try {
      const userRef = doc(db, "users", currentUserId);
      const userDoc = await getDoc(userRef);
      const userAuth = auth.currentUser;

      if (userRole == "student") {
        const editedUser = {
          name: userName,
          email: userEmail,
          role: userRole,
          class: selectedClass,
        };
        await updateDoc(userRef, editedUser);
      } else {
        const editedUser = {
          name: userName,
          email: userEmail,
          role: userRole,
        };
        await updateDoc(userRef, editedUser);
      }

      setUserName("");
      setUserEmail("");
      setUserRole("");
      setCurrentUserId(null);
      setEditMode(false);
      setModalVisible(false);
      fetchUsers();
      alert("משתמש נערך בהצלחה");
    } catch (error) {
      console.error("Error editing user: ", error);
      Alert.alert("שגיאה", "משתמש לא נערך");
    }
  };

  const handleConfirmDeleteUser = (userId) => {
    Alert.alert("אשר את מחיקת המשתמש", "האם אתה בטוח שברצונך למחוק משתמש זה?", [
      {
        text: "לבטל",
        style: "cancel",
      },
      { text: "כן", onPress: () => handleDeleteUser(userId) },
    ]);
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Get the user document from Firestore
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // Delete the user document from Firestore
        await deleteDoc(userRef);
      }

      fetchUsers(); // Refresh the user list
      alert("משתמש נמחק בהצלחה");
    } catch (error) {
      console.error("Error deleting user: ", error);
      Alert.alert("שגיאה", "משתמש לא נמחק");
    }
  };

  const openEditModal = (user) => {
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
    setCurrentUserId(user.id);
    setSelectedClass(user.class);
    setEditMode(true);
    setModalVisible(true);
  };

  const openAddModal = () => {
    setUserName("");
    setUserRole("");
    setEditMode(false);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={{ height: 20, width: 30 }}
            source={require("../Images/back button.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.insiderContainer}>
        <Text style={styles.title}>ניהול משתמשים</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>הוסף משתמש</Text>
        </TouchableOpacity>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.userContainer}>
                <Text style={styles.userText}>
                  {item.name} - {item.role}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(item)}
                  >
                    <Text style={styles.editButtonText}>לערוך</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleConfirmDeleteUser(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>למחוק</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editMode ? "ערוך משתמש" : "הוסף משתמש"}
            </Text>
            {editMode ? (
              <View></View>
            ) : (
              <Picker
                selectedValue={selectedUser}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedUser(itemValue)
                }
                style={styles.input}
              >
                <Picker.Item label="בחר משתמש" value={null} />
                {preSignedUsers.map((user) => (
                  <Picker.Item
                    key={user.uid}
                    label={`${user.email} - ${user.status}`}
                    value={user}
                  />
                ))}
              </Picker>
            )}
            <Picker
              selectedValue={userRole}
              style={styles.input}
              onValueChange={(itemValue) => setUserRole(itemValue)}
            >
              <Picker.Item label="בחר תפקיד" value={null} />
              <Picker.Item label="מנהל" value="manager" />
              <Picker.Item label="סטודנט" value="student" />
              <Picker.Item label="מורה" value="teacher" />
            </Picker>
            {userRole == "student" ? (
              <Picker
                selectedValue={selectedClass}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedClass(itemValue)
                }
                style={styles.input}
              >
                <Picker.Item label="בחר כיתה" value={null} />
                {classes.map((item) => (
                  <Picker.Item key={item} label={`${item}`} value={item} />
                ))}
              </Picker>
            ) : (
              <View></View>
            )}
            <TextInput
              style={styles.input}
              placeholder="שם מלא"
              value={userName}
              onChangeText={setUserName}
            />
            {editMode && (
              <TextInput
                style={styles.input}
                placeholder="אימייל"
                value={userEmail}
                onChangeText={setUserEmail}
              />
            )}

            <TouchableOpacity
              style={styles.saveButton}
              onPress={editMode ? handleEditUser : handleAddUser}
            >
              <Text style={styles.saveButtonText}>
                {editMode ? "שמור שינויים" : "הוסף משתמש"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>לבטל</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: "#85E1D7",
  },
  backButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  insiderContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userText: {
    fontSize: 18,
  },
  editButton: {
    backgroundColor: "#FFC107",
    padding: 7,
    borderRadius: 5,
    right: 10,
  },
  editButtonText: {
    color: "white",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 7,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    textAlign: "right",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default ManageUsersPage;
