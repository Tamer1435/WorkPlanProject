import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DayDetails = ({ navigation }) => {
  const day = new Date().getDate();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const dayName = new Intl.DateTimeFormat("he-IL", { weekday: "long" }).format(
    new Date(year, month, day)
  );
  console.log(`${day} - ${month + 1} - ${year} - ${dayName}`);
  const [groups, setGroups] = useState([]);
  const [classSelectionModalVisible, setClassSelectionModalVisible] =
    useState(false);
  const [teacherModalVisible, setTeacherModalVisible] = useState(false);
  const [studentModalVisible, setStudentModalVisible] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);
  const [place, setPlace] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const allStudents = {
    "6th": ["Student 1", "Student 2", "Student 3"],
    "7th": ["Student 4", "Student 5", "Student 6"],
    "8th": ["Student 7", "Student 8", "Student 9"],
    "9th": ["Student 10", "Student 11", "Student 12"],
    "10th": ["Student 13", "Student 14", "Student 15"],
    "11th": ["Student 16", "Student 17", "Student 18"],
    "12th": ["Student 19", "Student 20", "Student 21"],
  };

  const availableTeachers = ["מורה 1", "מורה 2", "מורה 3"]; // This should be dynamically filtered based on availability

  const addGroupToDay = () => {
    setGroups([
      ...groups,
      {
        classes: [],
        students: [],
        title: `קבוצה ${groups.length + 1}`,
        place: "",
        time: "",
        teacher: "",
      },
    ]);
    setSelectedGroupIndex(groups.length);
  };

  const editGroup = (index) => {
    const group = groups[index];
    setPlace(group.place);
    setStartTime(new Date(`1970-01-01T${group.time.split(" - ")[0]}:00Z`));
    setEndTime(new Date(`1970-01-01T${group.time.split(" - ")[1]}:00Z`));
    setSelectedTeacher(group.teacher);
    setSelectedGroupIndex(index);
  };

  const deleteGroup = (index) => {
    const updatedGroups = groups.filter((_, i) => i !== index);
    setGroups(updatedGroups);
  };

  const toggleClassSelection = (className) => {
    let updatedClasses = [...selectedClasses];
    if (updatedClasses.includes(className)) {
      updatedClasses = updatedClasses.filter((c) => c !== className);
    } else if (updatedClasses.length < 3) {
      updatedClasses.push(className);
    }
    setSelectedClasses(updatedClasses);
  };

  const finalizeClassSelection = () => {
    const updatedGroups = [...groups];
    updatedGroups[selectedGroupIndex].classes = selectedClasses;
    setGroups(updatedGroups);
    setSelectedClasses([]);
    setClassSelectionModalVisible(false);
  };

  const selectClassForGroup = (className) => {
    setSelectedClass(className);
    setStudentModalVisible(true);
  };

  const toggleStudentSelection = (studentName) => {
    const updatedGroups = [...groups];
    const group = updatedGroups[selectedGroupIndex];
    const isSelected = group.students.includes(studentName);
    if (isSelected) {
      group.students = group.students.filter(
        (student) => student !== studentName
      );
    } else {
      group.students.push(studentName);
    }
    setGroups(updatedGroups);
  };

  const saveChanges = () => {
    alert("השינויים נשמרו בהצלחה");
    // Here you can also handle the actual saving logic, like sending the data to a server
  };

  const handlePlaceChange = (text, index) => {
    const updatedGroups = [...groups];
    updatedGroups[index].place = text;
    setGroups(updatedGroups);
  };

  const handleTimeChange = (event, selectedDate, index, isStart) => {
    if (selectedDate) {
      const updatedGroups = [...groups];
      if (isStart) {
        updatedGroups[index].startTime = selectedDate;
      } else {
        updatedGroups[index].endTime = selectedDate;
      }
      updatedGroups[index].time = `${updatedGroups[
        index
      ].startTime.getHours()}:${updatedGroups[index].startTime
        .getMinutes()
        .toString()
        .padStart(2, "0")} - ${updatedGroups[
        index
      ].endTime.getHours()}:${updatedGroups[index].endTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      setGroups(updatedGroups);
    }
  };

  const handleTeacherChange = (teacher) => {
    const updatedGroups = [...groups];
    updatedGroups[selectedGroupIndex].teacher = teacher;
    setGroups(updatedGroups);
    setTeacherModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{day}</Text>
      <TouchableOpacity style={styles.addButton} onPress={addGroupToDay}>
        <Text style={styles.addButtonText}>הוסף קבוצה</Text>
      </TouchableOpacity>
      <ScrollView>
        {groups.map((group, index) => (
          <View key={index} style={styles.groupContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteGroup(index)}
            >
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.input}
                value={group.place}
                onChangeText={(text) => handlePlaceChange(text, index)}
              />
              <Text style={styles.label}>:מקום</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.timeText}>
                {group.time.split(" - ")[0] || "בחר זמן"}
              </Text>
              <TouchableOpacity onPress={() => setShowStartTimePicker(index)}>
                <Text style={[styles.timeText, styles.placeholderText]}>
                  {group.time.split(" - ")[0] ? "" : "בחר זמן"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.label}>:זמן התחלה</Text>
              {showStartTimePicker === index && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, date) =>
                    handleTimeChange(event, date, index, true)
                  }
                />
              )}
            </View>
            <View style={styles.row}>
              <Text style={styles.timeText}>
                {group.time.split(" - ")[1] || "בחר זמן"}
              </Text>
              <TouchableOpacity onPress={() => setShowEndTimePicker(index)}>
                <Text style={[styles.timeText, styles.placeholderText]}>
                  {group.time.split(" - ")[1] ? "" : "בחר זמן"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.label}>:זמן סיום</Text>
              {showEndTimePicker === index && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, date) =>
                    handleTimeChange(event, date, index, false)
                  }
                />
              )}
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedGroupIndex(index);
                  setTeacherModalVisible(true);
                }}
              >
                <Text style={styles.teacherText}>
                  {group.teacher || "בחר מורה"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.label}>:מורה</Text>
            </View>
            <TouchableOpacity
              style={styles.classButton}
              onPress={() => {
                setSelectedGroupIndex(index);
                setClassSelectionModalVisible(true);
              }}
            >
              <Text style={styles.classButtonText}>בחר כיתות</Text>
            </TouchableOpacity>
            <View style={styles.classContainer}>
              {group.classes.map((className) => (
                <View key={className} style={styles.classSection}>
                  <TouchableOpacity
                    style={styles.classButton}
                    onPress={() => selectClassForGroup(className)}
                  >
                    <Text style={styles.classButtonText}>
                      {className} (
                      {
                        group.students.filter((student) =>
                          allStudents[className].includes(student)
                        ).length
                      }
                      )
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.studentList}>
                    {group.students
                      .filter((student) =>
                        allStudents[className].includes(student)
                      )
                      .map((student) => (
                        <Text key={student} style={styles.studentName}>
                          {student}
                        </Text>
                      ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.saveButtonText}>שמור</Text>
      </TouchableOpacity>

      <Modal
        visible={classSelectionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setClassSelectionModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>בחר כיתות (עד 3)</Text>
            {["6th", "7th", "8th", "9th", "10th", "11th", "12th"].map(
              (className) => (
                <TouchableOpacity
                  key={className}
                  style={[
                    styles.modalOption,
                    selectedClasses.includes(className) && styles.selectedClass,
                  ]}
                  onPress={() => toggleClassSelection(className)}
                >
                  <Text style={styles.modalOptionText}>{className}</Text>
                </TouchableOpacity>
              )
            )}
            <TouchableOpacity
              onPress={finalizeClassSelection}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>בוצע</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={teacherModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTeacherModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>בחר מורה</Text>
            {availableTeachers.map((teacher) => (
              <TouchableOpacity
                key={teacher}
                style={styles.modalOption}
                onPress={() => handleTeacherChange(teacher)}
              >
                <Text style={styles.modalOptionText}>{teacher}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setTeacherModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={studentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setStudentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              בחר תלמידים לכיתה {selectedClass}
            </Text>
            <FlatList
              data={allStudents[selectedClass]}
              keyExtractor={(item) => item}
              renderItem={({ item: student }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => toggleStudentSelection(student)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      {
                        color:
                          groups[selectedGroupIndex] &&
                          groups[selectedGroupIndex].students.includes(student)
                            ? "green"
                            : "black",
                      },
                    ]}
                  >
                    {student}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setStudentModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>חזור</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#85E1D7",
    padding: 20,
    paddingTop: 60, // Move content down
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  groupContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    textAlign: "right", // Align text to the right
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "right", // Align text to the right
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "red",
    borderRadius: 5,
    padding: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "flex-end",
  },
  label: {
    fontSize: 16,
    textAlign: "right", // Align text to the right
    marginLeft: 10,
  },
  input: {
    backgroundColor: "#E8E8E8",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    textAlign: "right", // Align text to the right
  },
  timeText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
  },
  placeholderText: {
    color: "#888",
  },
  teacherText: {
    fontSize: 16,
    color: "#0000FF",
  },
  classButton: {
    backgroundColor: "#E8E8E8",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    textAlign: "center",
  },
  classButtonText: {
    fontSize: 16,
  },
  classContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  classSection: {
    flex: 1,
    alignItems: "center",
  },
  studentList: {
    marginTop: 10,
  },
  studentName: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    textAlign: "right", // Align text to the right
  },
  modalOption: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#E8E8E8",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  selectedClass: {
    backgroundColor: "#ADD8E6",
  },
  modalOptionText: {
    fontSize: 18,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  backButton: {
    backgroundColor: "#00008B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default DayDetails;
