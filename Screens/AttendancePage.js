import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../AuthProvider";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

const AttendancePage = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [attendance, setAttendance] = useState({});
  const [savedAttendance, setSavedAttendance] = useState({});
  const [isBeforeMidnight, setIsBeforeMidnight] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const { userData, db } = useContext(AuthContext);

  const hebrewDays = [
    "יום ראשון",
    "יום שני",
    "יום שלישי",
    "יום רביעי",
    "יום חמישי",
    "יום שישי",
    "שבת",
  ];
  const currentDay = new Date().getDay();

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      setIsBeforeMidnight(now.getHours() < 24);
    };

    checkTime();
    const intervalId = setInterval(checkTime, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedDate]);

  const fetchEvents = async () => {
    if (!userData || userData.role !== "teacher") return;
    setLoading(true);

    const currentMonth = selectedDate.getMonth() + 1; // Adjusting month for 1-based index
    const currentYear = selectedDate.getFullYear();
    const calendarId = `${currentYear}-${currentMonth}`;
    const dayId = selectedDate.getDate();

    try {
      const eventsRef = collection(
        db,
        `calendar/${calendarId}/days/${dayId}/events`
      );
      const eventsSnapshot = await getDocs(eventsRef);
      const eventsList = [];

      eventsSnapshot.forEach((doc) => {
        const eventData = doc.data();
        if (eventData.attendant === userData.name) {
          eventsList.push({ id: doc.id, ...eventData });
        }
      });

      setEvents(eventsList);
      if (eventsList.length > 0) {
        setSelectedClass(eventsList[0].eventName);
        fetchSavedAttendance(eventsList[0].eventName);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events: ", error);
      setLoading(false);
    }
  };

  const fetchSavedAttendance = async (eventName) => {
    const date = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    const dateId = `${year}-${month}-${date}`;

    try {
      const attendanceRef = collection(
        db,
        `attendance/${dateId}/events/${eventName}/attendance`
      );
      const attendanceSnapshot = await getDocs(attendanceRef);

      const fetchedData = {};
      attendanceSnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedData[doc.id] = data;
      });

      setSavedAttendance(fetchedData);
      console.log("Fetched saved attendance:", fetchedData); // Debugging log
      setAttendance((prev) => {
        const updated = { ...prev };
        Object.keys(fetchedData).forEach((student) => {
          if (!updated[student]) {
            updated[student] = fetchedData[student].isHere ? "נוכח" : "לא נוכח";
          }
        });
        return updated;
      });
    } catch (error) {
      console.error("Error fetching saved attendance:", error);
      Alert.alert("שגיאה", "לא ניתן לטעון את הנוכחות שנשמרה");
    }
  };

  const handleAttendanceChange = (student, status) => {
    setAttendance((prev) => ({
      ...prev,
      [student]: status,
    }));
  };

  const getStatusStyle = (student, status) => {
    if (
      savedAttendance[student] &&
      savedAttendance[student].hasOwnProperty("isHere")
    ) {
      if (savedAttendance[student].isHere && status === "נוכח") {
        return styles.savedPresent;
      } else if (!savedAttendance[student].isHere && status === "לא נוכח") {
        return styles.savedAbsent;
      }
    }
    if (attendance[student] === status) {
      return status === "נוכח" ? styles.present : styles.absent;
    }
    return styles.neutral;
  };

  const saveAttendance = async () => {
    if (!isBeforeMidnight) return;

    try {
      const date = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const dateId = `${year}-${month}-${date}`;
      const attendanceRef = doc(
        db,
        `attendance/${dateId}/events/${selectedClass}`
      );

      const attendanceData = {};
      Object.keys(attendance).forEach((student) => {
        attendanceData[student] = {
          studentName: student,
          isHere: attendance[student] === "נוכח",
        };
      });

      if (userData && userData.role === "teacher") {
        await setDoc(attendanceRef, { eventName: selectedClass });

        for (const student in attendanceData) {
          const studentRef = doc(
            db,
            `attendance/${dateId}/events/${selectedClass}/attendance/${student}`
          );
          await setDoc(studentRef, attendanceData[student]);
        }

        Alert.alert("הצלחה", "הנוכחות נשמרה בהצלחה.");
        // Refresh saved attendance after saving
        fetchSavedAttendance(selectedClass);
        // Reset local attendance state to reflect saved state
        setAttendance({});
      } else {
        throw new Error("Unauthorized");
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      Alert.alert("שגיאה", "הנוכחות לא נשמרה.");
    }
  };

  const renderStudentRow = ({ item }) => (
    <View style={styles.studentRowWrapper}>
      <View style={styles.studentRow}>
        <Text style={styles.studentName}>{item}</Text>
        <TouchableOpacity
          style={getStatusStyle(item, "נוכח")}
          onPress={() => handleAttendanceChange(item, "נוכח")}
        >
          <Text style={styles.buttonText}>נוכח</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getStatusStyle(item, "לא נוכח")}
          onPress={() => handleAttendanceChange(item, "לא נוכח")}
        >
          <Text style={styles.buttonText}>לא נוכח</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEventStudents = () => {
    if (events.length === 0) {
      return <Text style={styles.noEventsText}>אין אירועים להיום</Text>;
    }

    const students = events.flatMap((event) => event.students);
    return (
      <FlatList
        data={students}
        keyExtractor={(item) => item}
        renderItem={renderStudentRow}
      />
    );
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
      <View style={styles.header}>
        <Text style={styles.currentDay}>{hebrewDays[currentDay]}</Text>
        <View style={styles.classContainer}>
          <Text style={styles.title}>קבוצה</Text>
          <View style={styles.groupBackground}>
            <Text style={styles.selectedClass}>{selectedClass}</Text>
          </View>
        </View>
      </View>
      <View style={{ padding: 20 }}>
        <Text style={styles.subTitle}>התלמידים:</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          renderEventStudents()
        )}
        <TouchableOpacity
          style={[
            styles.saveButton,
            !isBeforeMidnight && styles.disabledButton,
          ]}
          onPress={saveAttendance}
          disabled={!isBeforeMidnight}
        >
          <Text style={styles.saveButtonText}>שמור</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#85E1D7",
    paddingTop: "10%",
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  currentDay: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    textAlign: "center",
  },
  classContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  groupBackground: {
    backgroundColor: "white",
    paddingHorizontal: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  selectedClass: {
    fontSize: 30,
    color: "darkblue",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 20,
  },
  studentRowWrapper: {
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
  },
  studentRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  studentName: {
    flex: 2,
    fontSize: 16,
    color: "#000",
    textAlign: "right",
  },
  neutral: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    borderRadius: 10,
  },
  present: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    borderRadius: 10,
  },
  savedPresent: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#A5D6A7", // Faded green
    alignItems: "center",
    borderRadius: 10,
  },
  absent: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#F44336",
    alignItems: "center",
    borderRadius: 10,
  },
  savedAbsent: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#EF9A9A", // Faded red
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AttendancePage;
