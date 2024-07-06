import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Button,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { format } from "date-fns";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { AuthContext } from "../AuthProvider";
import OptionsModal from "./OptionsModal";

const TeacherPage = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [todayActivities, setTodayActivities] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const { user, userData, db } = useContext(AuthContext);
  const auth = getAuth();

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth();
  const dayName = currentDate.toLocaleString("he-IL", {
    weekday: "long",
    timeZone: "UTC",
  });
  const monthName = currentDate.toLocaleString("he-IL", {
    month: "long",
    timeZone: "UTC",
  });

  let name = "";

  if (userData) {
    name = userData.name;
  } else {
    name = "no name";
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    refreshTodaySection();
  }, []);

  const refreshTodaySection = async () => {
    await fetchCalendarInfo();
    const forToday = [];
    if (calendar) {
      calendar.map((element) => {
        if (element.day == day) {
          forToday.push(element);
        }
      });
      if (forToday.length != 0) {
        // Sort the activities by eventName
        forToday.sort((a, b) => {
          if (a.timeOfMoving < b.timeOfMoving) return -1;
          if (a.timeOfMoving > b.timeOfMoving) return 1;
          return 0;
        });

        setTodayActivities(forToday);
      }
    }
  };

  const fetchCalendarInfo = async () => {
    try {
      const currentMonth = new Date().getMonth() + 1; // Adjusting month for 1-based index
      const currentYear = new Date().getFullYear();
      const calendarId = `${currentYear}-${currentMonth}`;
      const daysCollectionRef = collection(db, `calendar/${calendarId}/days`);
      const daysQuerySnapshot = await getDocs(daysCollectionRef);

      const events = [];

      for (const dayDoc of daysQuerySnapshot.docs) {
        const eventsSubCollectionRef = collection(
          db,
          `calendar/${calendarId}/days/${dayDoc.id}/events`
        );
        const eventsQuerySnapshot = await getDocs(eventsSubCollectionRef);

        eventsQuerySnapshot.forEach((eventDoc) => {
          if (userData) {
            if (userData.role == "teacher") {
              if (eventDoc.data().attendant == userData.name) {
                const data = eventDoc.data();

                const timestamp = data.timeOfMoving;
                if (timestamp && timestamp.seconds) {
                  data.timeOfMoving = format(
                    data.timeOfMoving.toDate(),
                    "hh:mm a"
                  ); // Convert timestamp to string
                }
                events.push({
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
                  data.timeOfMoving = format(
                    data.timeOfMoving.toDate(),
                    "hh:mm a"
                  ); // Convert timestamp to string
                }
                events.push({
                  key: eventDoc.id,
                  day: dayDoc.id,
                  ...data,
                });
              }
            }
          }
        });
      }
      setCalendar(events);
    } catch (error) {
      console.error("Error fetching calendar info: ", error);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container} behavior="padding">
      <View style={styles.upperContainer}>
        <View style={styles.headerContainer}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <Text style={styles.title}>WorkPlan</Text>
          </View>
          <TouchableOpacity style={styles.optionButton} onPress={openModal}>
            <Image
              style={{ height: 22, width: 30 }}
              source={require("../Images/option button.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.personalSection}>
          <View style={{ flex: 1, paddingLeft: 30 }}>
            <Image source={require("../Images/icon clock.png")} />
          </View>
          <View style={{ paddingRight: 20 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                textAlign: "right",
                paddingBottom: 10,
              }}
            >
              הי {name}
            </Text>
            <Text style={{ fontSize: 15, textAlign: "right" }}>
              {" "}
              {dayName}, {day} {monthName}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.middleContainer}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            textAlign: "right",
            paddingBottom: 10,
            paddingRight: 20,
          }}
        >
          {" "}
          מה יש לנו היום
        </Text>
        <View style={styles.todaysSection}>
          {todayActivities.length === 0 ? (
            <TouchableOpacity
              onPress={() => refreshTodaySection()}
              style={{ alignItems: "center" }}
            >
              <Image source={require("../Images/cal icon.png")} />
              <Text style={{ fontWeight: "600", marginTop: 5 }}>
                אין לך אירועי עבודה היום
              </Text>
              <Text style={{ color: "blue", fontWeight: "600", marginTop: 5 }}>
                לחץ לרענן
              </Text>
            </TouchableOpacity>
          ) : (
            <FlatList
              data={todayActivities}
              keyExtractor={(item) => item.eventName + "-" + item.location}
              renderItem={({ item }) => (
                <View style={styles.todaysEvent}>
                  <Text style={styles.todaysEventText}>
                    אירוע: {item.eventName}
                  </Text>
                  <Text style={styles.todaysEventText}>
                    מקום: {item.location}
                  </Text>
                  <Text style={styles.todaysEventText}>
                    זמן תנועה: {item.timeOfMoving}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </View>

      <View style={styles.lowerContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("RoleCalendar")}
          >
            <Image
              style={{ marginTop: 10 }}
              source={require("../Images/calendar icon.png")}
            />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>לוח השנה</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Availability")}
          >
            <Image source={require("../Images/availabity icon.png")} />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>להגדיר זמינות</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ViewContacts")}
            style={styles.button}
          >
            <Image
              style={{ marginTop: 10 }}
              source={require("../Images/contact icon.png")}
            />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>דף קשר</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Attendance")}
          >
            <Image source={require("../Images/attendance icon.png")} />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>נוכחות</Text>
          </TouchableOpacity>
        </View>
      </View>
      <OptionsModal
        visible={modalVisible}
        onLogout={handleLogout}
        onClose={closeModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#85E1D7",
  },
  upperContainer: {
    flex: 1,
    paddingTop: 30,
  },
  middleContainer: {
    flex: 1,
  },
  lowerContainer: {
    flex: 2,
    justifyContent: "flex-start",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  optionButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    right: 10,
    top: 20,
    padding: 10,
    alignSelf: "flex-end",
    position: "absolute",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },

  personalSection: {
    flexDirection: "row",
    alignItems: "stretch",
    top: 30,
  },

  todaysSection: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    width: "90%",
    height: "80%",
    alignSelf: "center",
    justifyContent: "center",
    padding: 10,
  },
  todaysEvent: {
    backgroundColor: "rgba(0,0,255,0.35)",
    borderRadius: 10,
    padding: 5,
    margin: 5,
    alignSelf: "center",
    justifyContent: "space-evenly",
    width: "80%",
  },
  todaysEventText: {
    fontSize: 15,
    fontWeight: "600",
    padding: 5,
  },

  row: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    flex: 1,
    margin: 3,
    padding: 5,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 10,
  },

  buttonNull: {
    flex: 1,
    margin: 3,
    padding: 5,
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 10,
  },

  divider: {
    width: "98%",
    height: 1,
    backgroundColor: "#85E1D7",
    marginVertical: 10,
  },

  buttonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
});

export default TeacherPage;
