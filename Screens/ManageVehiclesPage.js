import React, { useState, useEffect, useContext } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  Modal,
} from "react-native";
import { AuthContext } from "../AuthProvider";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../firebase-config";

const ManageVehiclesPage = ({ navigation }) => {
  const [vehicles, setVehicles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCarName, setNewCarName] = useState("");
  const [newCapacity, setNewCapacity] = useState(null);
  const { user, userData, db } = useContext(AuthContext);

  useEffect(() => {
    const fetchVehicles = async () => {
      const vehiclesCollectionRef = collection(db, "vehicles");
      const vehiclesCollection = await getDocs(vehiclesCollectionRef);
      setVehicles(
        vehiclesCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchVehicles();
  }, []);

  const addVehicle = async () => {
    if (newCarName.trim() === "" || newCapacity.trim() === "") {
      Alert.alert("שגיאה", "כל השדות דרושים");
      return;
    }
    try {
      await addDoc(collection(db, "vehicles"), {
        name: newCarName,
        capacity: newCapacity,
      });
      setNewCarName("");
      setNewCapacity(null);
      fetchVehicles();
      alert("הרכב הוספה בהצלחה");
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding vehicle: ", error);
      Alert.alert("שגיאה", "לא ניתן להוסיף רכב");
    }
  };

  const handleDeleteVehicle = (vehicleId) => {
    Alert.alert(
      "אשר את המחיקה",
      "האם אתה בטוח שברצונך למחוק את הרכב הזו?",
      [
        {
          text: "לבטל",
          style: "cancel",
        },
        {
          text: "למחוק",
          onPress: () => removeVehicle(vehicleId),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const removeVehicle = async (id) => {
    try {
      await deleteDoc(doc(db, "vehicles", id));
      fetchVehicles();
      alert("הרכב נמחקה בהצלחה");
    } catch (error) {
      console.error("Error removing vehicle: ", error);
      Alert.alert("שגיאה", "לא ניתן להסיר את הרכב");
    }
  };

  const fetchVehicles = async () => {
    const vehiclesCollectionRef = collection(db, "vehicles");
    const vehiclesCollection = await getDocs(vehiclesCollectionRef);
    setVehicles(
      vehiclesCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  return (
    <View style={styles.pageContainer}>
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
        <Text style={styles.header}>ניהול רכבים</Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.vehicleItem}>
              <View
                style={{
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ alignItems: "flex-end" }}>
                  <Text>שם: {item.name}</Text>
                  <Text>מקומות: {item.capacity}</Text>
                </View>
                <TouchableOpacity
                  style={styles.buttonDelete}
                  onPress={() => handleDeleteVehicle(item.id)}
                >
                  <Text style={{ color: "#fff" }}>למחוק</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text>אין רכבים זמינות.</Text>}
        />
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text>הוסף רכב</Text>
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
              value={newCarName}
              onChangeText={setNewCarName}
              placeholderTextColor={"#767676"}
            />
            <TextInput
              style={styles.input}
              placeholder="מקומות:"
              value={newCapacity}
              onChangeText={setNewCapacity}
              placeholderTextColor={"#767676"}
              keyboardType="numeric"
            />

            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.button} onPress={addVehicle}>
                <Text>הוסף רכב</Text>
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
    </View>
  );
};
const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: "#85E1D7",
  },
  container: {
    flex: 1,
    padding: 20,
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
  vehicleItem: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
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
  buttonDelete: {
    width: "20%",
    height: 50,
    backgroundColor: "#FF2400",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    margin: 5,
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
  closeButton: {
    borderRadius: 15,
    margin: 5,
    width: "35%",
    height: 50,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "black",
    textAlign: "center",
  },
});

export default ManageVehiclesPage;
