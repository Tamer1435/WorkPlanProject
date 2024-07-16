import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../AuthProvider";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  collection,
  setDoc,
  getDoc,
  getDocs,
  doc,
  Timestamp,
  addDoc,
} from "firebase/firestore";

const SetJobsPage = ({ navigation }) => {
  const { user, userData, db } = useContext(AuthContext);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedAttendant, setSelectedAttendant] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showFarmModal, setShowFarmModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showAttendantModal, setShowAttendantModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [farms, setFarms] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [attendants, setAttendants] = useState([]);
  const [allStudents, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [meetingPlace, setMeetingPlace] = useState("");
  const [time, setTime] = useState(new Date());
  const [attendant, setAttendant] = useState("");
  const [job, setJob] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [duration, setDuration] = useState("");
  const [jobStudents, setJobStudents] = useState([]);
  const [farmOwner, setFarmOwner] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const farmsCollectionRef = collection(db, "farms");
        const farmsCollection = await getDocs(farmsCollectionRef);
        setFarms(
          farmsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        const vehiclesCollectionRef = collection(db, "vehicles");
        const vehiclesCollection = await getDocs(vehiclesCollectionRef);
        setVehicles(
          vehiclesCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

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
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const handleFarmChange = (farm) => {
    setSelectedFarm(farm.name + " - " + farm.farmType);
    setShowFarmModal(false);
    // Update job farm here based on the selected farm and job index
    setLocation(farm.location);
    setJob(farm.farmType);
    setFarmOwner(farm.name);
    setOwnerPhone(farm.phoneNumber);
  };

  const handleVehicleChange = (vehicle) => {
    setSelectedVehicle(vehicle.name);
    setShowVehicleModal(false);
    // Update job vehicle here based on the selected vehicle and job index
    setVehicle(vehicle.name);
  };

  const handleAttendantChange = (attendant) => {
    setSelectedAttendant(attendant.name);
    setShowAttendantModal(false);
    // Update job attendant here based on the selected attendant and job index
    setAttendant(attendant.name);
  };

  const handleStudentChange = (student) => {
    const updatedStudents = selectedStudents.includes(student.name)
      ? selectedStudents.filter((s) => s !== student.name)
      : [...selectedStudents, student.name];
    setSelectedStudents(updatedStudents);
    // Update job students here based on the selected students and job index
    setJobStudents(updatedStudents);
  };

  const isSelected = (student) => {
    return selectedStudents.includes(student.name);
  };

  const saveChanges = async () => {
    // Save changes to jobs here
    // Handle form submission here
    console.log("Form submitted with the following data:");
    console.log("Date:", date.getFullYear() + "-" + (date.getMonth() + 1));
    console.log("day: ", date.getDate());
    console.log("Event Name:", eventName);
    console.log("Location:", location);
    console.log("Time:", time);
    console.log("Attendant:", attendant);
    console.log("Students:", jobStudents);
    console.log("Job:", job);
    console.log("Vehicle:", vehicle);
    console.log("Meeting place:", meetingPlace);

    // const specificTime = new Date(
    //   `${date.getFullYear()}-${
    //     date.getMonth() + 1
    //   }-${date.getDate()}T${time}:00`
    // );
    const specificTime = time;
    const firestoreTime = Timestamp.fromDate(specificTime);

    const calendarID = `${date.getFullYear()}-${date.getMonth() + 1}`;

    try {
      const eventRefFirst = doc(
        db,
        "calendar",
        calendarID,
        "days",
        `${date.getDate()}`
      );
      await setDoc(eventRefFirst, { initialized: true });
      const eventRef = collection(
        db,
        "calendar",
        calendarID,
        "days",
        `${date.getDate()}`,
        "events"
      );
      await addDoc(eventRef, {
        eventName,
        location,
        meetingPlace,
        attendant,
        students: jobStudents,
        vehicle,
        timeOfMoving: firestoreTime,
        job,
        duration,
        ownerPhone,
        farmOwner,
      });
      alert("האירוע נוסף בהצלחה");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding event: ", error);
      alert("שמירת האירוע נכשלה");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
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
      <ScrollView>
        <View style={styles.jobContainer}>
          <Text style={styles.headerText}>לקבוע עבודה</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ fontSize: 18 }}>{"  ▼ "}</Text>
              <Text style={styles.label}>בחר תאריך: {date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
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
              <Text style={styles.label}>בחר רכב: {selectedVehicle}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowAttendantModal(true)}
            >
              <Text style={{ fontSize: 18 }}>{"  ▼ "}</Text>
              <Text style={styles.label}>בחר מורה: {selectedAttendant}</Text>
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
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={eventName}
              placeholder="שם העבודה"
              onChangeText={(text) => setEventName(text)}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={duration}
              inputMode="numeric"
              placeholder="משך האירוע (בשעות)"
              onChangeText={(text) => setDuration(text)}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={meetingPlace}
              placeholder="מקום התכנסות"
              onChangeText={(text) => setMeetingPlace(text)}
            />
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.saveButtonText}>הוסף עבודה</Text>
      </TouchableOpacity>

      {/* Modals for selecting farm, vehicle, attendant, and students */}
      <Modal
        visible={showFarmModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFarmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>בחר בחווה</Text>
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
        <View style={styles.modalContainer}>
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
                  <Text style={styles.modalOptionText}>{vehicle.capacity}</Text>
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
        <View style={styles.modalContainer}>
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
        <View style={styles.modalContainer}>
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
      {/* Loading popup */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>טוען...</Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = {
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

  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  jobContainer: {
    padding: 25,
    borderRadius: 5,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "700",
    padding: 30,
    textAlign: "center",
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
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 5,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  deleteButtonText: {
    color: "#fff",
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    textAlign: "right",
    backgroundColor: "#fff",
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    textAlign: "right",
    color: "blue",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    height: "80%",
    backgroundColor: "#fff",
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
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  backButtonText: {
    color: "#0000EE",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  selectedOption: {
    backgroundColor: "lightblue",
  },
};

export default SetJobsPage;
