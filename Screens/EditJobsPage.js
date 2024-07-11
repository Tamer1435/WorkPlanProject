import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { AuthContext } from "../AuthProvider";
import Modal from "react-native-modal";

const EditJobsPage = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, db } = useContext(AuthContext);

  const currentMonth = new Date().getMonth() + 1; // Adjusting month for 1-based index
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const calendarId = `${currentYear}-${currentMonth}`;

    const daysCollectionRef = collection(db, `calendar/${calendarId}/days`);
    const daysQuerySnapshot = await getDocs(daysCollectionRef);

    const eventList = [];

    for (const dayDoc of daysQuerySnapshot.docs) {
      const eventsSubCollectionRef = collection(
        db,
        `calendar/${calendarId}/days/${dayDoc.id}/events`
      );
      const eventsQuerySnapshot = await getDocs(eventsSubCollectionRef);

      eventsQuerySnapshot.forEach((eventDoc) => {
        eventList.push({
          id: eventDoc.id,
          day: dayDoc.id,
          ...eventDoc.data(),
        });
      });
    }
    eventList.sort((a, b) => {
      return a.day - b.day;
    });
    setEvents(eventList);
    setLoading(false);
  };

  const updateEvent = async () => {
    if (currentEvent) {
      const { id, day, ...eventData } = currentEvent;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const calendarId = `${currentYear}-${currentMonth + 1}`;

      try {
        const eventDocRef = doc(
          db,
          `calendar/${calendarId}/days/${day}/events/${id}`
        );
        await updateDoc(eventDocRef, eventData);
        setIsModalVisible(false);
        setCurrentEvent(null);
        fetchEvents();
      } catch (error) {
        console.error("Error updating event: ", error);
      }
    }
  };

  const removeEvent = async (id, day) => {
    Alert.alert(
      "אשר את המחיקה",
      "האם אתה בטוח שברצונך למחוק את האירוע הזו?",
      [
        {
          text: "לבטל",
          style: "cancel",
        },
        {
          text: "למחוק",
          onPress: async () => {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const calendarId = `${currentYear}-${currentMonth + 1}`;

            try {
              await deleteDoc(
                doc(db, `calendar/${calendarId}/days/${day}/events/${id}`)
              );
              fetchEvents();
              alert("האירוע נמחקה בהצלחה");
            } catch (error) {
              console.error("Error deleting event: ", error);
              Alert.alert("שגיאה", "לא ניתן להסיר את אירוע");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventContainer}>
      <View>
        <Text>{item.eventName}</Text>
        <Text>
          {item.day} / {currentMonth}
        </Text>
        <Text>{item.location}</Text>
        <Text>{item.job}</Text>
      </View>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setCurrentEvent(item);
            setIsModalVisible(true);
          }}
        >
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonDelete}
          onPress={() => removeEvent(item.id, item.day)}
        >
          <Text>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={{ height: 20, width: 30 }}
            source={require("../Images/back button.png")}
          />
        </TouchableOpacity>
        <Text style={styles.header}>ניהול אירועים</Text>
      </View>
      <View style={styles.scrollSection}>
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item) => `${item.id}-${item.day}`}
        />
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.blur}>
          <View style={styles.modalContainer}>
            {currentEvent && (
              <>
                <TextInput
                  placeholder="Event Name"
                  value={currentEvent.eventName}
                  onChangeText={(text) =>
                    setCurrentEvent({ ...currentEvent, eventName: text })
                  }
                  style={styles.input}
                />
                <TextInput
                  placeholder="Location"
                  value={currentEvent.location}
                  onChangeText={(text) =>
                    setCurrentEvent({ ...currentEvent, location: text })
                  }
                  style={styles.input}
                />
                <TextInput
                  placeholder="Meeting Place"
                  value={currentEvent.meetingPlace}
                  onChangeText={(text) =>
                    setCurrentEvent({ ...currentEvent, meetingPlace: text })
                  }
                  style={styles.input}
                />
                <TextInput
                  placeholder="Attendant"
                  value={currentEvent.attendant}
                  onChangeText={(text) =>
                    setCurrentEvent({ ...currentEvent, attendant: text })
                  }
                  style={styles.input}
                />
                <TextInput
                  placeholder="Vehicle"
                  value={currentEvent.vehicle}
                  onChangeText={(text) =>
                    setCurrentEvent({ ...currentEvent, vehicle: text })
                  }
                  style={styles.input}
                />
                <TextInput
                  placeholder="Students (comma separated)"
                  value={currentEvent.students.join(", ")}
                  onChangeText={(text) =>
                    setCurrentEvent({
                      ...currentEvent,
                      students: text.split(",").map((s) => s.trim()),
                    })
                  }
                  style={styles.input}
                />
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={styles.buttonUpdate}
                    onPress={updateEvent}
                  >
                    <Text>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      {/* Loading popup */}
      <Modal visible={loading} transparent animationType="fade">
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
  container: {
    flex: 1,
    backgroundColor: "#85E1D7",
  },
  headerContainer: {
    paddingTop: 35,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  scrollSection: {
    flex: 1,
    padding: 20,
  },
  eventContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  blur: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#808080",
    borderRadius: 15,
    borderWidth: 0.5,
  },
  modalContainer: {
    width: "90%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    alignContent: "center",
  },
  input: {
    height: 40,
    width: "95%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    height: 60,
    width: 100,
    backgroundColor: "#ADD8E6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: 10,
    margin: 5,
  },
  buttonUpdate: {
    height: 60,
    width: 100,
    backgroundColor: "#5DBF72",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: 10,
    margin: 5,
  },
  buttonDelete: {
    height: 60,
    width: 100,
    backgroundColor: "#FF2400",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    margin: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5C4DFF",
    shadowRadius: 20,
    shadowOpacity: 0.25,
  },
  loadingContent: {
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

export default EditJobsPage;
