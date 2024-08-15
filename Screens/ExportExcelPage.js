import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  TextInput,
  Platform,
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
import { Picker } from "@react-native-picker/picker";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import { da } from "date-fns/locale";

const ExportExcelPage = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { user, db } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalOutput, setModalOutput] = useState(null);
  const [showModel1DatePicker, setShowModel1DatePicker] = useState(false);
  const [model1Date, setModel1Date] = useState(new Date());
  const [model1Month, setModel1Month] = useState(new Date().getMonth() + 1);

  const months = [
    { label: "ינואר - 1", value: 1 },
    { label: "פברואר - 2", value: 2 },
    { label: "מרס - 3", value: 3 },
    { label: "אפריל - 4", value: 4 },
    { label: "מאי - 5", value: 5 },
    { label: "יוני - 6", value: 6 },
    { label: "יולי - 7", value: 7 },
    { label: "אוגוסט - 8", value: 8 },
    { label: "ספטמבר - 9", value: 9 },
    { label: "אוקטובר - 10", value: 10 },
    { label: "נובמבר - 11", value: 11 },
    { label: "דצמבר - 12", value: 12 },
  ];

  const handleModel1DateChange = (event, selectedDate) => {
    const currentDate = selectedDate || model1Date;
    setShowModel1DatePicker(false);
    setModel1Date(currentDate);
  };

  const fetchAttendance = async () => {
    setLoading(true);
    console.log("attendance" + " - " + modalType);
    if (modalType == "daily") {
      const datePath =
        model1Date.getFullYear() +
        "-" +
        (model1Date.getMonth() + 1) +
        "-" +
        model1Date.getDate();

      const dailyAttendance = collection(db, `attendance/${datePath}/events`);
      const daysQuerySnapshot = await getDocs(dailyAttendance);

      const attendanceList = [];

      for (const event of daysQuerySnapshot.docs) {
        // get all events from database
        const attendance = [];
        const eventsSubCollectionRef = collection(
          db,
          `attendance/${datePath}/events/${event.id}/attendance`
        );
        const eventsQuerySnapshot = await getDocs(eventsSubCollectionRef);

        eventsQuerySnapshot.forEach((eventDoc) => {
          attendance.push({
            group: event.id,
            ...eventDoc.data(),
          });
        });
        attendanceList.push(attendance);
      }

      const toReturn = [];

      attendanceList.map((group) => {
        group.map((student) => {
          console.log({
            "שם אירוע": student.group,
            "שם תלמידה": student.studentName,
            נוכחת: student.isHere ? "כן" : "לא",
          });
          toReturn.push({
            "שם אירוע": student.group,
            "שם תלמידה": student.studentName,
            נוכחת: student.isHere ? "כן" : "לא",
          });
        });
        toReturn.push({});
      });
      const data = toReturn.map((item) => {
        return { ...item };
      });
      await exportToExcel(data);
    } else if (modalType == "monthly") {
      const monthlyAttendance = collection(db, "attendance");
      const monthQuerySnapshot = await getDocs(monthlyAttendance);

      const datePathList = [];
      for (const datePath of monthQuerySnapshot.docs) {
        const [year, month, day] = datePath.id.split("-");

        if (month == model1Month) {
          datePathList.push(datePath.id);
        }
      }
      datePathList.sort((a, b) => {
        const dayA = parseInt(a.split("-")[2], 10);
        const dayB = parseInt(b.split("-")[2], 10);

        return dayA - dayB;
      });

      const attendanceList = [];

      for (const datePath of datePathList) {
        const dailyAttendance = collection(db, `attendance/${datePath}/events`);
        const daysQuerySnapshot = await getDocs(dailyAttendance);

        for (const event of daysQuerySnapshot.docs) {
          // get all events from database
          const attendance = [];
          const eventsSubCollectionRef = collection(
            db,
            `attendance/${datePath}/events/${event.id}/attendance`
          );
          const eventsQuerySnapshot = await getDocs(eventsSubCollectionRef);

          eventsQuerySnapshot.forEach((eventDoc) => {
            attendance.push({
              group: event.id,
              date: datePath,
              ...eventDoc.data(),
            });
          });
          attendanceList.push(attendance);
        }
      }

      const toReturn = [];

      attendanceList.map((group) => {
        group.map((student) => {
          toReturn.push({
            "שם אירוע": student.group,
            תאריך: student.date,
            "שם תלמידה": student.studentName,
            נוכחת: student.isHere ? "כן" : "לא",
          });
        });
        toReturn.push({});
      });
      const data = toReturn.map((item) => {
        return { ...item };
      });
      await exportToExcel(data);
    }
    setLoading(false);
  };

  const fetchJobs = async () => {
    setLoading(true);
    console.log("jobs" + " - " + modalType);

    if (modalType == "daily") {
      const datePath =
        model1Date.getFullYear() + "-" + (model1Date.getMonth() + 1);

      const eventList = [];

      // get all events from database for selected day
      const eventsSubCollectionRef = collection(
        db,
        `calendar/${datePath}/days/${model1Date.getDate()}/events`
      );
      const eventsQuerySnapshot = await getDocs(eventsSubCollectionRef);

      eventsQuerySnapshot.forEach((eventDoc) => {
        eventList.push({
          id: eventDoc.id,
          day: model1Date.getDate(),
          ...eventDoc.data(),
        });
      });

      eventList.sort((a, b) => {
        return a.day - b.day;
      });

      const toReturn = [];

      eventList.map((event) => {
        const timestamp = new Timestamp(
          event.timeOfMoving.seconds,
          event.timeOfMoving.nanoseconds
        );
        const eventTime = timestamp.toDate();

        toReturn.push({
          "שם אירוע": event.eventName,
          תאריך:
            event.day +
            "/" +
            (model1Date.getMonth() + 1) +
            "/" +
            model1Date.getFullYear(),
          "זמן תנועה":
            eventTime.getHours() +
            ":" +
            (eventTime.getMinutes() < 10
              ? "0" + eventTime.getMinutes()
              : eventTime.getMinutes()),
          "משך אירוע": event.duration,
          "בעל חווה": event.farmOwner,
          מכום: event.location,
          "סוג חקלאות": event.job,
          תלפון: event.ownerPhone,
          "מקום מפגש": event.meetingPlace,
          מלווה: event.attendant,
          רכב: event.vehicle,
          תלמידות: event.students.join(", "),
        });
        toReturn.push({});
      });
      const data = toReturn.map((item) => {
        return { ...item };
      });
      await exportToExcel(data);
    } else if (modalType == "monthly") {
      const datePath = new Date().getFullYear() + "-" + model1Month;

      const daysCollectionRef = collection(db, `calendar/${datePath}/days`);
      const daysQuerySnapshot = await getDocs(daysCollectionRef);

      const eventList = [];

      for (const dayDoc of daysQuerySnapshot.docs) {
        // get all events from database
        const eventsSubCollectionRef = collection(
          db,
          `calendar/${datePath}/days/${dayDoc.id}/events`
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

      const toReturn = [];

      eventList.map((event) => {
        const timestamp = new Timestamp(
          event.timeOfMoving.seconds,
          event.timeOfMoving.nanoseconds
        );
        const eventTime = timestamp.toDate();

        toReturn.push({
          "שם אירוע": event.eventName,
          תאריך: event.day + "/" + model1Month + "/" + new Date().getFullYear(),
          "זמן תנועה":
            eventTime.getHours() +
            ":" +
            (eventTime.getMinutes() < 10
              ? "0" + eventTime.getMinutes()
              : eventTime.getMinutes()),
          "משך אירוע": event.duration,
          "בעל חווה": event.farmOwner,
          מכום: event.location,
          "סוג חקלאות": event.job,
          תלפון: event.ownerPhone,
          "מקום מפגש": event.meetingPlace,
          מלווה: event.attendant,
          רכב: event.vehicle,
          תלמידות: event.students.join(", "),
        });
        toReturn.push({});
      });
      const data = toReturn.map((item) => {
        return { ...item };
      });
      await exportToExcel(data);
    }
    setLoading(false);
  };

  // Exporting the data from fetch functions...
  const exportToExcel = async (data) => {
    if (data.length === 0) {
      alert("אין נתונים בתאריך הנבחר!");
    } else {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Events");

      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const namePath = modalOutput == "attendance" ? "Attendance" : "Jobs";
      const datePath =
        modalType == "daily"
          ? model1Date.getFullYear() +
            "-" +
            (model1Date.getMonth() + 1) +
            "-" +
            model1Date.getDate()
          : model1Month + "-" + new Date().getFullYear();
      const filePath =
        FileSystem.documentDirectory + `${namePath} ${datePath}.xlsx`;

      await FileSystem.writeAsStringAsync(filePath, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share the file
      if (Platform.OS === "ios") {
        await Sharing.shareAsync(filePath);
      } else {
        const cUri = await FileSystem.getContentUriAsync(filePath);

        IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: cUri,
          flags: 1,
        });
      }
    }
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
      <View style={styles.bodyContainer}>
        <Text style={styles.title}>קבצי אקסל</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setShowModal(true);
            setModalType("daily");
            setModalOutput("attendance");
          }}
        >
          <Text style={styles.buttonText}>ייצא נוכחות יומית</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setShowModal(true);
            setModalType("monthly");
            setModalOutput("attendance");
          }}
        >
          <Text style={styles.buttonText}>ייצא נוכחות חודשית</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setShowModal(true);
            setModalType("daily");
            setModalOutput("jobs");
          }}
        >
          <Text style={styles.buttonText}>ייצא עבודות יומיות</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setShowModal(true);
            setModalType("monthly");
            setModalOutput("jobs");
          }}
        >
          <Text style={styles.buttonText}>ייצא עבודות חודשיות</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.tofade}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalOutput == "attendance" ? "ייצוא נוכחות" : "ייצוא עבודות"}
            </Text>
            {modalType === "daily" ? (
              <TouchableOpacity onPress={() => setShowModel1DatePicker(true)}>
                <Text>Select Date: {model1Date.toDateString()}</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <Text style={{ textAlign: "right" }}>בחר חודש:</Text>
                <Picker
                  selectedValue={model1Month}
                  style={{ width: 200 }}
                  onValueChange={(itemValue) => setModel1Month(itemValue)}
                >
                  {months.map((month) => (
                    <Picker.Item
                      key={month.value}
                      label={month.label}
                      value={month.value}
                    />
                  ))}
                </Picker>
              </View>
            )}
            {showModel1DatePicker && (
              <DateTimePicker
                value={model1Date}
                mode="date"
                display="default"
                onChange={handleModel1DateChange}
              />
            )}
            <View
              style={{
                flexDirection: "row",
                padding: "5%",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  modalOutput == "jobs" ? fetchJobs() : fetchAttendance()
                }
                style={styles.exportButton}
              >
                <Text style={styles.modalCloseButtonText}>יצוא אקסל</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseButtonText}>סגור</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  bodyContainer: {
    padding: 20,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "20%",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#333",
  },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
    textAlign: "right",
  },
  tofade: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
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
  insiderModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#85E1D7",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  modalCloseButtonText: {
    color: "#000",
    fontSize: 16,
    alignSelf: "flex-end",
  },
  exportButton: {
    backgroundColor: "#5DBF72",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
});

export default ExportExcelPage;
