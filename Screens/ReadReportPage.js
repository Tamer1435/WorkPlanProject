import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../AuthProvider";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const ViewAttendancePage = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState("");
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const { db } = useContext(AuthContext);

  useEffect(() => {
    const fetchGroups = async () => {
      const groupsCollectionRef = collection(db, "groups");
      const groupsCollection = await getDocs(groupsCollectionRef);
      setGroups(groupsCollection.docs.map((doc) => doc.data().name));
    };

    fetchGroups();
  }, [db]);

  const fetchAttendance = async (group, date) => {
    const dateString = date.toLocaleDateString("he-IL");
    const attendanceDocRef = doc(db, `attendance/${group}/records/${dateString}`);
    const attendanceDoc = await getDoc(attendanceDocRef);

    if (attendanceDoc.exists) {
      const studentList = attendanceDoc.data().students || [];
      setStudents(studentList);
    } else {
      setStudents([]);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setSelectedDate(currentDate);
    setDatePickerVisibility(false);
  };

  const handleGroupChange = (group) => {
    setSelectedGroup(group);
    setShowGroupPicker(false);
    fetchAttendance(group, selectedDate);
  };

  const renderStudentRow = ({ item }) => (
    <View style={styles.studentRowWrapper}>
      <View style={styles.studentRow}>
        <Text style={styles.studentName}>{item.name}</Text>
        <View
          style={[
            styles.statusCircle,
            { backgroundColor: item.present ? "green" : "red" },
          ]}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.pageContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          style={{ height: 20, width: 30 }}
          source={require("../Images/back button.png")}
        />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>צפה בנוכחות</Text>
        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setDatePickerVisibility(true)}
        >
          <Text style={styles.dateTimeButtonText}>
            בחר תאריך: {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={isDatePickerVisible}
          animationType="slide"
        >
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setDatePickerVisibility(false)}
          >
            <View style={styles.modalContainer}>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            </View>
          </TouchableOpacity>
        </Modal>
        <TouchableOpacity onPress={() => setShowGroupPicker(true)}>
          <View style={styles.groupContainer}>
            <Text style={styles.title}>קבוצה</Text>
            <View style={styles.groupBackground}>
              <Text style={styles.selectedGroup}>
                {selectedGroup || "בחר קבוצה"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {selectedGroup ? (
          <>
            <Text style={styles.subTitle}>תלמידים:</Text>
            <FlatList
              data={students}
              keyExtractor={(item) => item.name}
              renderItem={renderStudentRow}
            />
          </>
        ) : (
          <Text style={styles.noGroupSelected}>אנא בחר קבוצה להצגת נוכחות</Text>
        )}
        <Modal
          visible={showGroupPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowGroupPicker(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowGroupPicker(false)}>
            <View style={styles.modalBackground}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>בחר קבוצה</Text>
                  {groups.map((group) => (
                    <TouchableOpacity
                      key={group}
                      style={styles.modalOption}
                      onPress={() => handleGroupChange(group)}
                    >
                      <Text style={styles.modalOptionText}>{group}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
    marginRight: 20,
    marginTop: 44,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  groupContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  groupBackground: {
    backgroundColor: "white",
    paddingHorizontal: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  selectedGroup: {
    fontSize: 30,
    color: "darkblue",
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
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  modalOption: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#E8E8E8",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: 18,
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
