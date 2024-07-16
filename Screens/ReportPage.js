import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { AuthContext } from "../AuthProvider";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";

const ReportPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [extraField1, setExtraField1] = useState('');
  const [extraField2, setExtraField2] = useState('');
  const [extraField3, setExtraField3] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [isPastDeadline, setIsPastDeadline] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const { userData, db } = useContext(AuthContext);

  const submitReport = async () => {
    try {
      if (!selectedClass) {
        Alert.alert("שגיאה", "בחר קבוצה לפני הגשת הדו\"ח");
        return;
      }

      // Ensure userData is correctly populated
      if (!userData || !userData.role) {
        console.error("User data is not available or user role is missing", userData);
        Alert.alert("שגיאה", "נתוני משתמש לא זמינים");
        return;
      }

      const date = new Date();
      const dateId = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      const reportRef = doc(db, `jobReports/${dateId}/events/${selectedClass}/jobreport/${userData.name}`);

      const reportData = {
        "שם החווה שבה השתתפת": name,
        "מיקום": location,
        "כמה זמן עבדת": time,
        "שדה נוסף 1": extraField1,
        "שדה נוסף 2": extraField2,
        "שדה נוסף 3": extraField3,
        "כתבו פסקה כאן": paragraph,
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

  useEffect(() => {
    const checkDeadline = () => {
      const now = new Date();
      const deadline = new Date();
      deadline.setHours(23, 59, 59, 999); // Set the deadline to 23:59:59 today

      if (now > deadline) {
        setIsPastDeadline(true);
      }
    };

    checkDeadline();
    const intervalId = setInterval(checkDeadline, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if (!userData || !userData.role || userData.role !== 'student') {
      console.error("User data is not available or user is not a student", userData);
      return;
    }
    setLoading(true);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Adjusting month for 1-based index
    const currentYear = currentDate.getFullYear();
    const calendarId = `${currentYear}-${currentMonth}`;
    const dayId = currentDate.getDate();

    try {
      const eventsRef = collection(db, `calendar/${calendarId}/days/${dayId}/events`);
      const eventsSnapshot = await getDocs(eventsRef);
      const eventsList = [];

      eventsSnapshot.forEach((doc) => {
        const eventData = doc.data();
        if (eventData.students.includes(userData.name)) {
          eventsList.push({ id: doc.id, ...eventData });
        }
      });

      setEvents(eventsList);
      if (eventsList.length > 0) {
        setSelectedClass(eventsList[0].eventName);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events: ', error);
      setLoading(false);
    }
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
        <Text style={styles.title}>דו"ח העבודה</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.noteText}>ההגשה עד 23:59</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : events.length > 0 ? (
          <>
            <TextInput
              style={styles.textInput}
              placeholder="שם החווה שבה השתתפת"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.textInput}
              placeholder="מיקום"
              placeholderTextColor="#888"
              value={location}
              onChangeText={setLocation}
            />
            <TextInput
              style={styles.textInput}
              placeholder="כמה זמן עבדת"
              placeholderTextColor="#888"
              value={time}
              onChangeText={setTime}
            />
            <TextInput
              style={styles.textInput}
              placeholder="שדה נוסף 1"
              placeholderTextColor="#888"
              value={extraField1}
              onChangeText={setExtraField1}
            />
            <TextInput
              style={styles.textInput}
              placeholder="שדה נוסף 2"
              placeholderTextColor="#888"
              value={extraField2}
              onChangeText={setExtraField2}
            />
            <TextInput
              style={styles.textInput}
              placeholder="שדה נוסף 3"
              placeholderTextColor="#888"
              value={extraField3}
              onChangeText={setExtraField3}
            />
            <TextInput
              style={styles.paragraphInput}
              placeholder="כתבו פסקה כאן..."
              placeholderTextColor="#888"
              value={paragraph}
              onChangeText={setParagraph}
              multiline
            />
            <TouchableOpacity
              style={[styles.submitButton, isPastDeadline && styles.disabledButton]}
              onPress={submitReport}
              disabled={isPastDeadline}
            >
              <Text style={styles.submitButtonText}>הגש את הדו"ח</Text>
            </TouchableOpacity>
            {isPastDeadline && (
              <Text style={styles.deadlineText}>הדדליין להגשת הדו"ח עבר</Text>
            )}
          </>
        ) : (
          <Text style={styles.noEventsText}>אין אירועים להיום</Text>
        )}
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
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  deadlineText: {
    fontSize: 16,
    color: "#FF0000",
    fontWeight: "600",
    marginTop: 10,
  },
  noEventsText: {
    fontSize: 18,
    color: 'red',
    fontWeight: '600',
  },
});

export default ReportPage;
