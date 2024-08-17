import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { AuthContext } from "../AuthProvider";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { format } from "date-fns";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";

const daysOfWeek = [
  "יום ראשון",
  "יום א",
  "יום שני",
  "יום ב",
  "יום שלישי",
  "יום ג",
  "יום רביעי",
  "יום ד",
  "יום חמישי",
  "יום ה",
  "יום שישי",
  "יום ו",
  "יום שבת",
  "יום ש",
];

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getDayName = (date) => {
  const options = { weekday: "long" };
  return new Intl.DateTimeFormat("he-IL", options).format(date);
};

const RoleCalendarPage = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const { user, userData, db } = useContext(AuthContext);
  const [ontoHeaderDay, setHeaderDay] = useState(null);
  const [indexOfSelectedDay, setIndexOfSelectedDay] = useState(null);
  const [daysEvents, setDaysEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState(null);

  // Refresh the data when mounted
  useEffect(() => {
    refreshData();
  }, []);

  // Getting date info
  const currentDate = new Date();
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const monthName = currentDate.toLocaleString("he-IL", {
    month: "long",
    timeZone: "UTC",
  });
  const currentYear = new Date().getFullYear();
  const preDaysInMonth = getDaysInMonth(currentMonth, currentYear);
  const daysInMonth = Array.from({ length: preDaysInMonth }, (_, i) => 1 + i);
  const daysStartingFromCurrent = daysInMonth.map((day) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayName = getDayName(date);
    return { day, dayName };
  });

  // Getting the calendar from database
  const refreshData = async () => {
    setLoading(true);
    try {
      const calendarId = `${currentYear}-${currentMonth + 1}`;
      const daysCollectionRef = collection(db, `calendar/${calendarId}/days`);
      const daysQuerySnapshot = await getDocs(daysCollectionRef);

      const eventslist = [];

      for (const dayDoc of daysQuerySnapshot.docs) {
        const eventsSubCollectionRef = collection(
          db,
          `calendar/${calendarId}/days/${dayDoc.id}/events`
        );
        const eventsQuerySnapshot = await getDocs(eventsSubCollectionRef);

        eventsQuerySnapshot.forEach((eventDoc) => {
          if (userData.role == "teacher") {
            if (eventDoc.data().attendant == userData.name) {
              const data = eventDoc.data();

              const timestamp = data.timeOfMoving;
              if (timestamp && timestamp.seconds) {
                data.timeOfMoving = format(timestamp.toDate(), "hh:mm a"); // Convert timestamp to string
              }

              eventslist.push({
                key: eventDoc.id,
                day: dayDoc.id,
                ...data,
              });
            }
          } else if (userData.role == "student") {
            if (eventDoc.data().students.includes(userData.name)) {
              const data = eventDoc.data();

              const timestamp = data.timeOfMoving;
              if (timestamp && timestamp.seconds) {
                data.timeOfMoving = format(timestamp.toDate(), "hh:mm a"); // Convert timestamp to string
              }

              eventslist.push({
                key: eventDoc.id,
                day: dayDoc.id,
                ...data,
              });
            }
          }
        });
      }
      setEvents(eventslist);
    } catch (error) {
      console.error("Error fetching calendar info: ", error);
    }
    setLoading(false);
  };

  const parseTime = (time) => {
    // to help with sorting the events by time
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return new Date(`2020-01-01T${hours}:${minutes}:00`);
  };

  const renderDay = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.dayButton,
        selectedDay === item.day && styles.selectedDayButton,
      ]}
      onPress={() => {
        setSelectedDay(item.day);
        let index = -1;
        const eventsForTheDay = [];
        events.map((event) => {
          if (event.day == item.day) {
            index = events.indexOf(event);
            eventsForTheDay.push(events[index]);
          }
        });
        if (index != -1) {
          // Sort the activities by eventName
          eventsForTheDay.sort((a, b) => {
            const timeA = parseTime(a.timeOfMoving);
            const timeB = parseTime(b.timeOfMoving);
            return timeA - timeB;
          });
          setDaysEvents(eventsForTheDay);
        } else {
          setDaysEvents(null);
        }
        setHeaderDay(
          " " +
            daysOfWeek[daysOfWeek.indexOf(item.dayName)] +
            "," +
            " " +
            item.day +
            " " +
            monthName
        );
      }}
    >
      <Text style={styles.dayText}>{item.day}</Text>
      <Text style={styles.dayText}>
        {daysOfWeek[daysOfWeek.indexOf(item.dayName) + 1]}
      </Text>
    </TouchableOpacity>
  );

  const renderEvent = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleEventPress(item)}
      style={styles.eventContainer}
    >
      <View>
        <Text style={styles.eventText}>{item.eventName}</Text>
        <Text style={styles.eventSubText}>עבודה:{item.job}</Text>
        <Text style={styles.eventSubText}>מקום:{item.location}</Text>
      </View>
      <View>
        <Text style={styles.eventSubText}>{item.timeOfMoving}</Text>
      </View>
    </TouchableOpacity>
  );

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleEventPress = (event) => {
    setSelectedEvent(event);
    toggleModal();
  };

  return (
    <LinearGradient
      colors={["#8d82ff", "#4036b3"]} // Darker to lighter gradient
      start={[0, 0]} // Start from top-left corner
      end={[0.25, 0.25]} // End at bottom-right corner
      style={styles.container}
    >
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={{ height: 20, width: 30 }}
            source={require("../Images/back button.png")}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {monthName} {currentYear}
        </Text>
        <FlatList
          data={daysStartingFromCurrent}
          renderItem={renderDay}
          initialScrollIndex={currentDay - 1}
          getItemLayout={
            (data, index) => ({
              length: 105,
              offset: 99 * index,
              index,
            }) // Assuming each item has a height of 50
          }
          keyExtractor={(item) => item.day}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daysList}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventText}>אירועי עבודה</Text>
          <Text style={styles.dateText}>{ontoHeaderDay}</Text>
        </View>
        {selectedDay ? (
          <FlatList
            data={daysEvents}
            renderItem={renderEvent}
            keyExtractor={(item) => item.key}
          />
        ) : (
          <Text style={styles.noEventsText}>בחר יום לראות אירועים</Text>
        )}
      </View>
      <Modal
        isVisible={isModalVisible}
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "flex-end",
          alignSelf: "center",
        }}
        onBackdropPress={toggleModal}
      >
        <View style={styles.modalContent}>
          {selectedEvent && (
            <>
              <Text style={styles.modalTitle}>{selectedEvent.eventName}</Text>
              <Text style={styles.modalDate}>{selectedEvent.timeOfMoving}</Text>
              <View style={{ alignSelf: "flex-end" }}>
                <Text style={styles.modalTime}></Text>
                <Text style={styles.modalLocation}>
                  עבודה: {selectedEvent.job}
                </Text>
                <Text style={styles.modalLocation}>
                  מקום: {selectedEvent.location}
                </Text>
                <Text style={styles.modalMeetingPlace}>
                  מקום התכנסות: {selectedEvent.meetingPlace}
                </Text>
                <Text style={styles.modalAttendant}>
                  מורה: {selectedEvent.attendant}
                </Text>
                <Text style={styles.modalVehicle}>
                  רכב: {selectedEvent.vehicle}
                </Text>
                <Text style={styles.modalVehicle}>
                  משך האירוע (בשעות): {selectedEvent.duration}
                </Text>
                <Text style={styles.modalVehicle}>
                  בעל חווה: {selectedEvent.farmOwner}
                </Text>
                <Text style={styles.modalVehicle}>
                  הטלפון של הבעלים: {selectedEvent.ownerPhone}
                </Text>
                <Text style={styles.modalStudentsTitle}>סטודנטים:</Text>
                <Text style={styles.modalStudents}>
                  {selectedEvent.students.join("\n")}
                </Text>
              </View>
            </>
          )}
        </View>
      </Modal>
      {/* Loading popup */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>טוען...</Text>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "10%",
  },
  topContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  backButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    paddingRight: 40,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  bottomContainer: {
    flex: 2.5,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: "hidden",
  },
  headerText: {
    fontSize: 26,
    color: "#ffffff",
    fontWeight: "bold",
    paddingLeft: 20,
    top: 25,
    textAlign: "left",
  },
  daysList: {
    borderColor: "#ddd",
  },
  dayButton: {
    padding: 20,
    margin: 10,
    backgroundColor: "#7E8BFF",
    width: 80,
    height: 85,
    borderRadius: 15,
    alignSelf: "flex-end",
    alignItems: "center",
    alignContent: "flex-end",
  },
  selectedDayButton: {
    backgroundColor: "#FFFFFF",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  eventsContainer: {
    flex: 2,
    padding: 20,
  },
  eventHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 35,
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: "#000",
  },
  eventContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 20,
    width: "90%",
    justifyContent: "space-between",
    alignSelf: "center",
    margin: 10,
    backgroundColor: "#7E8BFF",
    opacity: 0.75,
    borderColor: "#000000",
    borderRadius: 20,
    borderWidth: 0.5,
  },
  eventText: {
    marginRight: 20,
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    textAlign: "right",
  },
  eventSubText: {
    marginRight: 20,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    textAlign: "right",
  },
  dateText: {
    marginLeft: 20,
    justifyContent: "flex-end",
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    opacity: 0.5,
  },
  noEventsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "flex-end",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDate: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalTime: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalLocation: {
    textAlign: "right",
    fontSize: 16,
    marginBottom: 5,
  },
  modalMeetingPlace: {
    textAlign: "right",
    fontSize: 16,
    marginBottom: 5,
  },
  modalAttendant: {
    textAlign: "right",
    fontSize: 16,
    marginBottom: 5,
  },
  modalStudentsTitle: {
    textAlign: "right",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
    marginBottom: 5,
  },
  modalStudents: {
    textAlign: "right",
    fontSize: 16,
    marginBottom: 5,
  },
  modalVehicle: {
    textAlign: "right",
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5C4DFF",
    shadowRadius: 20,
    shadowOpacity: 0.25,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
  },
});

export default RoleCalendarPage;
