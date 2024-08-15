import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../AuthProvider";
import { collection, getDocs } from "firebase/firestore";

const ViewAttendancePage = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { db } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showModel1DatePicker, setShowModel1DatePicker] = useState(false);
  const [model1Date, setModel1Date] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [model1Date]);

  const fetchEvents = async () => {
    const currentMonth = model1Date.getMonth() + 1; // Adjusting month for 1-based index
    const currentYear = model1Date.getFullYear();
    const calendarId = `${currentYear}-${currentMonth}`;
    const dayId = model1Date.getDate();

    try {
      const eventsRef = collection(db, `calendar/${calendarId}/days/${dayId}/events`);
      const eventsSnapshot = await getDocs(eventsRef);
      const eventsList = [];

      eventsSnapshot.forEach((doc) => {
        const eventData = doc.data();
        eventsList.push({ id: doc.id, ...eventData });
      });

      setEvents(eventsList);
    } catch (error) {
      console.error('Error fetching events: ', error);
    }
  };

  const fetchAttendance = async (eventName, date) => {
    const dateId = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const attendanceRef = collection(db, `attendance/${dateId}/events/${eventName}/attendance`);
    const attendanceSnapshot = await getDocs(attendanceRef);

    const studentList = [];
    attendanceSnapshot.forEach((doc) => {
      const data = doc.data();
      studentList.push({
        name: data.studentName,
        present: data.isHere,
      });
    });

    setStudents(studentList);
  };

  const handleModel1DateChange = (event, selectedDate) => {
    const currentDate = selectedDate || model1Date;
    setShowModel1DatePicker(false);
    setModel1Date(currentDate);
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    fetchAttendance(group.eventName, model1Date);
  };

  const renderStudentRow = ({ item }) => (
    <View style={styles.studentRowWrapper}>
      <Text style={styles.studentName}>{item.name}</Text>
      <View
        style={[
          styles.statusCircle,
          { backgroundColor: item.present ? "green" : "red" },
        ]}
      />
    </View>
  );

  const renderGroupRow = ({ item }) => (
    <TouchableOpacity
      style={styles.groupRow}
      onPress={() => handleGroupSelect(item)}
    >
      <Text style={[styles.groupName, selectedGroup && selectedGroup.id === item.id && styles.selectedGroupName]}>
        {item.eventName}
      </Text>
    </TouchableOpacity>
  );

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
        <Text style={styles.header}>צפה בנוכחות</Text>
      </View>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setShowModel1DatePicker(true)}
        >
          <Text style={styles.dateTimeButtonText}>
            בחר תאריך: {model1Date.toDateString()}
          </Text>
        </TouchableOpacity>
        {showModel1DatePicker && (
          <DateTimePicker
            value={model1Date}
            mode="date"
            display="default"
            onChange={handleModel1DateChange}
          />
        )}
        {events.length > 0 ? (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={renderGroupRow}
            ListHeaderComponent={<Text style={styles.subTitle}>קבוצות:</Text>}
          />
        ) : (
          <Text style={styles.noGroupSelected}>אין קבוצות להצגה</Text>
        )}
        {selectedGroup && (
          <>
            <Text style={styles.groupTitle}>{selectedGroup.eventName}</Text>
            <Text style={styles.subTitle}>תלמידים:</Text>
            <ScrollView style={styles.scrollContainer}>
              {students.map((student, index) => (
                <View key={index} style={styles.studentRowWrapper}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <View
                    style={[
                      styles.statusCircle,
                      { backgroundColor: student.present ? "green" : "red" },
                    ]}
                  />
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: "#85E1D7",
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  backButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  groupTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "darkblue",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 20,
  },
  noGroupSelected: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  groupRow: {
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    alignItems: "center",
  },
  groupName: {
    fontSize: 18,
    fontWeight: "600",
  },
  selectedGroupName: {
    fontWeight: "bold",
  },
  studentRowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E8E8E8",
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
    textAlign: 'right',
  },
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  scrollContainer: {
    width: "100%",
  },
  dateTimeButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  dateTimeButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});

export default ViewAttendancePage;
