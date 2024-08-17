import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../AuthProvider";
import {
  collection,
  setDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";

const TeacherReportPage = ({ navigation }) => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [farmName, setFarmName] = useState("");
  const [comments, setComments] = useState("");
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFarmSelection, setShowFarmSelection] = useState(false);
  const [farms, setFarms] = useState([]);
  const [eventName, setEventName] = useState("");
  const { userData, db } = useContext(AuthContext);

  useEffect(() => {
    const fetchFarmsAndEvents = async () => {
      setIsLoading(true);

      try {
        const farmsCollectionRef = collection(db, "farms");
        const farmsCollection = await getDocs(farmsCollectionRef);
        setFarms(
          farmsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        const date = new Date();
        const dateId = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;

        const eventsQuery = query(
          collection(
            db,
            "calendar",
            `${date.getFullYear()}-${date.getMonth() + 1}`,
            "days",
            `${date.getDate()}`,
            "events"
          ),
          where("attendant", "==", userData.name)
        );
        const eventsSnapshot = await getDocs(eventsQuery);

        if (!eventsSnapshot.empty) {
          const event = eventsSnapshot.docs[0].data();
          setEventName(event.eventName);
        } else {
          setEventName("");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmsAndEvents();
  }, [db, userData]);

  const handleFarmChange = (farm) => {
    setFarmName(`${farm.name} - ${farm.location}`);
    setEventName(eventName); // Update the event name with the selected farm name
    setShowFarmSelection(false);
  };

  const submitReport = async () => {
    const missingFields = [];

    if (!eventName) missingFields.push("שם הקבוצה");
    if (!farmName) missingFields.push("שם החווה");
    if (!startTime) missingFields.push("שעת התחלה");
    if (!endTime) missingFields.push("שעת סיום");

    if (missingFields.length > 0) {
      Alert.alert(
        "שגיאה",
        `אנא מלא את השדות הבאים: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      if (!userData || !userData.role) {
        console.error(
          "User data is not available or user role is missing",
          userData
        );
        Alert.alert("שגיאה", "נתוני משתמש לא זמינים");
        return;
      }

      const date = new Date();
      const dateId = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      const prePath = doc(db, `teacherReports/${dateId}/events/${eventName}`);
      await setDoc(prePath, { initialized: true });

      const reportRef = doc(
        db,
        `teacherReports/${dateId}/events/${eventName}/reports/${userData.name}`
      );

      const reportData = {
        "שם קבוצה": eventName,
        "שעת התחלה": startTime,
        "שעת סיום": endTime,
        "שם החווה": farmName,
        הערות: comments || "", // Optional field, can be empty
        submittedAt: new Date(),
      };

      await setDoc(reportRef, reportData);
      Alert.alert('הדו"ח הוגש בהצלחה');
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting report: ", error);
      Alert.alert("שגיאה", 'לא ניתן להגיש את הדו"ח');
    }
  };

  const handleStartTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || startTime;
    setStartTime(currentDate);
    setStartTimePickerVisibility(false);
  };

  const handleEndTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || endTime;
    setEndTime(currentDate);
    setEndTimePickerVisibility(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            borderWidth: 0.5,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>טוען...</Text>
        </View>
      </View>
    );
  }

  if (!eventName) {
    return (
      <View style={styles.noEventContainer}>
        <Text style={styles.noEventText}>אין אירועים זמינים להגשת דו"ח</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>חזור</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.pageContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setStartTimePickerVisibility(false);
          setEndTimePickerVisibility(false);
        }}
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
          <Text style={styles.title}>{eventName}</Text>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.noteText}>ההגשה עד 23:59</Text>
            <>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() =>
                  setStartTimePickerVisibility(!isStartTimePickerVisible)
                }
              >
                <Text style={styles.dateTimeButtonText}>
                  שעת התחלה: {startTime.getHours()}:{startTime.getMinutes()}
                </Text>
              </TouchableOpacity>
              {isStartTimePickerVisible && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="spinner"
                    is24Hour={true}
                    onChange={handleStartTimeChange}
                  />
                </View>
              )}

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() =>
                  setEndTimePickerVisibility(!isEndTimePickerVisible)
                }
              >
                <Text style={styles.dateTimeButtonText}>
                  שעת סיום: {endTime.getHours()}:{endTime.getMinutes()}
                </Text>
              </TouchableOpacity>
              {isEndTimePickerVisible && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="spinner"
                    is24Hour={true}
                    onChange={handleEndTimeChange}
                  />
                </View>
              )}

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowFarmSelection(!showFarmSelection)}
              >
                <Text style={styles.dateTimeButtonText}>
                  שם החווה: {farmName}
                </Text>
              </TouchableOpacity>
              {showFarmSelection && (
                <View style={styles.farmListContainer}>
                  {farms.map((farm) => (
                    <TouchableOpacity
                      key={farm.id}
                      style={styles.farmOption}
                      onPress={() => handleFarmChange(farm)}
                    >
                      <Text style={styles.farmOptionText}>{farm.name}</Text>
                      <Text style={styles.farmOptionText}>{farm.location}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#85E1D7",
    paddingTop: "10%",
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
  },
  backButtonText: {
    color: "#0000EE",
    fontSize: 16,
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
  farmListContainer: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 5,
    marginBottom: 20,
  },
  farmOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  farmOptionText: {
    fontSize: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#85E1D7",
  },
  loadingText: {
    color: "#000",
    fontSize: 16,
    marginTop: 10,
  },
  noEventContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#85E1D7",
  },
  noEventText: {
    fontSize: 18,
    color: "#FF0000",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  pickerContainer: {
    backgroundColor: "#FFF",
    width: "100%",
  },
});

export default TeacherReportPage;
