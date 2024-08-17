import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

import { AuthContext } from "../AuthProvider";

const SetContactsPage = ({ navigation }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactsList, setContactsList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { user, userData, db } = useContext(AuthContext);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const contactsCollectionRef = collection(db, "contacts");
      const contactsCollection = await getDocs(contactsCollectionRef);
      setContactsList(
        contactsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addContact = async () => {
    if (name.trim() === "" || role.trim() === "" || phoneNumber.trim() === "") {
      Alert.alert("שגיאה", "כל השדות דרושים");
      return;
    }
    try {
      await addDoc(collection(db, "contacts"), {
        name: name,
        role: role,
        phoneNumber: phoneNumber,
      });
      setName("");
      setRole("");
      setPhoneNumber("");
      fetchContacts();
      alert("נוסף בהצלחה");
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding contact: ", error);
      Alert.alert("שגיאה", "לא ניתן להוסיף אנשי קשר");
    }
  };

  const removeContact = async (item) => {
    try {
      await deleteDoc(doc(db, "contacts", item));
      fetchContacts();
      alert("האנשי קשר נמחקה בהצלחה");
    } catch (error) {
      console.error("Error removing contact: ", error);
      Alert.alert("שגיאה", "לא ניתן להסיר את האנשי קשר");
    }
  };
  const assureRemoval = (item) => {
    Alert.alert(
      "אשר את המחיקה",
      "האם אתה בטוח שברצונך למחוק את אנשי קשר הזו?",
      [
        {
          text: "לבטל",
          style: "cancel",
        },
        {
          text: "למחוק",
          onPress: () => removeContact(item),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
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
        <Text style={styles.header}>לנהל אנשי קשר</Text>
      </View>
      <View style={styles.bodyContainer}>
        {loading ? (
          <Text>נטען...</Text>
        ) : (
          <FlatList
            data={contactsList}
            keyExtractor={(item) => item.phoneNumber}
            renderItem={({ item }) => (
              <View style={styles.contactItem}>
                <View>
                  <Text style={styles.nameTitle}>שם: {item.name}</Text>
                  <Text style={styles.info}>תפקיד: {item.role}</Text>
                  <Text style={styles.info}>
                    מספר טלפון: {item.phoneNumber}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => assureRemoval(item.id)}
                  style={styles.buttonDelete}
                >
                  <Text>למחוק</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text>אין אנשי קשר זמינות.</Text>}
          />
        )}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text>הוסף אישי קשר</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="שם:"
              value={name}
              onChangeText={setName}
              placeholderTextColor={"#767676"}
            />

            <TextInput
              style={styles.input}
              placeholder="תפקיד:"
              value={role}
              onChangeText={setRole}
              placeholderTextColor={"#767676"}
            />
            <TextInput
              style={styles.input}
              placeholder="טלפון:"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholderTextColor={"#767676"}
              keyboardType="phone-pad"
            />
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.button} onPress={addContact}>
                <Text>הוסף אישי קשר</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>סגור</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "10%",
    backgroundColor: "#85E1D7",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  bodyContainer: {
    flex: 1,
    padding: 20,
  },
  contactItem: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  nameTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "right",
  },
  info: {
    fontSize: 15,
    textAlign: "right",
  },
  buttonDelete: {
    width: "20%",
    height: 50,
    backgroundColor: "#FF2400",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    margin: 5,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  button: {
    width: "35%",
    height: 50,
    backgroundColor: "#5DBF72",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    margin: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#85E1D7",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    margin: 10,
    textAlign: "right",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  closeButton: {
    borderRadius: 15,
    margin: 5,
    width: "35%",
    height: 50,
    backgroundColor: "#FF2400",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
});
export default SetContactsPage;
