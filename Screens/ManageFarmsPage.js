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

const ManageFarmsPage = ({ navigation }) => {
  const [farms, setFarms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFarmName, setNewFarmName] = useState("");
  const [newFarmType, setNewFarmType] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const { user, userData, db } = useContext(AuthContext);

  useEffect(() => {
    const fetchFarms = async () => {
      const farmsCollectionRef = collection(db, "farms");
      const farmsCollection = await getDocs(farmsCollectionRef);
      setFarms(
        farmsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchFarms();
  }, []);

  const addFarm = async () => {
    if (
      newFarmName.trim() === "" ||
      newFarmType.trim() === "" ||
      newLocation.trim() === "" ||
      newPhoneNumber.trim() === ""
    ) {
      Alert.alert("שגיאה", "כל השדות דרושים");
      return;
    }
    try {
      await addDoc(collection(db, "farms"), {
        name: newFarmName,
        farmType: newFarmType,
        location: newLocation,
        phoneNumber: newPhoneNumber,
      });
      setNewFarmName("");
      setNewFarmType("");
      setNewLocation("");
      setNewPhoneNumber("");
      fetchFarms();
      alert("החווה נוספה בהצלחה");
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding farm: ", error);
      Alert.alert("שגיאה", "לא ניתן להוסיף חווה");
    }
  };

  const handleDeleteFarm = (farmId) => {
    Alert.alert(
      "אשר את המחיקה",
      "האם אתה בטוח שברצונך למחוק את החווה הזו?",
      [
        {
          text: "לבטל",
          style: "cancel",
        },
        {
          text: "למחוק",
          onPress: () => removeFarm(farmId),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const removeFarm = async (id) => {
    try {
      await deleteDoc(doc(db, "farms", id));
      fetchFarms();
      alert("החווה נמחקה בהצלחה");
    } catch (error) {
      console.error("Error removing farm: ", error);
      Alert.alert("שגיאה", "לא ניתן להסיר את החווה");
    }
  };

  const fetchFarms = async () => {
    const farmsCollectionRef = collection(db, "farms");
    const farmsCollection = await getDocs(farmsCollectionRef);
    setFarms(
      farmsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
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
        <Text style={styles.header}>ניהול חוות</Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={farms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.farmItem}>
              <View
                style={{
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ alignItems: "flex-end" }}>
                  <Text>שם: {item.name}</Text>
                  <Text>סוג חקלאות: {item.farmType}</Text>
                  <Text>מקום: {item.location}</Text>
                  <Text>טלפון: {item.phoneNumber}</Text>
                </View>
                <TouchableOpacity
                  style={styles.buttonDelete}
                  onPress={() => handleDeleteFarm(item.id)}
                >
                  <Text style={{ color: "#fff" }}>למחוק</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text>אין חוות זמינות.</Text>}
        />
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text>הוסף חווה</Text>
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
              value={newFarmName}
              onChangeText={setNewFarmName}
              placeholderTextColor={"#767676"}
            />
            <TextInput
              style={styles.input}
              placeholder="סוג חקלאות:"
              value={newFarmType}
              onChangeText={setNewFarmType}
              placeholderTextColor={"#767676"}
            />
            <TextInput
              style={styles.input}
              placeholder="מקום:"
              value={newLocation}
              onChangeText={setNewLocation}
              placeholderTextColor={"#767676"}
            />
            <TextInput
              style={styles.input}
              placeholder="טלפון:"
              value={newPhoneNumber}
              onChangeText={setNewPhoneNumber}
              placeholderTextColor={"#767676"}
            />
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.button} onPress={addFarm}>
                <Text>הוסף חווה</Text>
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
  farmItem: {
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
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "black",
    textAlign: "center",
  },
});

export default ManageFarmsPage;
