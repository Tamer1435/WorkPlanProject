import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { AuthContext } from "../AuthProvider";
import { format } from "date-fns";
import { collection, setDoc, getDoc, doc, Timestamp } from "firebase/firestore";

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getDayName = (date) => {
  const options = { weekday: "long" };
  return new Intl.DateTimeFormat("he-IL", options).format(date);
};

const SetJobsPage = ({ navigation }) => {
  const [date, setDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [meetingPlace, setMeetingPlace] = useState("");
  const [time, setTime] = useState("");
  const [attendant, setAttendant] = useState("");
  const [students, setStudents] = useState("");
  const [job, setJob] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const { user, userData, calendar, db, refreshData, loading } =
    useContext(AuthContext);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsManager(userData.role === "manager");
        }
      }
    };

    checkUserRole();
  }, [user]);

  const currentDate = new Date();
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const monthName = currentDate.toLocaleString("he-IL", {
    month: "long",
    timeZone: "UTC",
  });
  const currentYear = new Date().getFullYear();
  const preDaysInMonth = getDaysInMonth(currentMonth, currentYear);
  const daysInMonth = Array.from(
    { length: preDaysInMonth - currentDay + 1 },
    (_, i) => currentDay + i
  );
  const daysStartingFromCurrent = [
    ...daysInMonth.slice(0, currentDay - 1),
    ...daysInMonth.slice(currentDay - 1),
  ].map((day) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayName = getDayName(date);
    return {
      label: day + "/" + (currentMonth + 1) + " , " + dayName,
      value: day,
    };
  });

  const handleSubmit = async () => {
    if (!user || !isManager) {
      Alert.alert("Error", "You do not have permission to add events.");
      return;
    }
    // Handle form submission here
    console.log("Form submitted with the following data:");
    console.log("Date:", date);
    console.log("Event Name:", eventName);
    console.log("Location:", location);
    console.log("Time:", time);
    console.log("Attendant:", attendant);
    console.log("Students:", students);
    console.log("Job:", job);
    console.log("Vehicle:", vehicle);

    const events = calendar;
    const eventsForTheDay = [];
    events.map((event) => {
      if (event.day == date) {
        index = events.indexOf(event);
        eventsForTheDay.push(events[index]);
      }
    });

    const i = eventsForTheDay.length + 1;

    const specificTime = new Date(
      `${currentYear}-${currentMonth + 1}-${date}T${time}:00`
    );
    const firestoreTime = Timestamp.fromDate(specificTime);

    const studentsArray = students.split(",").map((s) => s.trim());
    try {
      const eventRefFirst = doc(
        db,
        "calendar",
        `${currentYear}-${currentMonth + 1}`,
        "days",
        `${date}`
      );
      await setDoc(eventRefFirst, { initialized: true });
      const eventRef = doc(
        db,
        "calendar",
        `${currentYear}-${currentMonth + 1}`,
        "days",
        `${date}`,
        "events",
        `event ${i}`
      );
      await setDoc(eventRef, {
        eventName,
        location,
        meetingPlace,
        attendant,
        students: studentsArray,
        vehicle,
        timeOfMoving: firestoreTime,
        job,
      });
      alert("Successfully added the event");
      await refreshData();
    } catch (error) {
      console.error("Error adding event: ", error);
      alert("Failed to save event");
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
        <View style={styles.containerInput}>
          <Text style={styles.headerText}>לקבוע עבודה</Text>
          <Dropdown
            style={styles.input}
            placeholderStyle={styles.Drop}
            itemTextStyle={styles.DropList}
            inputSearchStyle={styles.Drop}
            data={daysStartingFromCurrent}
            labelField={"label"}
            valueField={"value"}
            placeholder={!isFocus ? "לבחור יום" : "..."}
            search
            searchPlaceholder="לחפש..."
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            value={date}
            onChange={(item) => {
              setDate(item.value);
              setIsFocus(false);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="שם אירוע:"
            value={eventName}
            onChangeText={setEventName}
          />
          <TextInput
            style={styles.input}
            placeholder="מקום:"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="מקום התכנסות:"
            value={meetingPlace}
            onChangeText={setMeetingPlace}
          />
          <TextInput
            style={styles.input}
            placeholder="זמן תנועה:"
            value={time}
            onChangeText={setTime}
          />
          <TextInput
            style={styles.input}
            placeholder="מורה:"
            value={attendant}
            onChangeText={setAttendant}
          />
          <TextInput
            style={styles.input}
            placeholder="סטודנטים:"
            value={students}
            onChangeText={setStudents}
          />
          <TextInput
            style={styles.input}
            placeholder="עבודה:"
            value={job}
            onChangeText={setJob}
          />
          <TextInput
            style={styles.input}
            placeholder="רכב:"
            value={vehicle}
            onChangeText={setVehicle}
          />
          <TouchableOpacity
            style={styles.button}
            disabled={loading}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>בוצע אירוע</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Loading popup */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>טוען...</Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: "#85E1D7",
  },
  containerInput: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  input: {
    height: 50,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    textAlign: "right",
  },
  Drop: {
    textAlign: "right",
    justifyContent: "flex-end",
  },
  DropList: {
    textAlign: "right",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "700",
    padding: 30,
  },
  button: {
    backgroundColor: "#5DBF72",
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    width: "40%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
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
});

export default SetJobsPage;
