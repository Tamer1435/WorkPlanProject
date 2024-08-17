import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../AuthProvider";
import { collection, getDocs } from "firebase/firestore";

const ViewTeacherReport = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [reports, setReports] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { db } = useContext(AuthContext);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [selectedDate]);

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

  const fetchReports = async (group, date) => {
    const dateId = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    const reportsRef = collection(
      db,
      `teacherReports/${dateId}/events/${group.eventName}/reports`
    );
    try {
      const reportsSnapshot = await getDocs(reportsRef);

      const reportList = [];
      reportsSnapshot.forEach((doc) => {
        const data = doc.data();
        reportList.push({
          id: doc.id,
          ...data,
        });
      });

      setReports(reportList);
    } catch (error) {
      console.error("Error fetching reports: ", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
    setSelectedGroup(null);
    setReports([]);
    fetchEvents();
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    fetchReports(group, selectedDate);
  };

  const handleReportPress = (report) => {
    if (selectedReport && selectedReport.id === report.id) {
      setSelectedReport(null); // Deselect if the same report is clicked again
    } else {
      setSelectedReport(report);
    }
  };

  const renderReportRow = ({ item }) => (
    <TouchableOpacity onPress={() => handleReportPress(item)}>
      <View style={styles.reportRowWrapper}>
        <Text style={styles.reportName}>{item.id}</Text>
        {selectedReport && selectedReport.id === item.id && (
          <View style={styles.reportDetails}>
            <Text style={styles.reportField}>
              <Text style={styles.fieldLabel}>מורה:</Text> {item.id}
            </Text>
            <Text style={styles.reportField}>
              <Text style={styles.fieldLabel}>שעת התחלה:</Text>{" "}
              {new Date(item["שעת התחלה"].seconds * 1000).toLocaleTimeString()}
            </Text>
            <Text style={styles.reportField}>
              <Text style={styles.fieldLabel}>שעת סיום:</Text>{" "}
              {new Date(item["שעת סיום"].seconds * 1000).toLocaleTimeString()}
            </Text>
            <Text style={styles.reportField}>
              <Text style={styles.fieldLabel}>שם החווה:</Text>{" "}
              {item["שם החווה"]}
            </Text>
            <Text style={styles.reportField}>
              <Text style={styles.fieldLabel}>הערות:</Text> {item["הערות"]}
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
        <Text style={styles.header}>צפה בדו"חות המורים</Text>
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
            <Text style={styles.subTitle}>דו"חות מורים:</Text>
            <FlatList
              data={reports}
              keyExtractor={(item) => item.id}
              renderItem={renderReportRow}
            />
          </>
        )}
      </View>

      {/* Loading Modal */}
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
  reportRowWrapper: {
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
  reportName: {
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
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
    backgroundColor: "rgba(0,0,0,0.7)",
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
});

export default ViewTeacherReport;
