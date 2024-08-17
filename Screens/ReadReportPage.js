import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../AuthProvider";
import { collection, getDocs } from "firebase/firestore";

const ReadReportPage = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { db } = useContext(AuthContext);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [selectedDate]);

  const handleDateChange = (event, date) => {
    const selectedDate = date || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(selectedDate);
    setSelectedGroup(null);
    setStudents([]);
    fetchEvents();
  };

  const fetchEvents = async () => {
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
        eventsList.push({ id: doc.id, ...eventData });
      });

      setGroups(eventsList);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  const fetchReports = async (group) => {
    const dateId = `${selectedDate.getFullYear()}-${
      selectedDate.getMonth() + 1
    }-${selectedDate.getDate()}`;
    const reportsRef = collection(
      db,
      `jobReports/${dateId}/events/${group.eventName}/jobreport`
    );
    const reportsSnapshot = await getDocs(reportsRef);

    const studentList = [];
    reportsSnapshot.forEach((doc) => {
      const data = doc.data();
      studentList.push({
        id: doc.id,
        ...data,
      });
    });

    setStudents(studentList);
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    fetchReports(group);
  };

  const handleStudentPress = (student) => {
    if (selectedStudent && selectedStudent.id === student.id) {
      setSelectedStudent(null); // Deselect if the same student is clicked again
    } else {
      setSelectedStudent(student);
    }
  };

  const renderStudentRow = ({ item }) => (
    <TouchableOpacity onPress={() => handleStudentPress(item)}>
      <View style={styles.studentRowWrapper}>
        <Text style={styles.studentName}>{item.id}</Text>
        {selectedStudent && selectedStudent.id === item.id && (
          <View style={styles.reportDetails}>
            <Text style={styles.reportField}>
              <Text style={styles.fieldLabel}>שם החווה:</Text>{" "}
              {item["שם החווה שבה השתתפת"]}
            </Text>
            <Text style={styles.reportField}>
              <Text style={styles.fieldLabel}>מיקום:</Text> {item["מיקום"]}
            </Text>
            <Text style={styles.reportField}>
              <Text style={styles.fieldLabel}>זמן עבודה:</Text>{" "}
              {item["כמה זמן עבדת"]}
            </Text>
            <Text style={styles.reportField}>
              <Text style={styles.fieldLabel}>שדה נוסף 1:</Text>{" "}
              {item["שדה נוסף 1"]}
            </Text>
            <Text style={styles.reportField}>
              <Text style={styles.fieldLabel}>שדה נוסף 2:</Text>{" "}
              {item["שדה נוסף 2"]}
            </Text>
            <Text style={styles.reportField}>
              <Text style={styles.fieldLabel}>שדה נוסף 3:</Text>{" "}
              {item["שדה נוסף 3"]}
            </Text>
            <Text style={styles.reportField}>
              <Text style={styles.fieldLabel}>פסקה:</Text>{" "}
              {item["כתבו פסקה כאן"]}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderGroupRow = ({ item }) => (
    <TouchableOpacity
      style={styles.groupRow}
      onPress={() => handleGroupSelect(item)}
    >
      <Text
        style={[
          styles.groupName,
          selectedGroup &&
            selectedGroup.id === item.id &&
            styles.selectedGroupName,
        ]}
      >
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
        <Text style={styles.header}>צפה בדו"חות עבודה</Text>
      </View>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateTimeButtonText}>
            בחר תאריך: {selectedDate.toDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        {groups.length > 0 ? (
          <FlatList
            data={groups}
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
            <FlatList
              data={students}
              keyExtractor={(item) => item.id}
              renderItem={renderStudentRow}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingTop: "10%",
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
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    width: "100%",
  },
  studentName: {
    fontSize: 16,
    color: "#000",
    textAlign: "right",
    width: "100%",
  },
  reportDetails: {
    marginTop: 10,
  },
  reportField: {
    fontSize: 16,
    color: "#000",
    textAlign: "right",
  },
  fieldLabel: {
    fontWeight: "bold",
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

export default ReadReportPage;
