import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { AuthContext } from "../AuthProvider";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditJobsPage = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [farms, setFarms] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [attendants, setAttendants] = useState([]);
  const [allStudents, setStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, db } = useContext(AuthContext);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showFarmModal, setShowFarmModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showAttendantModal, setShowAttendantModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [time, setTime] = useState(new Date());
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedAttendant, setSelectedAttendant] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const currentMonth = new Date().getMonth() + 1; // Adjusting month for 1-based index
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const calendarId = `${currentYear}-${currentMonth}`;

    const daysCollectionRef = collection(db, `calendar/${calendarId}/days`);
    const daysQuerySnapshot = await getDocs(daysCollectionRef);

    const eventList = [];

    for (const dayDoc of daysQuerySnapshot.docs) {
      // get all events from database
      const eventsSubCollectionRef = collection(
        db,
        `calendar/${calendarId}/days/${dayDoc.id}/events`
      );
      const eventsQuerySnapshot = await getDocs(eventsSubCollectionRef);

      eventsQuerySnapshot.forEach((eventDoc) => {
        eventList.push({
          id: eventDoc.id,
          day: dayDoc.id,
          ...eventDoc.data(),
        });
      });
    }
    eventList.sort((a, b) => {
      return a.day - b.day;
    });
    setEvents(eventList);

    //get all farms from database
    const farmsCollectionRef = collection(db, "farms");
    const farmsCollection = await getDocs(farmsCollectionRef);
    setFarms(
      farmsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );

    //get all vehicles from data base
    const vehiclesCollectionRef = collection(db, "vehicles");
    const vehiclesCollection = await getDocs(vehiclesCollectionRef);
    setVehicles(
      vehiclesCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );

    //get all students and teacher from the database
    const userCollectionsRef = collection(db, "users");
    const usersCollection = await getDocs(userCollectionsRef);

    const students = [];
    const teachers = [];

    usersCollection.docs.forEach((doc) => {
      const userData = doc.data();
      if (userData.role === "student") {
        students.push({ ...doc.data() });
      } else if (userData.role === "teacher") {
        teachers.push({ ...doc.data() });
      }
    });
    setStudents(students);
    setAttendants(teachers);

    setLoading(false);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
    const firestoreTime = Timestamp.fromDate(currentTime);

    setCurrentEvent({ ...currentEvent, timeOfMoving: firestoreTime });
  };

  const handleFarmChange = (farm) => {
    setSelectedFarm(farm.name + " - " + farm.farmType);
    setShowFarmModal(false);
    setCurrentEvent({
      ...currentEvent,
      location: farm.location,
      job: farm.farmType,
      farmOwner: farm.name,
      ownerPhone: farm.phoneNumber,
    });
  };

  const handleVehicleChange = (vehicle) => {
    setSelectedVehicle(vehicle.name);
    setShowVehicleModal(false);
    setCurrentEvent({ ...currentEvent, vehicle: vehicle.name });
  };

  const handleAttendantChange = (attendant) => {
    setSelectedAttendant(attendant.name);
    setShowAttendantModal(false);
    setCurrentEvent({ ...currentEvent, attendant: attendant.name });
  };

  const handleStudentChange = (student) => {
    const updatedStudents = selectedStudents.includes(student.name)
      ? selectedStudents.filter((s) => s !== student.name)
      : [...selectedStudents, student.name];
    setSelectedStudents(updatedStudents);
    // Update job students here based on the selected students and job index
    setCurrentEvent({ ...currentEvent, students: updatedStudents });
  };

  const isSelected = (student) => {
    return selectedStudents.includes(student.name);
  };

  const saveChanges = () => {
    // Implement save changes logic
    setIsModalVisible(false);
  };

  const updateEvent = async () => {
    if (currentEvent) {
      const { id, day, ...eventData } = currentEvent;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const calendarId = `${currentYear}-${currentMonth + 1}`;

      try {
        const eventDocRef = doc(
          db,
          `calendar/${calendarId}/days/${day}/events/${id}`
        );
        await updateDoc(eventDocRef, eventData);
        setIsModalVisible(false);
        setCurrentEvent(null);
        fetchEvents();
      } catch (error) {
        console.error("Error updating event: ", error);
      }
    }
  };

  const removeEvent = async (id, day) => {
    Alert.alert(
      "אשר את המחיקה",
      "האם אתה בטוח שברצונך למחוק את האירוע הזו?",
      [
        {
          text: "לבטל",
          style: "cancel",
        },
        {
          text: "למחוק",
          onPress: async () => {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const calendarId = `${currentYear}-${currentMonth + 1}`;

            try {
              await deleteDoc(
                doc(db, `calendar/${calendarId}/days/${day}/events/${id}`)
              );
              fetchEvents();
              alert("האירוע נמחקה בהצלחה");
            } catch (error) {
              console.error("Error deleting event: ", error);
              Alert.alert("שגיאה", "לא ניתן להסיר את אירוע");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventContainer}>
      <View>
        <Text style={{ textAlign: "right", fontWeight: "bold" }}>
          {item.eventName}
        </Text>
        <Text style={{ textAlign: "right", fontWeight: "bold" }}>
          {item.day} / {currentMonth}
        </Text>
        <Text style={{ textAlign: "right" }}>{item.location}</Text>
        <Text style={{ textAlign: "right" }}>{item.job}</Text>
      </View>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setCurrentEvent(item);
            const timestamp = new Timestamp(
              item.timeOfMoving.seconds,
              item.timeOfMoving.nanoseconds
            );
            setTime(timestamp.toDate());
            setSelectedFarm(item.farmOwner + " - " + item.job);
            setSelectedVehicle(item.vehicle);
            setSelectedAttendant(item.attendant);
            setSelectedStudents(item.students);

            setIsModalVisible(true);
          }}
        >
          <Text style={{ color: "#fff" }}>לערוך</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonDelete}
          onPress={() => removeEvent(item.id, item.day)}
        >
          <Text style={{ color: "#fff" }}>למחוק</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={{ height: 20, width: 30 }}
            source={require("../Images/back button.png")}
          />
        </TouchableOpacity>
        <Text style={styles.header}>ניהול אירועים</Text>
      </View>
      <View style={styles.scrollSection}>
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item) => `${item.id}-${item.day}`}
        />
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.tofade}>
          <View style={styles.blur}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContainer}
            >
              {currentEvent && (
                <ScrollView>
                  <Text style={styles.header}>ערוך עבודה</Text>

                  <View style={styles.row}>
                    <TouchableOpacity
                      style={styles.selectButton}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <Text style={{ fontSize: 18 }}>{"  ▼ "}</Text>
                      <Text style={styles.label}>
                        בחר זמן תנועה: {time.getHours()}:
                        {time.getMinutes() < 10
                          ? "0" + time.getMinutes()
                          : time.getMinutes()}
                      </Text>
                    </TouchableOpacity>
                    {showTimePicker && (
                      <DateTimePicker
                        value={time}
                        mode="time"
                        display="default"
                        onChange={handleTimeChange}
                      />
                    )}
                  </View>
                  <View style={styles.row}>
                    <TouchableOpacity
                      style={styles.selectButton}
                      onPress={() => setShowFarmModal(true)}
                    >
                      <Text style={{ fontSize: 18 }}>{"  ▼ "}</Text>
                      <Text style={styles.label}>בחר חווה: {selectedFarm}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.row}>
                    <TouchableOpacity
                      style={styles.selectButton}
                      onPress={() => setShowVehicleModal(true)}
                    >
                      <Text style={{ fontSize: 18 }}>{"  ▼ "}</Text>
                      <Text style={styles.label}>
                        בחר רכב: {selectedVehicle}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.row}>
                    <TouchableOpacity
                      style={styles.selectButton}
                      onPress={() => setShowAttendantModal(true)}
                    >
                      <Text style={{ fontSize: 18 }}>{"  ▼ "}</Text>
                      <Text style={styles.label}>
                        בחר מורה: {selectedAttendant}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.row}>
                    <TouchableOpacity
                      style={styles.selectButton}
                      onPress={() => setShowStudentModal(true)}
                    >
                      <Text style={{ fontSize: 18 }}>{"  ▼ "}</Text>
                      <Text style={styles.label}>
                        בחר תלמידים: {selectedStudents.join(", ")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{ textAlign: "right" }}>שם האירוע:</Text>
                  <View style={styles.row}>
                    <TextInput
                      style={styles.input}
                      value={currentEvent.eventName}
                      placeholder="שם האירוע"
                      onChangeText={(text) =>
                        setCurrentEvent({ ...currentEvent, eventName: text })
                      }
                      placeholderTextColor={"#808080"}
                    />
                  </View>
                  <Text style={{ textAlign: "right" }}>
                    משך האירוע (בשעות):
                  </Text>
                  <View style={styles.row}>
                    <TextInput
                      style={styles.input}
                      value={currentEvent.duration}
                      inputMode="numeric"
                      placeholder="משך האירוע (בשעות)"
                      onChangeText={(text) =>
                        setCurrentEvent({ ...currentEvent, duration: text })
                      }
                      placeholderTextColor={"#808080"}
                    />
                  </View>
                  <Text style={{ textAlign: "right" }}>מקום התכנסות:</Text>
                  <View style={styles.row}>
                    <TextInput
                      style={styles.input}
                      value={currentEvent.meetingPlace}
                      placeholder="מקום התכנסות"
                      onChangeText={(text) =>
                        setCurrentEvent({ ...currentEvent, meetingPlace: text })
                      }
                      placeholderTextColor={"#808080"}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      padding: "5%",
                    }}
                  >
                    <TouchableOpacity
                      style={styles.buttonUpdate}
                      onPress={updateEvent}
                    >
                      <Text>לערוך</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonCancel}
                      onPress={() => setIsModalVisible(false)}
                    >
                      <Text>לבטל</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </KeyboardAvoidingView>
          </View>
        </View>
        {/* Modals for selecting farm, vehicle, attendant, and students */}
        <Modal
          visible={showFarmModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowFarmModal(false)}
        >
          <View style={styles.insiderModalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>בחר חווה</Text>
              <ScrollView>
                {farms.map((farm) => (
                  <TouchableOpacity
                    key={farm.name + farm.farmType}
                    style={styles.modalOption}
                    onPress={() => handleFarmChange(farm)}
                  >
                    <Text style={styles.modalOptionText}>{farm.name}</Text>
                    <Text style={styles.modalOptionText}>{farm.farmType}</Text>
                    <Text style={styles.modalOptionText}>{farm.location}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setShowFarmModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseButtonText}>סגור</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showVehicleModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowVehicleModal(false)}
        >
          <View style={styles.insiderModalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>בחר רכב</Text>
              <ScrollView>
                {vehicles.map((vehicle) => (
                  <TouchableOpacity
                    key={vehicle.id}
                    style={styles.modalOption}
                    onPress={() => handleVehicleChange(vehicle)}
                  >
                    <Text style={styles.modalOptionText}>{vehicle.name}</Text>
                    <Text style={styles.modalOptionText}>
                      {vehicle.capacity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setShowVehicleModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseButtonText}>סגור</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showAttendantModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAttendantModal(false)}
        >
          <View style={styles.insiderModalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>בחר מורה</Text>
              <ScrollView>
                {attendants.map((attendant) => (
                  <TouchableOpacity
                    key={attendant.email}
                    style={styles.modalOption}
                    onPress={() => handleAttendantChange(attendant)}
                  >
                    <Text style={styles.modalOptionText}>{attendant.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setShowAttendantModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseButtonText}>סגור</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showStudentModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowStudentModal(false)}
        >
          <View style={styles.insiderModalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>בחר סטודנטים</Text>
              <FlatList
                data={allStudents}
                keyExtractor={(item) => item.email}
                renderItem={({ item: student }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      isSelected(student) && styles.selectedOption,
                    ]}
                    onPress={() => handleStudentChange(student)}
                  >
                    <Text style={styles.modalOptionText}>
                      {student.name} - {student.class}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                onPress={() => setShowStudentModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseButtonText}>סיים</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Modal>
      {/* Loading popup */}
      <Modal
        visible={loading}
        transparent
        animationType="fade"
        style={styles.tofade}
      >
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>טוען...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#85E1D7",
  },
  headerContainer: {
    paddingTop: "10%",
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
  scrollSection: {
    flex: 1,
    padding: 20,
  },
  eventContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  tofade: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  blur: {
    width: "80%",
    backgroundColor: "#85E1D7",
    borderRadius: 15,
    borderWidth: 0.5,
  },
  modalContainer: {
    padding: 20,
    borderRadius: 10,
    alignContent: "center",
  },
  insiderModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    height: "80%",
    backgroundColor: "#85E1D7",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalCloseButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    alignSelf: "flex-end",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "center",
    bottom: 30,
    width: "80%",
    marginTop: 5,
  },
  closeButton: {
    backgroundColor: "rgb(255,0,0)",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "center",
    bottom: 30,
    width: "80%",
    marginTop: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  backButtonText: {
    color: "#0000EE",
    fontSize: 16,
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "95%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    textAlign: "right",
  },
  button: {
    height: 60,
    width: 100,
    backgroundColor: "rgba(66, 133, 244, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: 10,
    margin: 5,
  },
  selectButton: {
    borderRadius: 5,
    borderBottomWidth: 1,
    borderColor: "#999",
    width: "75%",
    padding: 5,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  buttonUpdate: {
    height: 60,
    width: 100,
    backgroundColor: "#5DBF72",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: 10,
    margin: 5,
  },
  buttonCancel: {
    height: 60,
    width: 100,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: 10,
    margin: 5,
  },
  buttonDelete: {
    height: 60,
    width: 100,
    backgroundColor: "#FF2400",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: "blue",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5C4DFF",
    shadowRadius: 20,
    shadowOpacity: 0.25,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  loadingContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
  },
});

export default EditJobsPage;
