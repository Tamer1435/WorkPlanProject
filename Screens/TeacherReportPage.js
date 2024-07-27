import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../AuthProvider";
import { doc, setDoc } from "firebase/firestore";

const TeacherReportPage = ({ navigation }) => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [farmName, setFarmName] = useState('');
  const [comments, setComments] = useState('');
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const { userData, db } = useContext(AuthContext);

  const submitReport = async () => {
    try {
      // Ensure userData is correctly populated
      if (!userData || !userData.role) {
        console.error("User data is not available or user role is missing", userData);
        Alert.alert("שגיאה", "נתוני משתמש לא זמינים");
        return;
      }

      const date = new Date();
      const dateId = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      const reportRef = doc(db, `teacherReports/${dateId}/events/${farmName}/reports/${userData.name}`);

      const reportData = {
        "שעת התחלה": startTime,
        "שעת סיום": endTime,
        "שם החווה": farmName,
        "הערות": comments,
        "submittedAt": new Date(),
      };

      await setDoc(reportRef, reportData);
      Alert.alert('הדו"ח הוגש בהצלחה');
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting report: ", error);
      Alert.alert("שגיאה", "לא ניתן להגיש את הדו\"ח");
    }
  };

  const handleStartTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || startTime;
    setStartTimePickerVisibility(false);
    setStartTime(currentDate);
  };

  const handleEndTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || endTime;
    setEndTimePickerVisibility(false);
    setEndTime(currentDate);
  };

  return (
    <KeyboardAvoidingView
      style={styles.pageContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80}
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
        <Text style={styles.title}>דו"ח יומי</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.noteText}>ההגשה עד 23:59</Text>
        <>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setStartTimePickerVisibility(true)}
          >
            <Text style={styles.dateTimeButtonText}>
              שעת התחלה: {startTime.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
          <Modal
            transparent={true}
            visible={isStartTimePickerVisible}
            animationType="slide"
          >
            <TouchableOpacity
              style={styles.modalBackground}
              onPress={() => setStartTimePickerVisibility(false)}
            >
              <View style={styles.modalContainer}>
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  display="default"
                  onChange={handleStartTimeChange}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setEndTimePickerVisibility(true)}
          >
            <Text style={styles.dateTimeButtonText}>
              שעת סיום: {endTime.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
          <Modal
            transparent={true}
            visible={isEndTimePickerVisible}
            animationType="slide"
          >
            <TouchableOpacity
              style={styles.modalBackground}
              onPress={() => setEndTimePickerVisibility(false)}
            >
              <View style={styles.modalContainer}>
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  display="default"
                  onChange={handleEndTimeChange}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          <TextInput
            style={styles.textInput}
            placeholder="שם החווה"
            placeholderTextColor="#888"
            value={farmName}
            onChangeText={setFarmName}
          />
          <TextInput
            style={styles.paragraphInput}
            placeholder="הערות"
            placeholderTextColor="#888"
            value={comments}
            onChangeText={setComments}
            multiline
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={submitReport}
          >
            <Text style={styles.submitButtonText}>הגש את הדו"ח</Text>
          </TouchableOpacity>
        </>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#85E1D7",
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
  noteText: {
    fontSize: 18,
    color: "#FF0000",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
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
  textInput: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    height: 50,
    width: "100%",
    textAlign: "right",
    marginBottom: 30,
  },
  paragraphInput: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    height: 200,
    width: "100%",
    textAlign: "right",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#888",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 18,
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

export default TeacherReportPage;
