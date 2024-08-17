import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
  Image,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const MakeReportPage = ({ navigation }) => {
  const [questions, setQuestions] = useState([
    "שם החווה שבה השתתפת",
    "כמה זמן עבדת",
    "שדה נוסף 1",
    "שדה נוסף 2",
    "שדה נוסף 3",
  ]);
  const [newQuestion, setNewQuestion] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const addQuestion = () => {
    if (newQuestion.trim() !== "") {
      setQuestions([...questions, newQuestion]);
      setNewQuestion("");
    } else {
      Alert.alert("אנא הכנס שאלה.");
    }
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deadline;
    setDeadline(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || deadline;
    setDeadline(currentTime);
  };

  const saveSettings = () => {
    Alert.alert("ההגדרות נשמרו בהצלחה.");
    navigation.goBack();
  };

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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>נהל שאלות לדו"ח</Text>
        {questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>{question}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeQuestion(index)}
            >
              <Text style={styles.removeButtonText}>מחק</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TextInput
          style={styles.textInput}
          placeholder="הכנס שאלה חדשה"
          value={newQuestion}
          onChangeText={setNewQuestion}
        />
        <TouchableOpacity style={styles.addButton} onPress={addQuestion}>
          <Text style={styles.addButtonText}>הוסף שאלה</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setDatePickerVisibility(true)}
        >
          <Text style={styles.dateTimeButtonText}>
            הגדר תאריך: {deadline.toLocaleDateString()}
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
                value={deadline}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            </View>
          </TouchableOpacity>
        </Modal>
        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setTimePickerVisibility(true)}
        >
          <Text style={styles.dateTimeButtonText}>
            הגדר זמן:{" "}
            {`${deadline.getHours()}:${
              deadline.getMinutes() < 10
                ? "0" + deadline.getMinutes()
                : deadline.getMinutes()
            }`}
          </Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={isTimePickerVisible}
          animationType="slide"
        >
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setTimePickerVisibility(false)}
          >
            <View style={styles.modalContainer}>
              <DateTimePicker
                value={deadline}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            </View>
          </TouchableOpacity>
        </Modal>
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>שמור הגדרות</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingTop: "10%",
    backgroundColor: "#E3E3E3",
  },
  scrollContainer: {
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
  questionContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
    textAlign: "right",
  },
  removeButton: {
    backgroundColor: "#FF0000",
    borderRadius: 5,
    padding: 5,
  },
  removeButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  textInput: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    height: 50,
    width: "100%",
    textAlign: "right",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
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
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    width: "100%",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "600",
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
});

export default MakeReportPage;
